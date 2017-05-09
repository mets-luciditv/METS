/**
 * This view is an example list of people.
 */
Ext.define('METS.view.main.HitFragmentList', {
    extend: 'Ext.grid.Panel',
    xtype: 'hitfragmentlist',
    hideHeaders : true,
    requires: [
        'METS.store.HitFragment'
    ],
    store: {
        type: 'hitfragment'
    },
    columns: [
        { text: 'Seq',  xtype: 'templatecolumn', flex: 1 , tpl:'#{GroupId}'},
        { text: 'Fragment', dataIndex: 'Fragment', flex: 4,variableRowHeight :true,cellWrap:true }
    ],
    listeners: {
        rowclick: 'onHitFragmentSelected'
    }
});