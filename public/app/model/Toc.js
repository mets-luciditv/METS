Ext.define('METS.model.Toc', {
    extend: 'Ext.data.TreeModel',
    requires: [
    	'Ext.data.identifier.Uuid'
    ],
    identifier: 'uuid',
    fields: [
    	{ name: 'text', type:'string'},
    	{ name: 'target', type:'string'},
        { name: 'id', type: 'string' },
        { name: 'jing_id', type: 'string' },
        { name:'leaf',type:'bool'}
    ]
});
