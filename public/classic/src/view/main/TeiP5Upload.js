Ext.define('METS.view.main.TeiP5Upload', {
    extend: 'Ext.form.Panel',
    xtype: 'teip5upload',
    items: [{
        xtype: 'filefield',
        name: 'teip5xml',
        fieldLabel: 'Tei P5 XML',
        labelWidth: 50,
        msgTarget: 'side',
        allowBlank: false,
        anchor: '100%',
        buttonText: 'Select Photo...'
    }],
    buttons: [{
        text: 'Upload',
        handler: function() {
            var form = this.up('form').getForm();
            if(form.isValid()) {
                form.submit({
                    url: 'api/upload',
                    waitMsg: '上傳中...',
                    success: function(fp, o) {
                        Ext.Msg.alert('成功', o.result.file + '已經上傳');
                    }
                });
            }
        }
    }]
});