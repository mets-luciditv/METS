Ext.define('METS.model.Document', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'text', type:'string'},
    	{ name: 'xml', type:'string'},
        { name: 'id', type: 'string' },
        { name: 'jing_id', type: 'string' },
        { name: 'jing_title', type: 'string' },
        { name: 'volume_id', type: 'string' },
        { name: 'volume_title', type: 'string' },
        { name: 'author', type: 'string' }
    ]
});
