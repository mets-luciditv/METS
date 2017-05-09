Ext.define('METS.model.ScopeCustom', {
    extend: 'Ext.data.TreeModel',
    fields: [
        { name: 'id', type: 'string'},
    	{ name: 'text', type:'string'},
    	{ name: 'target', type:'string'},
        { name:'leaf',type:'bool', mapping: function(data) {
            return Boolean(data.leaf); 
        },serialize:function(value){
            return Number(value);
        }},
        { name: 'index', type: 'int', persist: true },
        {name:'checked',type:'bool',defaultValue:false}
    ]
});
