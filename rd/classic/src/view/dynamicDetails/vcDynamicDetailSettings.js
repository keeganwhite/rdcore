Ext.define('Rd.view.dynamicDetails.vcDynamicDetailSettings', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcDynamicDetailSettings',
    config: {
        urlViewDynamicDetail: '/cake4/rd_cake/dynamic-details/view.json'
    }, 
    onViewActivate: function(){
        var me                  = this;
        var dynamic_detail_id   = me.getView().dynamic_detail_id;
        me.getView().getForm().load({
            url         : me.getUrlViewDynamicDetail(), 
            method      : 'GET',
            params      : {dynamic_detail_id:dynamic_detail_id},
            success     : function(a,b,c){
                 if(b.result.data.realm_id != null){
                    var realm = me.getView().down("#realm");
                    var mr    = Ext.create('Rd.model.mRealm', {name: b.result.data.realm, id: b.result.data.realm_id});
                    realm.getStore().loadData([mr],false);
                    realm.setValue(b.result.data.realm_id);
                }
                if(b.result.data.profile_id != null){
                    var profile = me.getView().down("#profile");
                    var mp      = Ext.create('Rd.model.mProfile', {name: b.result.data.profile, id: b.result.data.profile_id});
                    profile.getStore().loadData([mp],false);
                    profile.setValue(b.result.data.profile_id);
                }
                if(b.result.data.permanent_user_username != undefined){
                    var pu = me.getView().down("cmbPermanentUser");
                    var mr = Ext.create('Rd.model.mPermanentUser', {username: b.result.data.permanent_user_username, id: b.result.data.permanent_user_id});
                    pu.getStore().loadData([mr],false);
                    pu.setValue(b.result.data.permanent_user_id);
                }
            },
            failure : function(form, action) {
                Ext.Msg.alert(action.response.statusText, action.response.responseText);
            }
        });         
    },  
    onCmbThemesChange: function(cmb){
        var me       = this;
        me.theme     = cmb.getValue();
        var pnl = cmb.up('panel');
        if(me.theme == 'Custom'){
        
            pnl.down('#txtCoovaDesktopUrl').setDisabled(false);
            pnl.down('#txtCoovaDesktopUrl').setHidden(false);
            
            pnl.down('#txtCoovaMobileUrl').setDisabled(false);
            pnl.down('#txtCoovaMobileUrl').setHidden(false);
            
            pnl.down('#txtMikrotikDesktopUrl').setDisabled(false);
            pnl.down('#txtMikrotikDesktopUrl').setHidden(false);
            
            pnl.down('#txtMikrotikMobileUrl').setDisabled(false);
            pnl.down('#txtMikrotikMobileUrl').setHidden(false);            
        }else{
            pnl.down('#txtCoovaDesktopUrl').setDisabled(true);
            pnl.down('#txtCoovaDesktopUrl').setHidden(true);
            
            pnl.down('#txtCoovaMobileUrl').setDisabled(true);
            pnl.down('#txtCoovaMobileUrl').setHidden(true);
            
            pnl.down('#txtMikrotikDesktopUrl').setDisabled(true);
            pnl.down('#txtMikrotikDesktopUrl').setHidden(true);
            
            pnl.down('#txtMikrotikMobileUrl').setDisabled(true);
            pnl.down('#txtMikrotikMobileUrl').setHidden(true);            
        }
    },
    onChkRegisterUsersChange: function(chk){
         var me     = this;
         var pnl    = chk.up('panel');
         
         var vlan_obj = pnl.down('#rgrpVlan').getValue();
         
         if(chk.getValue()){     
            pnl.down('cmbRealm').setDisabled(false);
            pnl.down('cmbProfile').setDisabled(false);
            pnl.down('#chkRegMacCheck').setDisabled(false);
            pnl.down('#chkRegAutoAdd').setDisabled(false);
            pnl.down('#chkRegEmail').setDisabled(false);
            pnl.down('#chkRegOtpSms').setDisabled(false);
            pnl.down('#chkRegOtpEmail').setDisabled(false);
            if(!pnl.down('#chkRegOtpEmail').getValue()){ //If NOT (!) selected; disable the user selector
                pnl.down('#cmbRegTempUser').setDisabled(true);
            }
            pnl.down('#chkRegPpsk').setDisabled(false);
            pnl.down('#rgrpVlan').setDisabled(false);
            
            if(vlan_obj.reg_rb_vlan == 'pre_select'){
                pnl.down('#cmbRealmVlans').setDisabled(false);
            }else{
                pnl.down('#cmbRealmVlans').setDisabled(true);
            }
                        
         }else{
            pnl.down('cmbRealm').setDisabled(true);
            pnl.down('cmbProfile').setDisabled(true);
            pnl.down('#chkRegMacCheck').setDisabled(true);
            pnl.down('#chkRegAutoAdd').setDisabled(true);
            pnl.down('#chkRegEmail').setDisabled(true);
            pnl.down('#chkRegOtpSms').setDisabled(true);
            pnl.down('#chkRegOtpEmail').setDisabled(true);
            pnl.down('#cmbRegTempUser').setDisabled(true);
            pnl.down('#chkRegPpsk').setDisabled(true);
            pnl.down('#rgrpVlan').setDisabled(true);
            pnl.down('#cmbRealmVlans').setDisabled(true);
         }  
    },
    rgrpVlanChange : function(rgrp,new_val,old_val){ 
        var me  = this;
        var pnl = rgrp.up('panel');
        if(new_val.reg_rb_vlan == 'pre_select'){
            pnl.down('#cmbRealmVlans').setDisabled(false);
        }else{
            pnl.down('#cmbRealmVlans').setDisabled(true);
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
    onChkRegAutoSuffixChange: function(chk){
        var me  = this;
        var pnl = chk.up('panel');
        if(chk.getValue()){
             pnl.down('#txtRegSuffix').setDisabled(false);
        }else{
             pnl.down('#txtRegSuffix').setDisabled(true);
        }
    },
    chkLostPasswordChange: function(chk){
        var me  = this;
        var pnl = chk.up('panel');
        if(chk.getValue()){
             pnl.down('#rgrpLostPwdMethod').setDisabled(false);
        }else{
             pnl.down('#rgrpLostPwdMethod').setDisabled(true);
        }   
    },
    chkSlideshowChange: function(chk){
        var me      = this;
        var form    = chk.up('form');
        var nr      = form.down('#nrEnforceInSeconds');
        var chkEnforce = form.down('#chkSlideshowEnforce');
        var value   = chk.getValue();
        if(value){
            chkEnforce.setDisabled(false);
            if(chkEnforce.getValue()){ 
                nr.setDisabled(false);
            }else{
                nr.setDisabled(true);
            }             
        }else{
            nr.setDisabled(true);
            chkEnforce.setDisabled(true);
        }
    },
    chkEnforceChange: function(chk){
        var me      = this;
        var form    = chk.up('form');
        var nr      = form.down('#nrEnforceInSeconds');
        var value   = chk.getValue();
        if(value){   
            nr.setDisabled(false);          
        }else{
            nr.setDisabled(true);
        }
    },
    chkRedirectChange: function(chk){
        var me          = this;
        var form        = chk.up('form');
        var disabled    = true;
        if(chk.getValue()){   
            disabled = false;       
        }    
        form.down('#txtRedirectUrl').setDisabled(disabled);
        form.down('#txtRedirectUrl').setHidden(disabled);
    },
    chkUsageChange: function(chk){
        var me          = this;
        var form        = chk.up('form');
        var disabled    = true;
        if(chk.getValue()){   
            disabled = false;       
        }    
        form.down('#nrUsageRefresh').setDisabled(disabled);
        form.down('#nrUsageRefresh').setHidden(disabled);
    },
    chkShowNameChange: function(chk){
        var me          = this;
        var form        = chk.up('form');
        var disabled    = true;
        if(chk.getValue()){   
            disabled = false;       
        }    
        form.down('#clrNameColour').setDisabled(disabled);    
    },
    chkRegOtpEmailChange: function(chk){
        var me          = this;
        var cnt       = chk.up('#cntRegister');
        var disabled    = true;
        if(chk.getValue()){   
            disabled = false;       
        }    
        cnt.down('#cmbRegTempUser').setDisabled(disabled);
    }
});
