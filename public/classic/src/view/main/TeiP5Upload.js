Ext.define('METS.view.main.TeiP5Upload', {
    extend: 'Ext.form.Panel',
    xtype: 'teip5upload',
    items: [{
        xtype: 'filefield',
        accept:".xml",
        name: 'teip5xml',
        fieldLabel: 'Tei P5 XML',
        labelWidth: 100,
        msgTarget: 'side',
        allowBlank: false,
        anchor: '100%',
        buttonText: '選擇檔案'
    }],
    buttons: [{
        text: '上傳',
        handler: function() {
            var form = this.up('form').getForm();
            if(form.isValid()) {
                form.submit({
                    url: 'api/upload',
                    waitMsg: '上傳中...',
                    success: function(fp, o) {
                        Ext.Msg.alert('成功', o.result.file + '已經上傳');
                    },
                     failure: function(form, action) {
                        switch (action.failureType) {
                            case Ext.form.action.Action.CLIENT_INVALID:
                                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                                break;
                            case Ext.form.action.Action.CONNECT_FAILURE:
                                Ext.Msg.alert('Failure', 'Ajax communication failed');
                                break;
                            case Ext.form.action.Action.SERVER_INVALID:
                            Ext.Msg.alert('Failure', action.result.msg);
                    }
                    }
                });
            }
        }
    }]
});