Ext.define('METS.store.Search', {
    extend: 'Ext.data.Store',
    alias: 'store.search',
    storeId:'sSearch',
    model:'METS.model.SearchResult',
    proxy: {
        type: 'ajax',
        url: '/api/search',
        reader: {
            type: 'json',
            rootProperty:'response.docs'
        }
    }
});
