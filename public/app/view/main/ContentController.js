/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('METS.view.main.ContentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.content',
    loadContext:function(path,q){
    //同時更新顯示內容與目錄
    	var content=this.getView();
	    Ext.Ajax.request({
			     url: '/api/GetHighlightDoc',
			     params:{
			           id:path,
	                   q:q
			     },
			     success: function(response, opts) {
			         var data = JSON.parse(response.responseText).response.docs[0];	 
			         Ext.suspendLayouts();
			         Ext.data.StoreManager.lookup('sHitFragment').loadRawData(data.hit_fragments);
					 var mainViewModel=Ext.getCmp("main").getViewModel();
					 mainViewModel.setData({nowJingId:data.jing_id,nowJingTitle:data.jing_title,nowVolumeId:data.volume_id,nowVolumeTitle:data.volume_title});
			         content.getViewModel().setData({html:data.html,hitFragmentCount:data.hit_fragments.length,nowHitFragmentSeq:0});
			         content.getViewModel().notify();         
					 var storeToc = Ext.data.StoreManager.lookup('sToc');
					 storeToc.setDefaultRootId(data.jing_id);
					 storeToc.removeAll();
					 storeToc.setAutoLoad(true);
			         storeToc.load({
			            params : {
			                node:data.jing_id
			            }
			         });
					  var storeTov = Ext.data.StoreManager.lookup('sTov');
					  storeTov.setDefaultRootId(data.jing_id);
					storeTov.removeAll();
					 storeTov.setAutoLoad(true);
			         storeTov.reload({
			            params : {
			                node:data.jing_id
			            }
			         });
			         content.updateLayout(); 		
			         Ext.resumeLayouts(true);
					 content.setScrollY(0);
					
			     },

			     failure: function(response, opts) {
			         console.log('server-side failure with status code ' + response.status);
			     }
		});
    },
    changeContext:function(path){
    //更新顯示內容
    	var content=this.getView();
	    Ext.Ajax.request({
			     url: '/api/GetDocByPath',
			     async :false,
			     params:{
			           id:path
			     },
			     success: function(response, opts) {
			         var data = JSON.parse(response.responseText).response.docs[0];
			         Ext.suspendLayouts();
					 var mainViewModel=Ext.getCmp("main").getViewModel();
					 mainViewModel.setData({nowJingId:data.jing_id,nowJingTitle:data.jing_title,nowVolumeId:data.volume_id,nowVolumeTitle:data.volume_title});
			         content.getViewModel().setData({html:data.html[0],hitFragmentCount:0,nowHitFragmentSeq:0});
			         content.getViewModel().notify();
			         content.updateLayout(); 
			         Ext.resumeLayouts(true);
					 var pattern=/^([A-Z]{1}\d{6})(P\d{4}L\d{2})$/g
					 var match=pattern.exec(path);
				     if(match!=null)
				     {
				     	Ext.query(Ext.String.format("#content span.lb[data-lineid='{0}']",match[2]),true)[0].scrollIntoView(Ext.getCmp("content").getEl(),null,false,true,true);
				     }
			     },
			     failure: function(response, opts) {
			         console.log('server-side failure with status code ' + response.status);
			     }
		});
         
    },
    onOrginalLineBreak:function ( menu , item , e , eOpts ) {
    	this.switchOrginalLineBreak();
    },
    onShowLineId:function ( menu , item , e , eOpts ) {
    	this.switchShowLineId();
    },
    onContentAfterlayout:function(sender,eOpts){
    	this.switchOrginalLineBreak();
    	this.switchShowLineId();
		this.switchContentImage();
    },
	refAndCopy:function(){
		//1.找到所選的文字
		var selection=window.getSelection();
		var selecText=selection.toString().replace("\n","");
		//因為html text有時會有tag包住
		var startLineNode=selection.anchorNode.previousElementSibling;
		if(startLineNode==null){
			startLineNode=selection.anchorNode.parentNode.previousElementSibling;
		}
		var endLineNode=selection.extentNode.previousElementSibling;
		if(endLineNode==null){
			endLineNode=selection.extentNode.parentNode.previousElementSibling;
		}
		//抓到行號
		var startPageLine=startLineNode.attributes['data-lineid'].value;
		var endPageLine=endLineNode.attributes['data-lineid'].value;
		//因為select反向操作時，開始和結速的順序會相反，所以要對調
		if(startPageLine>endPageLine){
			startPageLine=endLineNode.attributes['data-lineid'].value;
			endPageLine=startLineNode.attributes['data-lineid'].value;
		}
		var pattern=/^P(\d{4})L(\d{2})$/g;
		var match=pattern.exec(startPageLine);
		var startPage=match[1];
		var startLine=match[2];
		var pattern_end=/^P(\d{4})L(\d{2})$/g
	 	var match_end=pattern_end.exec(endPageLine);
		var endPage=match_end[1];
		var endLine=match_end[2];
		var msg="";
		var mainViewModel=Ext.getCmp("main").getViewModel();
		//格式：單行、跨行、跨頁
		if(startPage==endPage){
			if(startLine==endLine){
				//單行
				msg=Ext.String.format("《{0}》{1}：「{2}」  (METS, {3}, p. {4}, {5})",mainViewModel.data.nowJingTitle,mainViewModel.data.nowVolumeTitle,selection.toString(),mainViewModel.data.nowJingId,startPage,startLine);
			}
			else{
				//跨行
				msg=Ext.String.format("《{0}》{1}：「{2}」  (METS, {3}, p. {4}, {5}-{6})",mainViewModel.data.nowJingTitle,mainViewModel.data.nowVolumeTitle,selection.toString(),mainViewModel.data.nowJingId,startPage,startLine,endLine);
			}
		}
		else{
			//跨頁
			msg=Ext.String.format("《{0}》{1}：「{2}」  (METS, {3}, p. {4}, {5}-p. {6}, {7})",mainViewModel.data.nowJingTitle,mainViewModel.data.nowVolumeTitle,selection.toString(),mainViewModel.data.nowJingId,startPage,startLine,endPage,endLine);
		}
		msg=msg.replace("\n","");
			Ext.create('Ext.window.Window', {
				title: '引用',
				height: 120,
				width: 500,
				layout: 'fit',
				items: [
					{
						xtype:'label',
						id:'refLink',
						text:msg
					}
				],
				buttons: [
					{ 
						text: '複製' ,
						id:'copyRefLink',   
						autoEl: {
							tag:"button",
							"data-clipboard-text":msg
						}, 
						listeners: {
							afterrender: function(cmp) {
								new Clipboard('#copyRefLink');
							},
							click:function( sender , e , eOpts ){
								sender.up("window").close();
							}
					}
					}
				]
			}).show();
	},
    switchShowLineId:function()
    {
    	var isShowLineId= this.getViewModel().data.isShowLineId;
    	var isOrginalLineBreak= this.getViewModel().data.isOrginalLineBreak;
    	var spanlbList=Ext.query("span.lb",false);
    	spanlbList.forEach(function(element, index, array){
    		if(isShowLineId)
    		{
    			element.addCls('show');
    		}
    		else
    		{
    			element.removeCls('show');
    		}

    	});
    	if(!isOrginalLineBreak && isShowLineId){
    		spanlbList.forEach(function(element, index, array){element.removeCls('show');});
    		Ext.query("span.lb:first-child",false).forEach(function(element, index, array){element.addCls('show');});
    	}


    },
	switchContentImage:function(){
		var isShowContentImage= this.getViewModel().data.isShowContentImage;
		Ext.query("span.pb",false).forEach(function(element, index, array){element.setDisplayed(isShowContentImage);});
	},
    switchOrginalLineBreak:function()
    {
        var isOrginalLineBreak= this.getViewModel().data.isOrginalLineBreak;
    	Ext.query("br.lb_br",false).forEach(function(element, index, array){element.setDisplayed(isOrginalLineBreak);});
    	if(isOrginalLineBreak){
    		//先到跳到指定的view再進行查詢。縮小範圍。
    		Ext.fly(this.getView().getEl()).query("p.paragraph",false).forEach(function(element, index, array){element.setStyle("text-indent","0em");});
    	}
    	else{
    		Ext.fly(this.getView().getEl()).query("p.paragraph",false).forEach(function(element, index, array){
    			if(index!=0){
    				element.setStyle("text-indent","2em");
    			}
    		});
    	}
    	var isShowLineId= this.getViewModel().data.isShowLineId;
    	if(isShowLineId){
    		this.switchShowLineId();
    	}
    },
    fontSizeIncrement:function(){
    	this.getViewModel().setData({defaultFontSize:this.getViewModel().data.defaultFontSize+1});
    },
    fontSizeDiminished:function(){
    	this.getViewModel().setData({defaultFontSize:this.getViewModel().data.defaultFontSize-1});
    },
    nextHitFragment:function(){
    	var viewModel=this.getViewModel();
    	if(viewModel.data.nowHitFragmentSeq<viewModel.data.hitFragmentCount)
    	{
		 	this.gotoHitFragment(viewModel.data.nowHitFragmentSeq+1);
    	}
    	else
    	{
    		this.gotoHitFragment(viewModel.data.nowHitFragmentSeq);
    	}
    },
    prevHitFragment:function(){
    	var viewModel=this.getViewModel();
    	if(viewModel.data.nowHitFragmentSeq>1)
    	{
    		this.gotoHitFragment(viewModel.data.nowHitFragmentSeq-1);
    	}
    	else
    	{
    		this.gotoHitFragment(viewModel.data.nowHitFragmentSeq);
    	}
    },
    gotoHitFragment:function(groupId){
    	var viewModel=this.getViewModel();
		viewModel.set({nowHitFragmentSeq:parseInt(groupId)});
		viewModel.notify();
		Ext.query(Ext.String.format("#content em[data-hl-group='{0}']",groupId),true)[0].scrollIntoView(Ext.getCmp("content").getEl(),null,false,true,true);
    	Ext.query(Ext.String.format("#content em[data-hl-group='{0}']",groupId),false)[0].highlight();
    }

});
