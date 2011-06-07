/**
 * User handling for Elstr applications
 * 
 * MARKUP examples
 * 
 * Required for Authentication: 
 * 	<div id="loginHandler">
 *		<span class="login clickable">Anmelden</span>
 *		<span class="logout clickable">Abmelden</span>
 *		<span class="user"></span>
 *		<span class="admin clickable">Admin</span>
 *	</div>
 *	
 *	
 * EVENTS
 * 
 * elstr_user:afterInit fires when the initialization of the elstr user is complete
 * elstr_user:afterAuth fires when the user is successfully authenticated
 * elstr_user:afterLogout fires when a user successfully logged out
 *  
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2011
 */

YUI.add('elstr_user', function(Y) {
 
    // private properties or functions
    var currentUsername,
    isAuth,
    isAdmin,
    resourcesAllowed,
    enterpriseApplicationData,
    accessDeniedDialog,
    forceAuthentication = false,
    _renderLoginHandler = function() {
        // Render the handler only if it exists
        var nodeLoginHandler = Y.one("#loginHandler");
        if(nodeLoginHandler){
            nodeLoginHandler.one(".login").on("click", function(e) {
                Y.use('elstr_auth', function (Y) {
                    Y.ELSTR.auth.login();
                });
            });
            nodeLoginHandler.one(".logout").on("click", function(e) {
                Y.use('elstr_auth', function (Y) {
                    Y.ELSTR.auth.logout();
                });
            });  
            nodeLoginHandler.one(".logout").on("click", function(e) {
                Y.use('elstr_admin', function (Y) {
                    Y.ELSTR.admin.openAdminConsole();
                });
            });            
        }
    },
    _updateLoginHandler = function() {
        // Update the handler only if it exists
        var nodeLoginHandler = Y.one("#loginHandler");
        if(nodeLoginHandler){
            if(isAuth === true){
                nodeLoginHandler.one(".login").setStyle("display","none");
                nodeLoginHandler.one(".user").setStyle("display","");
                nodeLoginHandler.one(".logout").setStyle("display","");
            } else {
                nodeLoginHandler.one(".login").setStyle("display","");
                nodeLoginHandler.one(".user").setStyle("display","none");
                nodeLoginHandler.one(".logout").setStyle("display","none");                
            }
    
            if(isAdmin === true){
                nodeLoginHandler.one(".admin").setStyle("display","");
            } else {
                nodeLoginHandler.one(".admin").setStyle("display","none");
            }
        }

    },
    _onSuccessfulAuth = function(result) {
        isAuth = result.isAuth;
        isAdmin = result.isAdmin;
        resourcesAllowed = result.resourcesAllowed;
        currentUsername = result.username;
        enterpriseApplicationData = result.enterpriseApplicationData;
        _updateLoginHandler();
        if(isAuth === true){
            Y.fire('elstr_user:afterAuth');
        }
    },
    _onSuccessfulLogout = function() {
        isAuth = false;
        isAdmin = false;
        currentUsername = "anonymous";
        _updateLoginHandler();
        if(isAuth === false){
            Y.fire('elstr_user:afterLogout');
        }
        if (forceAuthentication === true && isAuth === false) {
            Y.use('elstr_auth', function (Y) {
                Y.ELSTR.auth.login();
            });
        }        
    };

    Y.namespace('ELSTR');
    Y.ELSTR.user = {
        // public properties or functions
        
        /**
         * Initialisiert das Userobject
         * 
         * @method init
         * @param {Boolean} authRequired true, if for the app authentication is required
         * @return {Boolean} True, if the values were valid
         */
        init : function(authRequired){
            
            // Hide the #dialogLogin if it exists
            // The dialog is rendered later in the elstr_auth module
            var nodeLoginDialog = Y.one("#loginDialog");
            if(nodeLoginDialog){
                nodeLoginDialog.setStyle("display","none");
            }
            
            // Init the user object
            if (Y.Lang.isObject(ELSTR.applicationData.user)) {
                currentUsername = ELSTR.applicationData.user.username;
                isAuth = ELSTR.applicationData.user.isAuth;
                isAdmin = ELSTR.applicationData.user.isAdmin;
                resourcesAllowed = ELSTR.applicationData.user.resourcesAllowed;
                enterpriseApplicationData = ELSTR.applicationData.user.enterpriseApplicationData;		
                ELSTR.applicationData.user = "empty after reading it to the user module";
            } else {
                // Elstr application ist not loaded correctly
                currentUsername = "anonymous";
                isAuth = false;
                isAdmin = false;
            }
            
            // Render the login handler after basic initialisation
            _renderLoginHandler();
            _updateLoginHandler();
            
            if (authRequired && authRequired === true) {
                forceAuthentication = true;
            //TODO: It is not allowed to abort the login dialog
            }
            
            Y.on('elstr_auth:successfulLogout', _onSuccessfulLogout);  
            Y.on('elstr_auth:successfulAuth', _onSuccessfulAuth);  
            if (forceAuthentication === true && isAuth === false) {
                Y.use('elstr_auth', function (Y) {
                    Y.ELSTR.auth.login();
                });
            }

            // Fire the events
            Y.fire('elstr_user:afterInit');
            if(isAuth === true){
                Y.fire('elstr_user:afterAuth');
            }
        },
        /**
	 * Returns the current authentification status
	 * 
	 * @method isAuth
	 * @return {Boolean} The authentification status
	 */
        isAuth : function() {
            return isAuth;
        },
        /**
	 * Returns if the user is an admin user
	 * 
	 * @method isAdmin
	 * @return {Boolean} The admin status
	 */
        isAdmin : function() {
            return isAdmin;
        },
        /**
	 * Returns if the user must login to use the application or not
	 * 
	 * @method forceAuthentication
	 * @return {Boolean} The force authentication status
	 */
        forceAuthentication : function() {
            return forceAuthentication;
        },
        /**
	 * Return the current username
	 *
	 */
        getCurrentUsername : function(){
            return currentUsername;
        },
        /**
	 * Returns if the user has allowed access to a resource
	 * 
	 * @param {string/array}
	 *            resource name of a resource
	 * @method resourceAllowed
	 * @return {Boolean} If the resource is allowed
	 */
        resourceAllowed : function(resource) {
            var isAllowed = true;
            var objectLiteralOfResourcesAllowed = {};
            for ( var i = 0; i < resourcesAllowed.length; i++) {
                objectLiteralOfResourcesAllowed[resourcesAllowed[i]] = '';
            }
            if (Y.Lang.isArray(resource)) {
                for ( var i = 0, len = resource.length; i < len; i++) {
                    if (!(resource[i] in objectLiteralOfResourcesAllowed)) {
                        isAllowed = false;
                    }
                }
            } else {
                if (!(resource in objectLiteralOfResourcesAllowed)) {
                    isAllowed = false;
                }
            }
            return isAllowed;
        },
        /**
	 * Interface for reading enterprise application data
	 * 
	 * @param {string} enterpriseApplication
	 * @param {string} key
	 * @method getEnterpriseApplicationData
	 * @return 
	 */
        getEnterpriseApplicationData : function(enterpriseApplication, key) {
            if (Y.Lang.isObject(enterpriseApplicationData[enterpriseApplication])){
                var oEnterpriseApplication = enterpriseApplicationData[enterpriseApplication];
                if (!YAHOO.lang.isUndefined(oEnterpriseApplication[key])){
                    return oEnterpriseApplication[key];
                }
                else {
                    return null;
                }
            } else {
                return null;
            }
        },
        /**
	 * Shows a modal access denied Panel
	 * 
	 */
        showAccessDenied : function(additionalText){
        //TODO: Not implemented
        }
    }
 
}, '2.0' /* module version */, {
    requires: ['base','node']
});