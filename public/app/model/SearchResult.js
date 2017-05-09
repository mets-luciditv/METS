Ext.define('METS.model.SearchResult', {
    extend: 'Ext.data.Model', 
    fields: [
    	{ name: 'hit_count', type:'int'},
        { name: 'id', type: 'string' },
        { name: 'jing_id', type: 'string' },
        { name: 'jing_title', type: 'string' },
        { name: 'volume_id', type: 'string' },
        { name: 'volume_title', type: 'string' },
        { name: 'author', type: 'string' }

    ]
});
