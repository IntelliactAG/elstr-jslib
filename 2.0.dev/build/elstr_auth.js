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
 * EVENTS
 * 
 * elstr_auth:successfulAuth fires with a successful authentication
 * elstr_auth:successfulLogout fires with a sucessful logout request
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2011
 */

YUI.add('elstr_auth', function(Y) {
 
    // private properties or functions
    var isInit = false,
    loginDialog, 
    _handleSubmit = function() {
        var username = Y.one("#loginDialog .username input").get("value");
        var password = Y.one("#loginDialog .password input").get("value");
        var enterpriseApplication = loginDialog.enterpriseApplication;
        _clearPasswordValue();
        // Clear all child nodes of the message container element
        Y.one("#loginDialog .loginDialogMessageContainer").empty(true);
        
        _authRequest(username, password, enterpriseApplication);
    },
    _handleCancel = function() {
        _clearPasswordValue();
        // Clear all child nodes of the message container element
        Y.one("#loginDialog .loginDialogMessageContainer").empty(true);
        loginDialog.hide();
    },
    _clearPasswordValue = function(){
        Y.one("#loginDialog .password input").set("value","");
    },
    _renderLoginDialog = function(){
        var nodeLoginDialog = Y.one("#loginDialog");
        if(nodeLoginDialog){
            nodeLoginDialog.setStyle("display","");
            loginDialog = new Y.Overlay({
                // Specify a reference to a node which already exists 
                srcNode:"#loginDialog",
                visible:false,
                centered:true,
                width:"20em"
            });
            loginDialog.render();
            nodeLoginDialog.one(".login").on("click",function(e) {
                _handleSubmit();
            });
            if (Y.ELSTR.user.forceAuthentication() === true){
                nodeLoginDialog.one(".cancel").remove(true); 
            } else {
                nodeLoginDialog.one(".cancel").on("click",function(e) {
                    _handleCancel();
                });                 
            }            
            var enterListener = Y.on('key', function(e) {
                _handleSubmit();
            // Attach to 'text1', specify keydown, keyCode 13, make Y the context
            }, '#loginDialog', 'down:13', Y);
        } else {
            Y.ELSTR.utils.log("An element with id loginDialog is required!","error","application");
        }
    },
    _authRequest = function(username, password, enterpriseApplication) {
        var eApp = enterpriseApplication;    
        var oRequestPost = {
            "jsonrpc" : "2.0",
            "method" : "auth",
            "params" : {
                username : username,
                password : password,
                enterpriseApplication : enterpriseApplication
            },
            "id" : Y.ELSTR.utils.uuid()
        };
        var request = Y.io("services/ELSTR_AuthServer", {
            method:"POST",
            data:Y.JSON.stringify(oRequestPost),
            on: {
                success:function(id, o){
                    Y.ELSTR.utils.cursorWait.hide();
                    try {
                        var parsedResponse = Y.JSON.parse(o.responseText);
                    }
                    catch (e) {
                        Y.ELSTR.utils.log(e,"error");
                        Y.ELSTR.utils.log("Response: " + o.responseText,"info");
                        return;
                    }
                    var responseAction = parsedResponse.result.action;
                    var responseMessages = parsedResponse.result.message;
                 
                    if (responseAction == "success") {

                        loginDialog.hide();
                        Y.fire('elstr_auth:successfulAuth', parsedResponse.result);
                        
                        
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
                        if (Y.ELSTR.user.forceAuthentication() === true && Y.ELSTR.user.isAuth() === false) {
                            Y.ELSTR.auth.login(eApp);
                        }
            			
                        //TODO: Use ELSTR.lang.alert here
                        Y.one("#loginDialog .loginDialogMessageContainer").append(responseMessages[0]);
                    } 
                },
                failure:function(id, o){
                    Y.ELSTR.utils.cursorWait.hide();
                    Y.ELSTR.error.requestFailure(null, o);                  
                }
            }
        });
        Y.ELSTR.utils.cursorWait.show();
    },
    _logoutRequest = function() {
        var oRequestPost = {
            "jsonrpc" : "2.0",
            "method" : "logout",
            "params" : {},
            "id" : Y.ELSTR.utils.uuid()
        };
        var request = Y.io("services/ELSTR_AuthServer", {
            method:"POST",
            data:Y.JSON.stringify(oRequestPost),
            on: {
                success:function(id, o){
                    Y.ELSTR.utils.cursorWait.hide();
                    Y.fire('elstr_auth:successfulLogout');           	 
                },
                failure:function(id, o){
                    Y.ELSTR.utils.cursorWait.hide();
                    Y.ELSTR.error.requestFailure(null, o);                 
                }
            }
        });
        Y.ELSTR.utils.cursorWait.show();
    };

    Y.namespace('ELSTR');
    Y.ELSTR.auth = {
        // public properties or functions
        init : function(){
            if(isInit === false){
                // Any init stuff here
                _renderLoginDialog();
                isInit = true;
            }
        },
        login : function(enterpriseApplication){
            Y.ELSTR.auth.init();
            if(Y.Lang.isUndefined(enterpriseApplication) || enterpriseApplication == ''){
                loginDialog.enterpriseApplication = '';
            } else {
                // TODO enterpriseApplication auth events
                // if(YAHOO.lang.isUndefined(that.enterpriseApplicationAuthEvent[enterpriseApplication])){
                //     that.enterpriseApplicationAuthEvent[enterpriseApplication] = new YAHOO.util.CustomEvent("afterAuthEvent_"+enterpriseApplication, this, true, YAHOO.util.CustomEvent.LIST, true);
                // }

                loginDialog.enterpriseApplication = enterpriseApplication;
            }
            loginDialog.show();            
        },
        logout : function(){
            Y.ELSTR.auth.init();
            _logoutRequest();
        }
    }
 
}, '2.0' /* module version */, {
    requires: ['base','node']
});