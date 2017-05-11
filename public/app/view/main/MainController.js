/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('METS.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    routes : {
        'open/:path' :{ action:'onOpen'}
    },
    onOpen:function(path){
    	Ext.getCmp('content').getController().loadContext(path);
    },
    onItemSelected: function (sender, record) {
        var storeSearch = Ext.data.StoreManager.lookup('sSearch');
    	var lastQueryText=storeSearch.lastOptions.params.q;
    	var selectedId=record.data.id;
    	Ext.getCmp('content').getController().loadContext(selectedId,lastQueryText);

    
    },
    onSearchClick:function(sender){
    	this.search();
    },
    onSearchEnter:function (field, e) {
        if(e.getKey() == e.ENTER)
        {
			this.search();
        }
    },
    search:function(){
    	var storeSearch = Ext.data.StoreManager.lookup('sSearch');
        var viewModel=this.getViewModel();
        var params={q : viewModel.data.searchtext};
        switch(viewModel.data.searchScope){
            case "all":
            break;
            case "custom":
            params.jing_ids=viewModel.data.scopeCustomJing_Ids;
            break;
            case "current":
            params.jing_ids=[viewModel.data.nowJingId];
            break;
        }
        storeSearch.removeAll();
        storeSearch.reload({
            params : params
        });
    },
    onHitFragmentSelected:function(sender, record){
    	var groupId=record.data.GroupId;
    	Ext.getCmp('content').getController().gotoHitFragment(groupId);
    },
    tocItemClick:function ( sender , record , item , index , e , eOpts ) {
    	var path=Ext.String.format("{0}{1}",this.getViewModel().data.nowJingId,record.raw.target.replace('#',''));
    	Ext.getCmp('content').getController().changeContext(path);
    },
    categoryItemClick:function( sender , record , item , index , e , eOpts ) {
        if(record.data.target)
        {
            var path=record.data.target;
            Ext.getCmp('content').getController().changeContext(path);
        }
        
    },
    saveCategory:function(){
        Ext.StoreManager.lookup("sCategoryByPart").sync();
    },
    addCategoryByPartNode:function(){
        if(Ext.getCmp('categoryByPart').getSelection().length==0)
        {
            Ext.getCmp('categoryByPart').getRootNode().appendChild(Ext.create('METS.model.TreeNode',{text:'New Node',leaf:true}))
        }
        else {
            Ext.getCmp('categoryByPart').getSelection()[0].appendChild(Ext.create('METS.model.TreeNode',{text:'New Node',leaf:true}))
        }
    },
    deleteCategoryByPartNode:function(){
         if(Ext.getCmp('categoryByPart').getSelection().length>0)
        {
            Ext.getCmp('categoryByPart').getSelection()[0].remove();
        }
    },
    scopeSelect:function(item){
        var str=Ext.String.format('檢索範圍:{0}',item.text);
        Ext.getCmp('scope').setText(str);
        switch(item.id){
            case "scopeAll":
                    this.getViewModel().setData({searchScope:"all"});
            break;
            case "scopeCustom":
      
                    this.getViewModel().setData({searchScope:"custom"});
                    Ext.create('Ext.window.Window', {
                        title: '選擇搜尋範圍',
                        height: 600,
                        width: 800,
                        layout: 'fit',
                        items: {  // Let's put an empty grid in just to illustrate fit layout
                            xtype: 'scopecustom'
                        }
                    }).show();
                

            break;
            case "scopeCurrent":
               
                    this.getViewModel().setData({searchScope:"current"});
                
            break;
        }
    },
    scopeClick:function ( sender , e , eOpts ) {
        var records= sender.up("treepanel").getChecked();
        this.getViewModel().setData({scopeCustomJing_Ids:records.filter(function(r){return r.data.target.length >0}).map(function(c){return c.data.target})});
        this.search();
        sender.up("window").close();
    }

});
