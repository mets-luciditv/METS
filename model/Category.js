const BaseTreeNode = require("./BaseTreeNode");
const schemaName='METS';
const tableName='category'
util = require('util');
module.exports.add=function(nodes){
    return BaseTreeNode.add(schemaName,tableName,nodes);
}

module.exports.remove=function(ids){
    return BaseTreeNode.remove(schemaName,tableName,ids);
}
module.exports.update=function(nodes){
    return BaseTreeNode.update(schemaName,tableName,nodes);
}
module.exports.read=function(id){
    return BaseTreeNode.read(schemaName,tableName,id);
}
module.exports.getTree=function(id){
    return BaseTreeNode.getTree(schemaName,tableName,id);
}
module.exports.rebuildMpttIndex=function(){
    return BaseTreeNode.rebuildMpttIndex(schemaName,tableName);
}
