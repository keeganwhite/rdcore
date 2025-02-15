Ext.define('Rd.view.dataUsage.pnlDataUsage', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlDataUsage',
    scrollable  : true,
    layout      : {
      type  : 'vbox',
      align : 'stretch'  
    },
    requires: [
        'Rd.view.dataUsage.vcPnlDataUsage',
        'Rd.view.dataUsage.pnlDataUsageDay',
        'Rd.view.dataUsage.pnlDataUsageWeek',
        'Rd.view.dataUsage.pnlDataUsageMonth',
        'Rd.view.components.cmbRealm'
    ],
    controller : 'vcPnlDataUsage',
      
    initComponent: function() {
        var me      = this;
        var scale   = 'small';
        
        me.dockedItems= [
            {
                xtype   : 'toolbar',
                dock    : 'top',
                items   : [
                    {  
                        glyph   : Rd.config.icnReload,    
                        scale   : scale, 
                        itemId  : 'reload',
                        ui      : 'button-orange',   
                        tooltip: i18n('sReload')
                    },
                    {
                        xtype       : 'cmbRealm',
                        allOption   : true,
                        width       : 250,
                        labelWidth  : 50,
                        itemId      : 'duCmbRealm',
                        value       : 0 
                    },
                    '|',
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnLeft,
                        reference   : 'btnTimeBack',
                        tooltip     : 'Go Back 1Day',
                        listeners   : {
                            click: 'onClickTimeBack'
                        }
                    },  
                    {
                        xtype       : 'datefield',
                        itemId      : 'dtDate',
                        reference   : 'dtDate',
                        name        : 'date',
                        format      : "d/m/Y",
                        value       : new Date(),
                        width       : 120
                    },
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnRight,
                        reference   : 'btnTimeForward',
                        tooltip     : 'Go Forward 1Day',
                        disabled    : true,
                        listeners   : {
                            click: 'onClickTimeForward'
                        }
                    }, 
                    '|',
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnHourStart,
                        text        : 'Day',
                        ui          : 'button-pink',
                        listeners   : {
                            click: 'onClickTodayButton'
                        }
                    },  
                    { 
                        scale       : scale,
                        glyph       : Rd.config.icnHourHalf,
                        text        : 'Week',
                        ui          : 'button-purple',
                        listeners   : {
                            click: 'onClickThisWeekButton'
                        }
                    },
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnHourEnd,
                        text        : 'Month',
                        ui          : 'button-brown',
                        listeners   : {
                             click: 'onClickThisMonthButton'
                        }
                    },
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnTime,
                        tooltip     : 'Timezone',
                        ui          : 'button-metal',   
                        menu        : [
                        {
                            xtype         : 'cmbTimezones', 
                            width         : 300, 
                            itemId        : 'cmbTimezone',
                            name          : 'timezone_id', 
                            labelClsExtra : 'lblRdReq',
                            labelWidth    : 100, 
                            padding       : 10,
                            margin        : 10,
                            value         : me.timezone_id,
                            listeners     : {
                                change  : function(cmb){
                                    var btn = cmb.up('button');
                                    btn.getMenu().hide();
                                    console.log(cmb.getValue());
                                }
                            }
                        }]
                    },
                    '|',
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnWifi,
                        text        : 'RADIUS Clients',
                        ui          : 'button-metal',
                        listeners   : {
                             click: 'onClickRadiusClientsButton'
                        }
                    },
                    '|',
                    { 
                        scale   : 'small',
                        itemId  : 'btnShowRealm',
                        glyph   : Rd.config.icnBack,  
                        text    : 'Back',
                        hidden  : true,
                        ui      : 'button-pink'
                    }
                ]
            },
            {
                itemId      : 'cntBanner',
                xtype       : 'container',
                dock        : 'top',
                style       : { 
                    background  : '#adc2eb',
                    textAlign   : 'center'
                },
                height      : 50,
                tpl     : new Ext.XTemplate(
                    '<h2 style="color:#ffffff;font-weight:lighter;"><span style="color:#737373;font-size:smaller;">',
                    '<tpl if="type==\'user\'">',
                        '<i class="fa fa-angle-right">',
                    '</tpl>',
                    '<tpl if="type==\'device\'">',
                        '<i class="fa fa-angle-double-right">',
                    '</tpl>',
                    '</i>  VIEWING   </span>',
                    '<tpl if="type==\'realm\'">',
                        '<i class="fa fa-vector-square"></i> {item_name}',
                    '</tpl>',
                    '<tpl if="type==\'user\'">',
                        '<i class="fa fa-user"></i> {item_name}',
                    '</tpl>',
                    '<tpl if="type==\'device\'">',
                        '<i class="fa fa-tablet"></i> {mac}',
                    '</tpl>',
                    '<tpl if="historical== true">',
                        '  <span style="color:#737373;font-size:x-small;"><i class="fa fa-history"></i> {date_human} / {timezone}</span>',
                    '<tpl else>',
                        '  <span style="color:green;font-size:x-small;"><i class="fa fa-circle"></i> {timezone}</span>',
                    '</tpl>',
                    '</h2>'
                ),
                data    : {
                }
            }
        ];
       
        me.items = [
            {
                xtype   : 'pnlDataUsageDay',
                glyph   : Rd.config.icnHourStart
            },
            {
                xtype   : 'pnlDataUsageWeek',
                glyph   : Rd.config.icnHourHalf
            },
            {
                xtype   : 'pnlDataUsageMonth',
                glyph   : Rd.config.icnHourEnd
            }
        ];
        
        me.callParent(arguments);
    }
});
