Ext.define('METS.view.main.ScopeCustomView', {
    extend:'Ext.tab.Panel',
    requires: [
        'METS.model.ScopeCustom'
    ],
    xtype: 'scopecustom',
    items: [{
		        	xtype:'treepanel',
                    checkPropagation: 'both',
                    tabConfig: {
                        title: '依據部類選擇'
                    },
                    bbar: [
                        { 
                            xtype: 'button', 
                            text: '檢索',
                            listeners:{
		        		        click:'scopeClick'
		        	        }
                     }
                    ],
		        	rootVisible:true,
                    columns: [
                       
                            {
                                xtype:'treecolumn',
                                dataIndex: "text",
                                editor: {
                                    xtype: 'textfield',
                                    selectOnFocus:true
                                },
                                flex:2
                            }
                  
                ],
		        	store:{
                        model:'METS.model.ScopeCustom',
                        defaultRootId:'3ec5791d-7cb1-4d27-85b7-6d5045006a97',
                        root: {
                            expanded: true,
                            text: "全選"
                        },
                        autoLoad: true,
                        proxy: {
                            type: 'ajax',
                            api: {
                                read: '/api/category/read'
                            },
                            reader: {
                                type: 'json'
                            }
                        }
                    }
		        }, {
		        	xtype:'treepanel',
                    checkPropagation: 'both',
                    tabConfig: {
                        title: '依刊本選擇'
                    },
                    bbar: [
                        { 
                            xtype: 'button', 
                            text: '檢索',
                            listeners:{
		        		        click:'scopeClick'
		        	        }
                     }
                    ],
		        	rootVisible:true,
                    columns: [
                       
                            {
                                xtype:'treecolumn',
                                dataIndex: "text",
                                editor: {
                                    xtype: 'textfield',
                                    selectOnFocus:true
                                },
                                flex:2
                            }
                  
                ],
		        	store:{
                        model:'METS.model.ScopeCustom',
                        defaultRootId:'bb1f0900-38f0-4715-b9fb-9700aa36eade',
                        root: {
                            expanded: true,
                            text: "全選"
                        },
                        autoLoad: true,
                        proxy: {
                            type: 'ajax',
                            api: {
                                read: '/api/category/read'
                            },
                            reader: {
                                type: 'json'
                            }
                        }
                    }
		        }]
});