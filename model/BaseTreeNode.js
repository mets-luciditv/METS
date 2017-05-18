const mysql      = require('mysql');
const winston = require('winston');
const Promise = require('promise');
const Stack =require('stackjs')
const util=require("util")
var extend = require('util')._extend;
    var pool  = mysql.createPool({
        connectionLimit : 10,
        host     : process.env.dbHost,
        user     : process.env.dbUser,
        password : process.env.dbPassword,
        database : process.env.dbDatabase
    });
module.exports.add= async function (schemaName,tableName,nodes)
{
    for(i in nodes){
        var node=nodes[i];
         await insertRow(pool,tableName,node);
    }
    await rebuildMpttIndex(pool,tableName);
}
function insertRow(pool,tableName,node){
    return new Promise(function(resolve,reject){
        var query=pool.query("INSERT INTO ?? SET ?",[tableName,node],function (error, results, fields){
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        });
    });
}
function deleteRow(pool,tableName,id){
    return new Promise(function(resolve,reject){
        var query=pool.query("DELETE FROM ?? WHERE `id` = ? ",[tableName,id],function (error, results, fields){
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        });
    });
}
function updateRow(pool,tableName,node){
    return new Promise(function(resolve,reject){
        var copy=extend({},node);
        delete copy.id;
        var query=pool.query("UPDATE ?? SET ? WHERE `id`=?",[tableName,copy,node.id],function (error, results, fields){
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        });
    });
}
function readRow(pool,tableName,id){
    return new Promise(function(resolve,reject){
        var query=pool.query("SELECT * FROM ?? WHERE `id`=?",[tableName,id],function (error, results, fields){
            if(error){
                reject(error);
            }else{
                resolve(results[0]);
            }
        });
    });
}
async function readChild(pool,tableName,id){
    return new Promise(function(resolve,reject){
         pool.query('SELECT `id`,`text`,`target`,`leaf`,`index` FROM ?? WHERE `parentId` = ? Order by `index`', 
        [tableName,id], 
        function (error, results, fields) {
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        });
    })
   
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
    for(i in nodes){
        var node=nodes[i];
        await updateRow(pool,tableName,node);
    }
    await rebuildMpttIndex(pool,tableName);
}
module.exports.update = update;
module.exports.read = async function (schemaName,tableName,id)
{
    return new Promise(function(resolve, reject) {
        pool.query('SELECT a.* FROM ?? a,?? b where a.lft >= b.lft and a.lft  <= b.rgt and b.id= ? order by a.lft', [tableName,tableName,id], function (error, results, fields) {
            if(error){
                reject(error)
            }else{
                resolve(loadMpttTree(results));
            }  
        });
    });
}

module.exports.remove = async function (schemaName,tableName,ids)
{
    for(i in ids){
        var id=ids[i]
        await deleteRow(pool,tableName,id);
    }
    await rebuildMpttIndex(pool,tableName);
}

async function rebuildMpttIndex(pool,tableName){
    var root=await readRow(pool,tableName,'root');
    await buildNode(pool,tableName,root);
    await sortByMPTT(pool,tableName,root,0);
    return true;
}
module.exports.rebuildMpttIndex=rebuildMpttIndex;
async function buildNode(pool,tableName,node){
    node.childNodes=[];
    var childs=await readChild(pool,tableName,node.id);
    for(c_i in childs){
        var child=childs[c_i];
        if(child.leaf == 0){
            await buildNode(pool,tableName,child);
        }
        node.childNodes.push(child);
    }
   return Promise.resolve(true);
}
 async function sortByMPTT(pool,tableName, node,left){
    var right=left+1;
    if(node.leaf ==0){
        for(var child_i in node.childNodes){
            right = await sortByMPTT(pool,tableName,node.childNodes[child_i],right);
        }
    }
    node.lft=left;
    node.rgt=right;
    await updateRow(pool,tableName,{id:node.id,lft:node.lft,rgt:node.rgt});
    return right+1;
}