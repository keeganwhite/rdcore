Ext.define('Rd.view.meshes.winMeshAddEntry', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winMeshAddEntry',
    title       : 'New mesh entry point',
    glyph       : Rd.config.icnAdd,
    closable    : true,
    draggable   : true,
    resizable   : true,
    width       : 550,
    height      : 500,
    plain       : true,
    border      : false,
    layout      : 'fit',
    autoShow    : false,
    defaults    : {
            border: false
    },
    requires    : [
        'Rd.view.components.frmWifiEntryPoint'
    ],
    initComponent: function() {
        var me      = this;
        me.items    = {
            xtype                   : 'frmWifiEntryPoint',
            meshId                  : me.meshId,
            mode					: 'add'
        };
        me.callParent(arguments);
    }
});
