Ext.define('METS.view.main.Content', {
    extend: 'Ext.panel.Panel',
    xtype: 'content',
    requires: [
    'METS.view.main.ContentController',
        'METS.view.main.ContentModel'
    ],
 	viewModel: 'content',
 	controller: 'content',
    listeners: {
    	afterlayout:'onContentAfterlayout'
    },
    bind:{	
    	bodyStyle:'font-size:{defaultFontSize}px;line-height:1.5em;',
    	html:"{html}"
   
    },
    tbar: [
			{ 
			  xtype: 'button',  
        	  iconCls: 'x-fa fa-gear',
              text: '設定',
              menu: {
              items:[
              		{
              			xtype: 'menucheckitem',
              			text:'原書換行',
              			listeners: {
			        		click: 'onOrginalLineBreak'
			    		},
			    		bind:{
			    			checked:"{isOrginalLineBreak}"
			    		}

              		},
              		{
              			xtype: 'menucheckitem',
              			text:'顯示行首',
              			listeners: {
			        		click: 'onShowLineId'
			    		},
			    		bind:{
			    			checked:"{isShowLineId}"
			    		}
              		},
					{
              			xtype: 'menucheckitem',
              			text:'顯示經文底圖',
              			listeners: {
			        		click: 'switchContentImage'
			    		},
			    		bind:{
			    			checked:"{isShowContentImage}"
			    		}
              		},
              		{
              			xtype: 'menuseparator'
              		},
              		{
              			xtype: 'buttongroup',
    					columns: 3,
    					title: '字型大小',
    					items:[
    					{
    						iconCls:"x-fa fa-minus",
    						listeners: {
			        			click: 'fontSizeDiminished'
			    			}
    					},{
    						xtype:'textfield',
    						width:'5em',
    						bind:{
    							value:"{defaultFontSize}"
    						}
    					},
    					{
    						iconCls:"x-fa fa-plus",
    							listeners: {
			        			click: 'fontSizeIncrement'
			    			}
    					}
    					]
              		}
              	]

              }
            },
			{
			   xtype:'button',
			   iconCls:'x-fa fa-quote-right',
			   autoEl:'button',
			   tooltip:'引用',
			    listeners:{
            		click:'refAndCopy'
            	}
			},
            '->',
            {
            	xtype:'button',
            	iconCls:'x-fa fa-chevron-left',
            	listeners:{
            		click:'prevHitFragment'
            	},
            	bind: {
            		hidden: '{!hitFragmentCount}'
        		}
            },
            {
            	xtype:'label',
            	bind:{ 
            		text:'{nowHitFragmentSeq}/{hitFragmentCount}',
            		hidden: '{!hitFragmentCount}' 
            	}
            },
            {
            	xtype:'button',
            	iconCls:'x-fa fa-chevron-right',
            	listeners:{
            		click:'nextHitFragment'
            	},
            	bind: {
            		hidden: '{!hitFragmentCount}'
        		}
            }
			]
});