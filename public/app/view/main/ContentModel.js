Ext.define('METS.view.main.ContentModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.content',
    data: {
        isOrginalLineBreak:false,
        isShowLineId:false,
        defaultFontSize:17,
        html:"",
        hitFragmentCount:0,
        nowHitFragmentSeq:0,
        isShowContentImage:false
    }
});
