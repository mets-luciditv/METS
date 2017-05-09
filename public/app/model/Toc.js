Ext.define('METS.model.Toc', {
    extend: 'Ext.data.TreeModel',
    identifier: 'uuid',
    fields: [
    	{ name: 'text', type:'string'},
    	{ name: 'target', type:'string'},
        { name: 'id', type: 'string' },
        { name: 'jing_id', type: 'string' },
        { name:'leaf',type:'bool'}
    ]
});
