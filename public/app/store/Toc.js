Ext.define('METS.store.Toc', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.toc',
    storeId:'sToc',
    model:'METS.model.Toc',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/api/GetToc',
        method: 'GET',
        reader: {
            type: 'json'
        },
        extraParams:{
            jing_id:''
        }
    }
});