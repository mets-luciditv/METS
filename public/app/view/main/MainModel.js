/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('METS.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',
    data: {
		name: '月光大藏經',
        searchtext:'པའི་ཚུལ་',
        searchScope:'all',
        nowJingId:'',
        nowId:'',
        nowJingTitle:'',
        nowVolumeId:'' ,
        nowVolumeTitle:'',
        text:{searchtitle:'搜尋',menutitle:'選單'}
    }
});
