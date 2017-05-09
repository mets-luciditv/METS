
const mysqlx = require('@mysql/xdevapi');
const mysql      = require('mysql');
const winston = require('winston');
const Promise = require('promise');
const Stack =require('stackjs')

module.exports.add= async function (schemaName,tableName,nodes)
{
    var session=await mysqlx.getSession({
        host:process.env.dbHost,
        port:process.env.dbPort,
        dbUser:process.env.dbUser,
        dbPassword:process.env.dbPassword
    })
    for(i in nodes){
        var node=nodes[i];
        for (var k in node) {
            if(node[k]==='' || node[k]===null){
                delete node[k];
            }
        }
        await session.getSchema(schemaName).getTable(tableName)
        .insert(Object.keys(node))
        .values(Object.values(node).map(f=>f.toString()))
        .execute();
    }
    await rebuildMpttIndex(schemaName,tableName);
    session.close();
}

function loadMpttTree(nodes){
    var stack=new Stack();
    for(i in nodes){
        var node= nodes[i];
        if(stack.size() > 0 ){
            while(stack.peek().rgt < node.rgt){
                stack.pop();
            }
        }
        if (stack.size() > 0)
        {
            if (typeof stack.peek().children == 'undefined'){
                stack.peek().children=[];
            }
            stack.peek().children.push(node);
        }
        stack.push(node);
    }
    for(i in nodes)
    {
        delete nodes[i].lft;
        delete nodes[i].rgt;
    }
    return nodes[0];
}
async function update (schemaName,tableName,nodes)
{
    var session=await mysqlx.getSession({
        host:process.env.dbHost,
        port:process.env.dbPort,
        dbUser:process.env.dbUser,
        dbPassword:process.env.dbPassword
    })
    for(i in nodes){
        var node=nodes[i];
        var cmd=session.getSchema(schemaName).getTable(tableName).update().where('`id`== :id').bind({'id':node.id})
        for(k in node){
            cmd.set(k,node[k]);
        }
        await cmd.execute();
    }
    await rebuildMpttIndex(schemaName,tableName);
    session.close();
}
module.exports.update = update;
module.exports.read = async function (schemaName,tableName,id)
{
    var pool  = mysql.createPool({
        connectionLimit : 10,
        host     : process.env.dbHost,
        user     : process.env.dbUser,
        password : process.env.dbPassword,
        database : schemaName
    });
    return new Promise(function(resolve, reject) {
        pool.query('SELECT a.* FROM ?? a,?? b where a.lft >= b.lft and a.lft  <= b.rgt and b.id= ? order by a.lft', [tableName,tableName,id], function (error, results, fields) {
            resolve(loadMpttTree(results));
        });
    });
}

module.exports.remove = async function (schemaName,tableName,ids)
{
    var session=await mysqlx.getSession({
        host:process.env.dbHost,
        port:process.env.dbPort,
        dbUser:process.env.dbUser,
        dbPassword:process.env.dbPassword
    })
    for(i in ids){
        var id=ids[i]
        await session.getSchema(schemaName).getTable(tableName).delete('`id`== :id').bind({'id':id}).execute();
    }
    await rebuildMpttIndex(schemaName,tableName);
    session.close();
}

async function rebuildMpttIndex(schemaName,tableName){
    var session=await mysqlx.getSession({
        host:process.env.dbHost,
        port:process.env.dbPort,
        dbUser:process.env.dbUser,
        dbPassword:process.env.dbPassword
    })
    var table=session.getSchema(schemaName).getTable(tableName)
    var rootQuery=table.select('*').where('`id` == :id').bind({"id":'root'})
    var root={};
    var rootRow={};
    var rootMeta={};
    await rootQuery.execute(function(row){
        rootRow=row;
    },function(meta){
        rootMeta=meta;
    });
    for(i in rootMeta){
        var column=rootMeta[i]
        root[column.name]=rootRow[i];
    }
    await buildNode(table,root);
    await sortByMPTT(schemaName,tableName,root,0);
    session.close();
    return true;
}
module.exports.rebuildMpttIndex=rebuildMpttIndex;
async function buildNode(table,node){
    var query=table.select('id','text','target','leaf','index').where('`parentId` == :parentId').orderBy('index').bind({"parentId":node.id})
    node.childNodes=[];
    var rows=[];
    var _Meta=null;
    await query.execute(function(row){
        rows.push(row)
    },function(meta){_Meta=meta;});

    for(r_i in rows){
        var child={};
        for(m_i in _Meta){
            child[_Meta[m_i].name]=rows[r_i][m_i];
        }
        if(child.leaf == 0){
            await buildNode(table,child);
        }
        node.childNodes.push(child);
    }
}
 async function sortByMPTT(schemaName,tableName, node,left){
    var right=left+1;
    if(node.leaf ==0){
        for(var child_i in node.childNodes){
            right = await sortByMPTT(schemaName,tableName,node.childNodes[child_i],right);
        }
    }
    node.lft=left;
    node.rgt=right;
    var session=await mysqlx.getSession({
        host:process.env.dbHost,
        port:process.env.dbPort,
        dbUser:process.env.dbUser,
        dbPassword:process.env.dbPassword
    })
 
    var cmd=session.getSchema(schemaName).getTable(tableName).update().where('`id`== :id').bind({'id':node.id})
    
    cmd.set("lft",node.lft);
    cmd.set("rgt",node.rgt);
    
    await cmd.execute();
    session.close();
    return right+1;
}