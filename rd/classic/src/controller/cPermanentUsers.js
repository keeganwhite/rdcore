Ext.define('Rd.controller.cPermanentUsers', {
    extend: 'Ext.app.Controller',
    actionIndex: function(pnl,itemId){
        var me      = this;
        var item    = pnl.down('#'+itemId);
        var added   = false;
        if(!item){ 
            pnl.add({ 
                itemId  : itemId,
                xtype   : 'gridPermanentUsers',
                border  : false,
                plain   : true,
                padding : Rd.config.gridSlim
            });
            pnl.on({activate : me.gridActivate,scope: me});
            added = true;
        }
        return added;      
    },

    views:  [
       	'permanentUsers.gridPermanentUsers',   'permanentUsers.winPermanentUserAdd',
       	'components.cmbRealm',   'components.cmbProfile',  'components.cmbCap',
        'components.winCsvColumnSelect',
       	'permanentUsers.pnlPermanentUser', 'permanentUsers.gridUserRadaccts', 'permanentUsers.gridUserRadpostauths',
        'components.winEnableDisable', 'permanentUsers.gridUserPrivate',
       	'components.cmbVendor',   'components.cmbAttribute', 'permanentUsers.gridUserDevices', 'components.pnlUsageGraph',
        'permanentUsers.pnlPermanentUserGraphs',
        'permananetUsers.winUserEmailDetail',
        'permanentUsers.winPermanentUserImport'
    ],
    stores: ['sLanguages', 'sPermanentUsers', 'sRealms', 'sProfiles', 'sAttributes', 'sVendors'],
    models: [
        'mPermanentUser',    'mRealm',       'mProfile', 'mUserStat',
        'mRadacct',                 'mRadpostauth',     'mAttribute',   'mVendor',  'mPrivateAttribute', 'mDevice' ],
    selectedRecord: null,
    config: {
        urlAdd              : '/cake4/rd_cake/permanent-users/add.json',
        urlExportCsv        : '/cake4/rd_cake/permanent-users/export-csv',
        urlViewBasic        : '/cake4/rd_cake/permanent-users/view-basic-info.json',
        urlEditBasic        : '/cake4/rd_cake/permanent-users/edit-basic-info.json',
        urlViewPersonal     : '/cake4/rd_cake/permanent-users/view-personal-info.json',
        urlEditPersonal     : '/cake4/rd_cake/permanent-users/edit-personal-info.json',
        
        urlCsvImport        : '/cake4/rd_cake/permanent-users/import.json',
        
        urlEmailSend        : '/cake4/rd_cake/permanent-users/email-user-details.json',
        urlEnableDisable    : '/cake4/rd_cake/permanent-users/enable-disable.json',
        urlChangePassword   : '/cake4/rd_cake/permanent-users/change-password.json',
        urlDelete           : '/cake4/rd_cake/permanent-users/delete.json', 
        urlDevicesListedOnly: '/cake4/rd_cake/permanent-users/restrict-list-of-devices.json',
        urlAutoAddMac       : '/cake4/rd_cake/permanent-users/auto-mac-on-off.json',        
        urlDeleteRadaccts   : '/cake4/rd_cake/radaccts/delete.json',
        urlDeletePostAuths  : '/cake4/rd_cake/radpostauths/delete.json',

    },
    refs: [
        {  ref: 'grid',         selector:   'gridPermanentUsers'},
        {  ref: 'privateGrid',  selector:   'gridUserPrivate'}        
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

      //  me.getStore('sPermanentUsers').addListener('load',me.onStorePermanentUsersLoaded, me);
        me.control({
            'gridPermanentUsers #reload': {
                click:      me.reload
            },
            'gridPermanentUsers #reload menuitem[group=refresh]'   : {
                click:      me.reloadOptionClick
            }, 
            'gridPermanentUsers #add'   : {
                click:      me.add
            },
            'gridPermanentUsers #delete'   : {
                click:      me.del
            },
            'gridPermanentUsers #edit'   : {
                click:      me.edit
            },
            'gridPermanentUsers #upload' : {
				click	: me.csvImport
			},
			'winPermanentUserImport #btnSave': {
                click:  me.csvImportSubmit
            },	
            'gridPermanentUsers #csv'  : {
                click:      me.csvExport
            },
            '#winCsvColumnSelectPermanentUsers #save': {
                click:  me.csvExportSubmit
            },
            'gridPermanentUsers #email': {
                click:    me.email
            },
            'gridPermanentUsers #password'  : {
                click:      me.changePassword
            },
            'gridPermanentUsers #enable_disable' : {
                click:      me.enableDisable
            },
            'gridPermanentUsers #test_radius' : {
                click:      me.testRadius
            },
            'gridPermanentUsers #graph'   : {
                click:      me.graph
            },
            'gridPermanentUsers #byod'   : {
                click:      me.byod
            },
            'gridPermanentUsers #topup'   : {
                click:      me.topup
            },
            'gridPermanentUsers'   : {
                select          : me.select,
                menuItemClick   : me.onActionColumnMenuItemClick
            },
            'gridPermanentUsers actioncolumn': {
                 itemClick  : me.onActionColumnItemClick
            },
            'winUserEmailDetail #send'   : {
                click:      me.emailSend
            },
            'winPermanentUserAdd #btnDataNext' : {
                click:  me.btnDataNext
            },
            'winPermanentUserAdd #profile' : {
                change:  me.cmbProfileChange
            },
            'winPermanentUserAdd #realm' : {
                change:  me.cmbRealmChange
            },
            'winPermanentUserAdd #always_active' : {
                change:  me.chkAlwaysActiveChange
            },
            'winPermanentUserAdd #to_date' : {
                change:  me.toDateChange
            },
            'winPermanentUserAdd #from_date' : {
                change:  me.fromDateChange
            },           
            'pnlPermanentUser gridUserRadpostauths #reload' :{
                click:      me.gridUserRadpostauthsReload
            },
            'pnlPermanentUser gridUserRadpostauths #delete' :{
                click:      me.deletePostAuths
            },
            'pnlPermanentUser gridUserRadpostauths' : {
                activate:      me.gridActivate
            },
            'pnlPermanentUser gridUserRadaccts #reload' :{
                click:      me.gridUserRadacctsReload
            },
            'pnlPermanentUser gridUserRadaccts #delete' :{
                click:      me.deleteRadaccts
            },
            'pnlPermanentUser gridUserRadaccts' : {
                activate:      me.gridActivate
            },
            'pnlPermanentUser gridUserDevices' : {
                activate:      me.gridActivate
            },
            'pnlPermanentUser gridUserDevices #reload' :{
                click:      me.gridUserDevicesReload
            },
            'pnlPermanentUser gridUserDevices #chkListedOnly' :{
                change:      me.gridUserDevicesListedOnly
            },
            'pnlPermanentUser gridUserDevices #chkAutoAddMac' :{
                change:      me.gridUserDevicesAutoAddMac
            },
            'pnlPermanentUser gridUserPrivate' : {
                select:        me.selectUserPrivate,
                activate:      me.gridActivate
            },
            'pnlPermanentUser #profile' : {
                change:  me.cmbProfileChange,
                render:  me.renderEventProfile
            },
            'pnlPermanentUser #realm' : {
                render:  me.renderEventRealm,
                change:  me.cmbRealmChange
            },
            'pnlPermanentUser #always_active' : {
                change:  me.chkAlwaysActiveChange
            },
            'pnlPermanentUser #to_date' : {
                change:  me.toDateChange
            },
            'pnlPermanentUser #from_date' : {
                change:  me.fromDateChange
            },
            'pnlPermanentUser #tabBasicInfo' : {
                activate: me.onTabBasicInfoActive
            },
            'pnlPermanentUser #tabBasicInfo #save' : {
                click: me.saveBasicInfo
            },
            'pnlPermanentUser #tabPersonalInfo' : {
                activate: me.onTabPersonalInfoActive
            },
            'pnlPermanentUser #tabPersonalInfo #save' : {
                click: me.savePersonalInfo
            },
            '#winEnableDisablePermanentUser #save': {
                click: me.enableDisableSubmit
            },
            'gridUserPrivate' : {
                beforeedit:     me.onBeforeEditUserPrivate
            },
            'gridUserPrivate  #cmbVendor': {
                change:      me.cmbVendorChange
            },
            'gridUserPrivate  #add': {
                click:      me.attrAdd
            },
            'gridUserPrivate  #reload': {
                click:      me.attrReload
            },
            'gridUserPrivate  #delete': {
                click:      me.attrDelete
            }
        });
    },
    reload: function(){
        var me =this;
        me.getGrid().getSelectionModel().deselectAll(true);
        me.getGrid().getStore().load();
    },
    gridActivate: function(g){
        var me = this;
        var grid = g.down('grid');
        if(grid){
            grid.getStore().load();
        }else{
            g.getStore().load();
        }        
    },
    add: function(button){  
        var me      = this;
        var c_name 	= Ext.getApplication().getCloudName();
        var c_id	= Ext.getApplication().getCloudId()
        if(!Ext.WindowManager.get('winPermanentUserAddId')){
            var w = Ext.widget('winPermanentUserAdd',{id:'winPermanentUserAddId',cloudId: c_id, cloudName: c_name,selLanguage : Ext.getApplication().getSelLanguage()});
            w.show();         
        }
    },
    btnDataNext:  function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        var multi   = win.down('#multiple').getValue();
        form.submit({
            clientValidation: true,
            url: me.getUrlAdd(),
            success: function(form, action) {
                if(multi != true){
                    win.close(); //Multi keep open for next user
                }
                me.getStore('sPermanentUsers').load();
                Ext.ux.Toaster.msg(
                    i18n('sNew_item_created'),
                    i18n('sItem_created_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            //Focus on the first tab as this is the most likely cause of error 
            failure: function(form,action){
                var tp = win.down('tabpanel');
                tp.setActiveTab(0);
                Ext.ux.formFail(form,action)
            }
        });
    },

    cmbProfileChange:   function(cmb){
        var me      = this;
        var form    = cmb.up('form');
        var cmbDataCap  = form.down('#cmbDataCap');
        var cmbTimeCap  = form.down('#cmbTimeCap');
        var value   = cmb.getValue();
        var s = cmb.getStore();
        var r = s.getById(value);
        //console.log("Profile changed");
        if(r != null){
            var data_cap = r.get('data_cap_in_profile');
            if(data_cap){
                cmbDataCap.setVisible(true);
                cmbDataCap.setDisabled(false);
            }else{
                cmbDataCap.setVisible(false);
                cmbDataCap.setDisabled(true);
            }
            var time_cap = r.get('time_cap_in_profile');
            if(time_cap){
                cmbTimeCap.setVisible(true);
                cmbTimeCap.setDisabled(false);
            }else{
                cmbTimeCap.setVisible(false);
                cmbTimeCap.setDisabled(true);
            }
        }
    },
    cmbRealmChange:   function(cmb){
        var me      = this;
        var form    = cmb.up('form');
        var cmbRealmVlans = form.down('cmbRealmVlans');
        var realm_id= cmb.getValue();
        cmbRealmVlans.getStore().getProxy().setExtraParam('realm_id',realm_id);
        cmbRealmVlans.getStore().load();
    },

    chkAlwaysActiveChange: function(chk){
        var me      = this;
        var form    = chk.up('form');
        var from    = form.down('#from_date');
        var to      = form.down('#to_date');
        var value   = chk.getValue();
        if(value){
            to.setVisible(false);
            to.setDisabled(true);
            from.setVisible(false);
            from.setDisabled(true);
        }else{
            to.setVisible(true);
            to.setDisabled(false);
            from.setVisible(true);
            from.setDisabled(false);
        }
    },

    toDateChange: function(d,newValue,oldValue){
        var me = this;
        var form = d.up('form');   
        var from_date = form.down('#from_date');
        if(newValue <= from_date.getValue()){
            Ext.ux.Toaster.msg(
                        i18n('sEnd_date_wrong'),
                        i18n('sThe_end_date_should_be_after_the_start_date'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },

    fromDateChange: function(d,newValue, oldValue){
        var me = this;
        var form = d.up('form');
        var to_date = form.down('#to_date');
        if(newValue >= to_date.getValue()){
            Ext.ux.Toaster.msg(
                        i18n('sStart_date_wrong'),
                        i18n('sThe_start_date_should_be_before_the_end_date'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    select:  function(grid, record, item, index, event){
        var me = this;
        //Adjust the Edit and Delete buttons accordingly...
        //Dynamically update the top toolbar
        tb = me.getGrid().down('toolbar[dock=top]');

        var edit = record.get('update');
        if(edit == true){
            if(tb.down('#edit') != null){
                tb.down('#edit').setDisabled(false);
                tb.down('#password').setDisabled(false);
            }
        }else{
            if(tb.down('#edit') != null){
                tb.down('#edit').setDisabled(true);
                tb.down('#password').setDisabled(true);
            }
        }

        var del = record.get('delete');
        if(del == true){
            if(tb.down('#delete') != null){
                tb.down('#delete').setDisabled(false);
            }
        }else{
            if(tb.down('#delete') != null){
                tb.down('#delete').setDisabled(true);
            }
        }
    },
    edit:   function(){
       // console.log("Edit node");  
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getGrid().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{

            var selected    =  me.getGrid().getSelectionModel().getSelection();
            var count       = selected.length;         
            Ext.each(me.getGrid().getSelectionModel().getSelection(), function(sr,index){

                //Check if the node is not already open; else open the node:
                var tp          = me.getGrid().up('tabpanel');
                var pu_id       = sr.getId();
                var pu_tab_id   = 'puTab_'+pu_id;
                var nt          = tp.down('#'+pu_tab_id);
                if(nt){
                    tp.setActiveTab(pu_tab_id); //Set focus on  Tab
                    return;
                }

                var pu_tab_name = sr.get('username');
                //Tab not there - add one
                tp.add({ 
                    title :     pu_tab_name,
                    itemId:     pu_tab_id,
                    closable:   true,
                    glyph: Rd.config.icnEdit,
                    layout:     'fit', 
                    items:      {'xtype' : 'pnlPermanentUser',pu_id: pu_id, pu_name: pu_tab_name, record: sr},
                    tabConfig : {
                        ui : Rd.config.tabPermUsers
                    }
                });
                tp.setActiveTab(pu_tab_id); //Set focus on Add Tab
            });
        }
    },

    del:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGrid().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    var selected    = me.getGrid().getSelectionModel().getSelection();
                    var list        = [];
                    Ext.Array.forEach(selected,function(item){
                        var id = item.getId();
                        Ext.Array.push(list,{'id' : id});
                    });
                    Ext.Ajax.request({
                        url: me.getUrlDelete(),
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){console.log('success');
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.reload(); //Reload from server
                        },                                    
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.reload(); //Reload from server
                        }
                    });
                }
            });
        }
    },
    
    csvImport: function(button,format) {
        var me      = this;
        var c_name 	= Rd.getApplication().getCloudName();
        var c_id	= Rd.getApplication().getCloudId()    
        if(!Ext.WindowManager.get('winPermanentUserImportId')){
            var w = Ext.widget('winPermanentUserImport',{id:'winPermanentUserImportId',cloudId: c_id, cloudName: c_name});
            w.show()      
        }  
    },
    csvImportSubmit : function(button){
        var me      = this;
        var form    = button.up('form');
        var window  = form.up('window');
        var store   = me.getGrid().getStore();
        form.submit({
            clientValidation: true,
            waitMsg     : 'Uploading your CSV list...',
            url         : me.getUrlCsvImport(),
            success     : function(form, action) {              
                if(action.result.success){
                    store.load();
                    window.close();                   
                } 
                Ext.ux.Toaster.msg(
                    'Permanent Users Uploaded',
                    action.result.message,
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure : Ext.ux.formFail
        });
    },
        
    csvExport: function(button,format) {
        var me          = this;
        var columns     = me.getGrid().down('headercontainer').getGridColumns();
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list.push(chk);
            }
        });
        col_list.push({boxLabel: 'Cleartext Password', name: 'cleartext_password', checked: false});
          
        if(!Ext.WindowManager.get('winCsvColumnSelectPermanentUsers')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectPermanentUsers',columns: col_list});
            w.show();         
        }
    },
    csvExportSubmit: function(button){

        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');

        var chkList = form.query('checkbox');
        var c_found = false;
        var columns = [];
        var c_count = 0;
        Ext.Array.each(chkList,function(item){
            if(item.getValue()){ //Only selected items
                c_found = true;
                columns[c_count] = {'name': item.getName()};
                c_count = c_count +1; //For next one
            }
        },me);

        if(!c_found){
            Ext.ux.Toaster.msg(
                        i18n('sSelect_one_or_more'),
                        i18n('sSelect_one_or_more_columns_please'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{     
            //next we need to find the filter values:
            var filters     = [];
            var f_count     = 0;
            var f_found     = false;
            var filter_json ='';
            
            var filter_collection = me.getGrid().getStore().getFilters();     
            if(filter_collection.count() > 0){
                var i = 0;
                while (f_count < filter_collection.count()) { 

                    //console.log(filter_collection.getAt(f_count).serialize( ));
                    f_found         = true;
                    var ser_item    = filter_collection.getAt(f_count).serialize( );
                    ser_item.field  = ser_item.property;
                    filters[f_count]= ser_item;
                    f_count         = f_count + 1;
                    
                }     
            }
               
            var col_json        = "columns="+encodeURIComponent(Ext.JSON.encode(columns));
            var extra_params    = Ext.Object.toQueryString(Ext.Ajax.getExtraParams());
            var append_url      = "?"+extra_params+'&'+col_json;
            if(f_found){
                filter_json = "filter="+encodeURIComponent(Ext.JSON.encode(filters));
                append_url  = append_url+'&'+filter_json;
            }
            window.open(me.getUrlExportCsv()+append_url);
            win.close();
        }
    },
    email: function(button){
        var me = this;
        var sel_count = me.getGrid().getSelectionModel().getCount();
        if(sel_count == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(sel_count > 1){
                Ext.ux.Toaster.msg(
                        i18n('sLimit_the_selection'),
                        i18n('sSelection_limited_to_one'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{

                //Determine the selected record:
                var sr           = me.getGrid().getSelectionModel().getLastSelected();
                var user_name    = sr.get('username');

                if(!Ext.WindowManager.get('winUserEmailDetailId'+sr.getId())){
                    var w = Ext.widget('winUserEmailDetail',
                        {
                            id       : 'winUserEmailDetailId'+sr.getId(),
                            userId   : sr.getId(),
                            username : user_name,
                            email    : sr.get('email')
                        });
                    w.show();       
                }
            }    
        }
    },
    emailSend: function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.setLoading(true); //Mask it
        form.submit({
            clientValidation: true,
            url: me.getUrlEmailSend(),
            success: function(form, action) {
                win.close();
                Ext.ux.Toaster.msg(
                    'Voucher details sent',
                    'Voucher details sent fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    }, 
    changePassword: function(){
        var me = this;
     //   console.log("Changing password");
         //Find out if there was something selected
        var sel_count = me.getGrid().getSelectionModel().getCount();
        if(sel_count == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(sel_count > 1){
                Ext.ux.Toaster.msg(
                        i18n('sLimit_the_selection'),
                        i18n('sSelection_limited_to_one'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{
                var sr          = me.getGrid().getSelectionModel().getLastSelected();
                var item_id     = sr.getId();
                var username    = sr.get('username');
                Ext.getApplication().runAction('cPassword','Index',{id:item_id, username : username});                  
            }    
        }
    },
    enableDisable: function(){
        var me      = this;
        var grid    = me.getGrid();
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){ 
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_edit'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(!Ext.WindowManager.get('winEnableDisablePermanentUser')){
                var w = Ext.widget('winEnableDisable',{id:'winEnableDisablePermanentUser'});
                w.show();       
            }    
        }
    },
    enableDisableSubmit:function(button){

        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');

        var extra_params    = {};
        var s               = me.getGrid().getSelectionModel().getSelection();
        Ext.Array.each(s,function(record){
            var r_id = record.getId();
            extra_params[r_id] = r_id;
        });

        //Checks passed fine...      
        form.submit({
            clientValidation    : true,
            url                 : me.getUrlEnableDisable(),
            params              : extra_params,
            success             : function(form, action) {
                win.close();
                me.reload();
                Ext.ux.Toaster.msg(
                    i18n('sItems_modified'),
                    i18n('sItems_modified_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure             : Ext.ux.formFail
        });
    },
    testRadius: function(){
        var me = this;
        var grid = me.getGrid();
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){ 
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_test'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            var sr = grid.getSelectionModel().getLastSelected();
            Ext.getApplication().runAction('cRadiusClient','TestPermanent',sr);        
        }
    },  
    gridUserRadpostauthsReload: function(button){
        var me  = this;
        var g = button.up('gridUserRadpostauths');
        g.getStore().load();
    },
    gridUserDevicesReload: function(button){
        var me  = this;
        var g = button.up('gridUserDevices');
        g.getStore().load();
    },
    gridUserRadacctsReload: function(button){
        var me  = this;
        var g   = button.up('gridUserRadaccts');
        g.getStore().load();
    },
    gridUserDevicesListedOnly : function(chk){
        var me          = this;
        var username    = chk.up('gridUserDevices').username;
        var g_devices   = chk.up('gridUserDevices');
        var chk_auto    = g_devices.down('#chkAutoAddMac');

        //We have to uncheck the auto add check if this is checked
        var chk_listed  = chk.getValue();
        if(chk_listed){   
            if(chk_auto.getValue()){
                console.log("Disable auto add check");
                chk_auto.setValue(false);
            }            
        }

        Ext.Ajax.request({
            url: me.getUrlDevicesListedOnly(),
            method: 'GET',
            params: {username : username, restrict : chk.getValue() },
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    Ext.ux.Toaster.msg(
                                i18n('sItem_updated'),
                                i18n('sItem_updated_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                    );    
                }   
            },
            scope: me
        });
    },
    gridUserDevicesAutoAddMac : function(chk){
        var me          = this;
        var username    = chk.up('gridUserDevices').username;
        var g_devices   = chk.up('gridUserDevices');
        var chk_listed  = g_devices.down('#chkListedOnly');

       //We have to uncheck the only from this devices check if this is checked
        var auto_m = chk.getValue();
        if(auto_m){   
            if(chk_listed.getValue()){
                console.log("Disable only listed check");
                chk_listed.setValue(false);
            }            
        }

        Ext.Ajax.request({
            url: me.getUrlAutoAddMac(),
            method: 'GET',
            params: {username : username, auto_mac : chk.getValue() },
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    Ext.ux.Toaster.msg(
                                i18n('sItem_updated'),
                                i18n('sItem_updated_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                    );    
                }   
            },
            scope: me
        });
    },
    deletePostAuths:   function(button){
        var me      = this;
        var grid    = button.up('grid');   
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    var selected    = grid.getSelectionModel().getSelection();
                    var list        = [];
                    Ext.Array.forEach(selected,function(item){
                        var id = item.getId();
                        Ext.Array.push(list,{'id' : id});
                    });
                    Ext.Ajax.request({
                        url: me.getUrlDeletePostAuths(),
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){console.log('success');
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            grid.getSelectionModel().deselectAll(true);
                            grid.getStore().load();
                        },                                    
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            grid.getSelectionModel().deselectAll(true);
                            grid.getStore().load();
                        }
                    });
                }
            });
        }
    },
    deleteRadaccts:   function(button){
        var me      = this;
        var grid    = button.up('grid');   
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    var selected    = grid.getSelectionModel().getSelection();
                    var list        = [];
                    Ext.Array.forEach(selected,function(item){
                        var id = item.getId();
                        Ext.Array.push(list,{'id' : id});
                    });
                    Ext.Ajax.request({
                        url: me.getUrlDeleteRadaccts(),
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){console.log('success');
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            grid.getSelectionModel().deselectAll(true);
                            grid.getStore().load();
                        },                                    
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            grid.getSelectionModel().deselectAll(true);
                            grid.getStore().load();
                        }
                    });
                }
            });
        }
    },
    reloadOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReload);   //Always clear
        b.setGlyph(Rd.config.icnTime);

        if(n == 'mnuRefreshCancel'){
            b.setGlyph(Rd.config.icnReload);
            return;
        }
        
        if(n == 'mnuRefresh1m'){
           interval = 60000
        }

        if(n == 'mnuRefresh5m'){
           interval = 360000
        }
        me.autoReload = setInterval(function(){        
            me.reload();
        },  interval);  
    },
    onTabBasicInfoActive: function(t){
        var me      = this;
        var form    = t;
        //get the user's id
        var user_id = t.up('pnlPermanentUser').pu_id;
        form.load({url:me.getUrlViewBasic(), method:'GET',params:{user_id:user_id}, 
            success : function(a,b){
                //Set the CAP's of the permanent user
                if(b.result.data.data_cap_type != undefined){
                    var cmbDataCap  = form.down('#cmbDataCap');
                    cmbDataCap.setVisible(true);
                    cmbDataCap.setDisabled(false);
                    cmbDataCap.setValue(b.result.data.data_cap_type);
                }

                if(b.result.data.time_cap_type != undefined){
                    var cmbTimeCap  = form.down('#cmbTimeCap');
                    cmbTimeCap.setVisible(true);
                    cmbTimeCap.setDisabled(false);
                    cmbTimeCap.setValue(b.result.data.time_cap_type);
                }
            } 
        });
    },
    saveBasicInfo:function(button){

        var me      = this;
        var form    = button.up('form');
        var user_id = button.up('pnlPermanentUser').pu_id;
        //Checks passed fine...      
        form.submit({
            clientValidation    : true,
            url                 : me.getUrlEditBasic(),
            params              : {id: user_id},
            success             : function(form, action) {
                me.reload();
                Ext.ux.Toaster.msg(
                    i18n('sItems_modified'),
                    i18n('sItems_modified_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure             : Ext.ux.formFail
        });
    },
    onTabPersonalInfoActive: function(t){
        var me      = this;
        var form    = t;
        //get the user's id
        var user_id = t.up('pnlPermanentUser').pu_id;
        form.load({url:me.getUrlViewPersonal(), method:'GET',params:{user_id:user_id}});
    },
    savePersonalInfo:function(button){

        var me      = this;
        var form    = button.up('form');
        var user_id = button.up('pnlPermanentUser').pu_id;
        //Checks passed fine...      
        form.submit({
            clientValidation    : true,
            url                 : me.getUrlEditPersonal(),
            params              : {id: user_id},
            success             : function(form, action) {
                me.reload();
                Ext.ux.Toaster.msg(
                    i18n('sItems_modified'),
                    i18n('sItems_modified_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure             : Ext.ux.formFail
        });
    },
    appClose:   function(){
        var me          = this;
        me.populated    = false;
        if(me.autoReload != undefined){
            clearInterval(me.autoReload);   //Always clear
        }
    },
    selectUserPrivate:  function(grid, record, item, index, event){
        var me = this;
        //Adjust the Edit and Delete buttons accordingly...
        //Dynamically update the top toolbar
        tb = me.getPrivateGrid().down('toolbar[dock=top]');
        var del = record.get('delete');
        if(del == true){
            if(tb.down('#delete') != null){
                tb.down('#delete').setDisabled(false);
            }
        }else{
            if(tb.down('#delete') != null){
                tb.down('#delete').setDisabled(true);
            }
        }
    },
    onBeforeEditUserPrivate: function(g,e){
        var me = this;
        return e.record.get('edit');
    },
    cmbVendorChange: function(cmb){
        var me = this;
        var value   = cmb.getValue();
        var grid    = cmb.up('gridUserPrivate');
        var attr    = grid.down('cmbAttribute');
        //Cause this to result in a reload of the Attribute combo
        attr.getStore().getProxy().setExtraParam('vendor',value);
        attr.getStore().load();   
    },
    attrAdd: function(b){
        var me = this;
        var grid    = b.up('gridUserPrivate');
        var attr    = grid.down('cmbAttribute');
        var a_val   = attr.getValue();
        if(a_val == null){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{

            //We do double's since it is standard for FreeRADIUS
            var f = grid.getStore().find('attribute',a_val);
            if(f == -1){
                grid.getStore().add(Ext.create('Rd.model.mPrivateAttribute',
                    {
                        type            : 'check',
                        attribute       : a_val,
                        op              : ':=',
                        value           : i18n('sReplace_this_value'),
                        delete          : true,
                        edit            : true
                    }
                ));
                grid.getStore().sync();
            }else{
                //We allow second entried for multiple values
                grid.getStore().add(Ext.create('Rd.model.mPrivateAttribute',
                    {
                        type            : 'check',
                        attribute       : a_val,
                        op              : '+=',
                        value           : i18n('sReplace_this_value'),
                        delete          : true,
                        edit            : true
                    }
                ));
                grid.getStore().sync(); 
            }
        }
    },

    attrReload: function(b){
        var me = this;
        var grid = b.up('gridUserPrivate');
        grid.getStore().load();
    },
    attrDelete: function(button){

        var me      = this;
        var grid    = button.up('gridUserPrivate');
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    grid.getStore().remove(grid.getSelectionModel().getSelection());
                    grid.getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                           // grid.getStore().load();   //Update the count
                            me.reload();   
                        },
                        failure: function(batch,options,c,d){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            grid.getStore().load(); //Reload from server since the sync was not good
                        }
                    });
                }
            });
        }
    },
    renderEventRealm: function(cmb){
        var me                      = this;
        var pnlPu               = cmb.up('pnlPermanentUser');
        pnlPu.cmbRealmRendered  = true;
        if(pnlPu.record != undefined){
            var rn      = pnlPu.record.get('realm');
            var r_id    = pnlPu.record.get('realm_id');
            var rec     = Ext.create('Rd.model.mRealm', {name: rn, id: r_id});
            cmb.getStore().loadData([rec],false);
        }
    },
    renderEventProfile: function(cmb){
        var me          = this;
        var pnlPu       = cmb.up('pnlPermanentUser');
        pnlPu.cmbProfileRendered  = true;
        if(pnlPu.record != undefined){
            var pn      = pnlPu.record.get('profile');
            var p_id    = pnlPu.record.get('profile_id');
            var rec     = Ext.create('Rd.model.mProfile', {name: pn, id: p_id});
            cmb.getStore().loadData([rec],false);
        }
    },
    graph: function(button){
        var me = this;  
        //Find out if there was something selected
        if(me.getGrid().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            //Check if the node is not already open; else open the node:
            var tp      = me.getGrid().up('tabpanel');
            var sr      = me.getGrid().getSelectionModel().getLastSelected();
            var id      = sr.getId();
            var tab_id  = 'permanentUserTabGraph_'+id;
            var nt      = tp.down('#'+tab_id);
            if(nt){
                tp.setActiveTab(tab_id); //Set focus on  Tab
                return;
            }
            var dd              = Ext.getApplication().getDashboardData();
            var timezone_id     = dd.user.timezone_id;

            var tab_name = sr.get('username');
            //Tab not there - add one
            tp.add({ 
                title       : tab_name,
                itemId      : tab_id,
                closable    : true,
                glyph       : Rd.config.icnGraph, 
                xtype       : 'pnlPermanentUserGraphs',
                timezone_id : timezone_id,
                pu_name     : tab_name,
                tabConfig : {
                    ui : Rd.config.tabPermUsers
                }
            });
            tp.setActiveTab(tab_id); //Set focus on Add Tab 
        }
    },
    byod: function(b){
        var me = this;
        tp = b.up('tabpanel');
        Ext.getApplication().runAction('cDevices','Index',tp);
    },
    topup: function(b){
        var me = this;
        tp = b.up('tabpanel');
        Ext.getApplication().runAction('cTopUps','Index',tp);
    },
    onActionColumnItemClick: function(view, rowIndex, colIndex, item, e, record, row, action){
        //console.log("Action Item "+action+" Clicked");
        var me = this;
        var grid = view.up('grid');
        grid.setSelection(record);
        if(action == 'update'){
            me.edit()
        }
        if(action == 'delete'){
            me.del();
        }
    },
    onActionColumnMenuItemClick: function(grid,action){
        var me = this;
        grid.setSelection(grid.selRecord);
        if(action == 'email'){
            me.email();
        }
        if(action == 'password'){
            me.changePassword();
        }
        if(action == 'disable'){
            me.enableDisable();
        }
        if(action == 'radius'){
            me.testRadius();
        }
        if(action == 'graphs'){
            me.graph();
        }
    }
    
});
