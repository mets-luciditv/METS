Ext.define('METS.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',
    id:'main',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Ext.layout.container.Border',
        'METS.view.main.MainController',
        'METS.view.main.MainModel',
        'METS.view.main.List',
        'METS.view.main.Content',
        'METS.view.main.HitFragmentList',
        'METS.model.Toc',
        'METS.model.TreeNode'
    ],
    controller: 'main',
    viewModel: 'main',
    bind:{
      title:"{name}"
    },
    layout: 'border',
    defaults: {
        collapsible: true,
        split: true,
        bodyPadding: 10
    },
    header:{
        titlePosition:0,
        items: [{
            xtype:'button',
            iconCls:'x-fa fa-bars',
            menu: [{
                text:'上存經文檔案',
                listeners:{
                    click:function(){
                        Ext.create('Ext.window.Window', {
                            title: '上傳經文XML檔案',
                            height: 300,
                            width: 400,
                            layout: 'fit',
                            items: {  // Let's put an empty grid in just to illustrate fit layout
                                xtype: 'teip5upload'
                            }
                        }).show();
                    }
                }
            }]
        }]
    },


    items:[
        {
            xtype:"tabpanel",
            header:false,
            tabPosition: 'bottom',
            region:'west',
            floatable: false,
            margin: '5 0 0 0',
            width: 300,
            minWidth: 200,
          //  maxWidth: 400,
            collapsed:false,
            hideHeaders:true,
            bind:{
                title:"{text.menutitle}"
            },
            items: [
            {
		        iconCls: 'x-fa fa-list',
		        scrollable: true,
		        items:[
		        	{
		        		xtype:'hitfragmentlist'
		        	}
		        ]
		    },
            {
		        tooltip: '目錄',
		        iconCls: 'x-fa fa-sitemap',
		        items:[
		        {
		        	xtype:'treepanel',
		        	rootVisible:false,
                    hideHeaders:true,
                    height:'100%',
		        	listeners:{
		        		itemclick:'tocItemClick'
		        	},
		        	store:{
                        model:'METS.model.Toc',
                        storeId:'sToc',
                        autoLoad: false,
                        proxy: {
                        type: 'ajax',
                        url: '/api/toc/read',
                        method: 'GET',
                        reader: {
                            type: 'json'
                        }
                    }
                    }
		        }
		        ]
		    }, {
		        tooltip: '卷次',
		        iconCls: "x-fa fa-book",
                items:[
		        {
		        	xtype:'treepanel',
		        	rootVisible:false,
                    hideHeaders:true,
                    height:'100%',
		        	listeners:{
		        		itemclick:'tocItemClick'
		        	},
		        	store:{
                        model:'METS.model.Toc',
                        storeId:'sTov',
                        autoLoad: false,
                        proxy: {
                        type: 'ajax',
                        url: '/api/tov/read',
                        method: 'GET',
                        reader: {
                            type: 'json'
                        }
                    }
                    }
		        }
		        ]
		    },
            {
		        tooltip: '書目',
		        iconCls: 'x-fa fa-pencil',
                scrollable:true,
		        items:[
		        {
		        	xtype:'treepanel',
                    id:'categoryByPart',
                    height:'100%',
                    listeners:{
		        		itemclick:'categoryItemClick'
		        	},
                    tbar: [
                        {
                            iconCls: 'x-fa fa-plus',
                            tooltip: '新增',
                            listeners:{
                                click:'addCategoryByPartNode'
		        	        }
                        },
                        {
                            iconCls: 'x-fa fa-minus',
                            tooltip: '刪除',
                            listeners:{
                                click:'deleteCategoryByPartNode'
		        	        }
                        },
                        {
                            iconCls: 'x-fa fa-save',
                            tooltip: '儲存',
                            listeners:{
                                click:'saveCategory'
		        	        }
                        }
                    ],
		        	rootVisible:true,
                //    hideHeaders:true,
                    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 2})
                    ],
                    viewConfig: {
                        plugins: {
                            ptype: 'treeviewdragdrop',
                            dragText: 'Drag and drop to reorganize'
                        }
                    },
                    columns: [
                       
                            {
                                xtype:'treecolumn',
                                dataIndex: "text",
                                editor: {
                                    xtype: 'textfield',
                                    selectOnFocus:true
                                },
                                flex:2
                            },
                            {
                                dataIndex: "target",
                                text:'路徑',
                                editor: {
                                    xtype: 'textfield',
                                    selectOnFocus:true
                                },
                                flex:1
                            }
                  
                ],
		        	store:{
                        model:'METS.model.TreeNode',
                        storeId:'sCategoryByPart',
                        root: {
                            expanded: true,
                            text: "書目"
                        },
                        autoLoad: true,
                        proxy: {
                            type: 'ajax',
                            api: {
                                read: '/api/category/read',
                                create: '/api/category/add',
                                update: '/api/category/update',
                                destroy: '/api/category/remove'
                            },
                            reader: {
                                type: 'json'
                            },
                            writer:{
                                type:'json'
                            }
                        }
                    }
		        }
		        ]
		    }
            ]
        },
        {
            id:'content',
            xtype:"content",
            collapsible: false,
            region: 'center',
            margin: '5 0 0 0',
            scrollable:true


        },
        {
            region: 'east',
            header:false,
            margin: '5 0 0 0',
            width: 400,
            items:[
                {
                    name:'searchtext',
                    xtype:'textfield',
                    bind:{
                        value:'{searchtext}'
                    },
                    listeners:{
                        specialkey:'onSearchEnter'
                    },
                    triggers:{
                    	search:{
                    		cls:"x-form-search-trigger",
                    		handler:"onSearchClick"
                    	},
                    	clear:{
                    		cls:"x-form-clear-trigger",
                    		hidden:true
                    	}
                    }
                },
                {
                    xtype: 'mainlist',
                    height: 500,
                    scrollable:true
                }
            ],
            bind:{
                title:"{text.searchtitle}"
            }

        }
    ]
});