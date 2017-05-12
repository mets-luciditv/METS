Ext.define('METS.model.TreeNode', {
    extend: 'Ext.data.TreeModel',
    requires: [
    	'Ext.data.identifier.Uuid'
    ],
    identifier: 'uuid',
    fields: [
        { name: 'id', type: 'string'},
    	{ name: 'text', type:'string'},
    	{ name: 'target', type:'string'},
        { name:'leaf',type:'bool', mapping: function(data) {
            return Boolean(data.leaf); 
        },serialize:function(value){
            return Number(value);
        }},
        { name: 'index', type: 'int', persist: true }
    ]
});
