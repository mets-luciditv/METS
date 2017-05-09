const BaseTreeNode = require("./BaseTreeNode");
const schemaName='mets';
const tableName='tov'
util = require('util');
module.exports.add=function(node){
    return BaseTreeNode.add(schemaName,tableName,node);
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
module.exports.rebuildMpttIndex=function(){
    return BaseTreeNode.rebuildMpttIndex(schemaName,tableName);
}