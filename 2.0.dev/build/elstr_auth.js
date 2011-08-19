/**
 * User handling for Elstr applications
 * 
 * MARKUP examples
 * 
 * Required for Authentication: 
 * <div id="loginDialog" style="display: none;">
 *     <div class="yui3-widget-hd">
 *         Anmelden
 *     </div>
 *     <div class="yui3-widget-bd">
 *         <div class="username">
 *             <label for="username">Username</label>
 *             <input type="text" name="username" />
 *         </div>
 *         <div class="password">
 *             <label for="password">Password</label>
 *             <input type="password" name="password" />
 *         </div>
 *         <div class="loginDialogMessageContainer">      
 *         </div>
 *     </div>
 *     <div class="yui3-widget-ft">
 *         <div class="login button">Anmelden</div>
 *         <div class="cancel button">Abbrechen</div>
 *     </div>    
 * </div>
 *  
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2011
 */


YUI.add('elstr_auth', function (Y) {
    Y.namespace('ELSTR').Auth = Y.Base.create('elstr_auth', Y.Panel, [], {
                
        //
        // WIDGET FUNCTIONS
        //

        initializer: function () {
        // 
        },

        destructor: function () {
            // Remove all click listeners
            this.get('contentBox').purge(true);
        },

        renderUI: function () {            
            // Always loaded from markup
            // Remove any diyplay none settings       
            this.get('contentBox').setStyle("display","");
        },

        bindUI: function () {
            var that = this;
            var contentBox = this.get('contentBox');
            contentBox.one(".login").on("click", function(e) {
                this._handleSubmit();
            },this);
            var enterListener = Y.on('key', function(e) {
                that._handleSubmit();
            }, '#loginDialog', 'down:13', Y);
            
            Y.log(this.get("forceAuthentication"));
            if (this.get("forceAuthentication") === true){
                contentBox.one(".cancel").remove(true); 
            } else {
                contentBox.one(".cancel").on("click",function(e) {
                    this._handleCancel();
                },this);                 
            }
            Y.on("resize", this._handleWindowResize, window, this);
        },

        syncUI: function () {
            
        },
    
        //
        // PUBLIC FUNCTIONS
        //

        login : function(enterpriseApplication){
            if(Y.Lang.isUndefined(enterpriseApplication) || enterpriseApplication == ''){
                this._enterpriseApplication = '';
            } else {
                // TODO enterpriseApplication auth events
                // if(YAHOO.lang.isUndefined(that.enterpriseApplicationAuthEvent[enterpriseApplication])){
                //     that.enterpriseApplicationAuthEvent[enterpriseApplication] = new YAHOO.util.CustomEvent("afterAuthEvent_"+enterpriseApplication, this, true, YAHOO.util.CustomEvent.LIST, true);
                // }

                this._enterpriseApplication = enterpriseApplication;
            }
            this.show();
            this.get('contentBox').one(".username input").focus();
        },
        logout : function(){
            this._logoutRequest();
        },        
    
        //
        // PRRIVATE VARIABLES
        //

        _enterpriseApplication : null,

        //
        // PRRIVATE FUNCTIONS
        //

        _handleSubmit : function() {
            var contentBox = this.get('contentBox');
            var username = contentBox.one(".username input").get("value");
            var password = contentBox.one(".password input").get("value");
            var enterpriseApplication = this._enterpriseApplication;
            this._clearPasswordValue();
            // Clear all child nodes of the message container element
            contentBox.one(".loginDialogMessageContainer").empty(true);

            this._authRequest(username, password, enterpriseApplication);
        },
        _handleCancel : function() {
            this._clearPasswordValue();
            // Clear all child nodes of the message container element
            this.get('contentBox').one(".loginDialogMessageContainer").empty(true);
            this.hide();
        },
        _clearPasswordValue : function(){
            this.get('contentBox').one(".password input").set("value","");
        },
        
        _authRequest : function(username, password, enterpriseApplication) {
            var that = this,
            eApp = enterpriseApplication,
            oRequestPost = {
                "jsonrpc" : "2.0",
                "method" : "auth",
                "params" : {
                    username : username,
                    password : password,
                    enterpriseApplication : enterpriseApplication
                },
                "id" : Y.ELSTR.Utils.uuid()
            },
            request = Y.io("services/ELSTR_AuthServer", {
                method:"POST",
                data:Y.JSON.stringify(oRequestPost),
                on: {
                    success:function(id, o){
                        Y.ELSTR.Utils.cursorWait.hide();
                        try {
                            var parsedResponse = Y.JSON.parse(o.responseText);
                        }
                        catch (e) {
                            Y.ELSTR.Utils.log(e,"error");
                            Y.ELSTR.Utils.log("Response: " + o.responseText,"info");
                            return;
                        }
                        var responseAction = parsedResponse.result.action;
                        var responseMessages = parsedResponse.result.message;
                 
                        if (responseAction == "success") {
                            that.hide();
                            that.fire('successfulAuth', parsedResponse.result);
                        
                        
                        //TODO: What is this for? This is a security leak!
                        //that.onAfterAuthEvent.fire(username, password);

                        //TODO: enterpriseApplication auth events                     
                        // try {
                        //     var oRequestPost = YAHOO.lang.JSON.parse(oRequest);
                        //     if (oRequestPost.params.enterpriseApplication != ''){
                        //         var enterpriseApplication = oRequestPost.params.enterpriseApplication;
                        //                          
                        //         that.enterpriseApplicationAuthEvent[enterpriseApplication].fire();
                        //     }
                        // }
                        // catch (e) {
                        // }
            
                        } else {
                            if (that.get("forceAuthentication") === true) {
                                that.login(eApp);
                            }
                            Y.APP.lang.messageInContainer("#loginDialog .loginDialogMessageContainer",responseMessages[0],"info");
                        } 
                    },
                    failure:function(id, o){
                        Y.ELSTR.Utils.cursorWait.hide();
                        Y.ELSTR.Error.requestFailure(null, o);                  
                    }
                }
            });
            Y.ELSTR.Utils.cursorWait.show();
        },
        _logoutRequest : function() {
            var that = this,
            oRequestPost = {
                "jsonrpc" : "2.0",
                "method" : "logout",
                "params" : {},
                "id" : Y.ELSTR.Utils.uuid()
            },
            request = Y.io("services/ELSTR_AuthServer", {
                method:"POST",
                data:Y.JSON.stringify(oRequestPost),
                on: {
                    success:function(id, o){
                        Y.ELSTR.Utils.cursorWait.hide();                        
                        that.fire('successfulLogout');             
                    },
                    failure:function(id, o){
                        Y.ELSTR.Utils.cursorWait.hide();
                        Y.ELSTR.Error.requestFailure(null, o);                 
                    }
                }
            });
            Y.ELSTR.Utils.cursorWait.show();
        },
        
        _handleWindowResize : function(){
            this.set("centered",true);
        }
       
        
    }, {
        ATTRS: {
            forceAuthentication: {
                value: false,
                validator: Y.Lang.isBoolean,
                writeOnce: "initOnly"
            }           
        }
    })

}, '2.0', {
    requires: ['base','node','panel','io','json','event','elstr_user','elstr_authcss'],
    skinnable: false
});


















