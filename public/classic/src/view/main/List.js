/**
 * This view is an example list of people.
 */
Ext.define('METS.view.main.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlist',
    tbar: [
        { 
            xtype: 'button', 
            id:'scope',
            text: '檢索範圍:全部' ,
            menu:{
                items:[
                {
                    text:"全部",
                    id:'scopeAll',
                    group: 'scope',
                    value:'all',
                    checked: true,
                    handler:'scopeSelect'
                },
                {
                    text:"自訂",
                    id:'scopeCustom',
                    group: 'scope',
                    value:'custom',
                    checked: false,
                    handler:'scopeSelect'
                },
                {
                    text:"本經",
                    id:'scopeCurrent',
                    group: 'scope',
                    value:'current',
                    checked: false,
                    handler:'scopeSelect'
                }
            ]}
        }
    ],
    requires: [
        'METS.store.Search'
    ],
    store: {
        type: 'search'
    },
    columns: [
        { text: '筆數',  dataIndex: 'hit_count', flex: 1 },
        { text: '經號', dataIndex: 'jing_id', flex: 1 },
        { text: '經名', dataIndex: 'jing_title', flex: 2 },
        { text: '卷', dataIndex: 'volume_title', flex: 1 },
        { text: '作譯者', dataIndex: 'author', flex: 2 }
    ],
    listeners: {
        select: 'onItemSelected'
    }
});