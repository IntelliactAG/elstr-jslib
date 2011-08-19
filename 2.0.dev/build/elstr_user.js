/**
 * User handling for Elstr applications
 * 
 * MARKUP example
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
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2011
 */

YUI.add('elstr_user', function (Y) {
    Y.namespace('ELSTR').User = Y.Base.create('elstr_user', Y.Widget, [], {
                
        //
        // WIDGET FUNCTIONS
        //

        initializer: function () {
            // Init the user object from DOM
            if (Y.Lang.isObject(ELSTR.applicationData.user)) {
                this._set("username",ELSTR.applicationData.user.username);
                this._set("isAuth",ELSTR.applicationData.user.isAuth);
                this._set("isAdmin",ELSTR.applicationData.user.isAdmin);
                this._set("resourcesAllowed",ELSTR.applicationData.user.resourcesAllowed);
                this._set("enterpriseApplicationData",ELSTR.applicationData.user.enterpriseApplicationData);		
                ELSTR.applicationData.user = "empty after reading it to the user widget";
            } 
              
            // TODO: implement correct auth handling
            Y.on('elstr_auth:successfulLogout', this._onSuccessfulLogout);  
            Y.on('elstr_auth:successfulAuth', this._onSuccessfulAuth); 
            if (this.get("forceAuthentication") === true && this.get("isAuth") === false) {
                this._login();
            }
        },

        destructor: function () {
            // Remove all click listeners
            this.get('contentBox').purge(true);
        },

        renderUI: function () {            
        // Always loaded from markup
        // E.g. srcNode:"#loginHandler"
        },

        bindUI: function () {
            var contentBox = this.get('contentBox');
            contentBox.one(".login").on("click", function(e) {
                this._login();
            },this);
            contentBox.one(".logout").on("click", function(e) {
                this._logout();
            },this);  
            contentBox.one(".admin").on("click", function(e) {
                Y.use('elstr_admin', function (Y) {
                    Y.ELSTR.Admin.openAdminConsole();
                });
            }); 
        },

        syncUI: function () {
            this._updateLoginHandler();
        },
    
        //
        // PUBLIC FUNCTIONS
        //


        /**
         * Returns if the user has allowed access to a resource
         * 
         * @param {string/array}
         *            resource name of a resource
         * @method resourceAllowed
         * @return {Boolean} If the resource is allowed
         */
        resourceAllowed : function(resource) {
            var isAllowed = true,
            resourcesAllowed = this.get("resourcesAllowed");
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
            var enterpriseApplicationData = this.get("enterpriseApplicationData");
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
        },
    
        //
        // PRRIVATE VARIABLES
        //

        _auth : null,

        //
        // PRRIVATE FUNCTIONS
        //

        _updateLoginHandler : function() {
            // Update the handler only if it exists
            var contentBox = this.get('contentBox');
            
            if(this.get("isAuth") === true){
                contentBox.one(".login").setStyle("display","none");
                contentBox.one(".user").empty().append(this.get("username")).setStyle("display","");
                contentBox.one(".logout").setStyle("display","");
            } else {
                contentBox.one(".login").setStyle("display","");
                contentBox.one(".user").empty().setStyle("display","none");
                contentBox.one(".logout").setStyle("display","none");                
            }
   
            if(this.get("isAdmin") === true){
                contentBox.one(".admin").setStyle("display","");
            } else {
                contentBox.one(".admin").setStyle("display","none");
            }
        },
        _onSuccessfulAuth : function(result) {
            this._set("isAuth",result.isAuth);
            this._set("isAdmin",result.isAdmin);
            this._set("username",result.username);            
            this._set("resourcesAllowed",result.resourcesAllowed);
            this._set("enterpriseApplicationData",result.enterpriseApplicationData);
            this.syncUI();
        },
        _onSuccessfulLogout : function() {
            this._set("isAuth",false);
            this._set("isAdmin",false);
            this._set("username","anonymous");             
            this.syncUI();
            if (this.get("forceAuthentication") === true) {
                this._login();
            }        
        },
        _createAuthWidget : function(){
            var that = this;
            Y.use('elstr_auth', function (Y) {
                that._auth = new Y.ELSTR.Auth({
                    srcNode:"#loginDialog",
                    visible:false,
                    centered:true,
                    modal: true,
                    width:"20em",
                    buttons: [],
                    forceAuthentication:that.get("forceAuthentication"),
                    after: {
                        successfulAuth : function(result){
                            that._onSuccessfulAuth(result);
                        },
                        successfulLogout : function(){
                            that._onSuccessfulLogout();
                        }
                    }
                });
                that._auth.render();
                that.fire("_authCreated");
            });            
        },
        _login : function(){            
            if(Y.Lang.isNull(this._auth) === true){               
                this._createAuthWidget();
                this.after("_authCreated",this._login);
            } else {
                this._auth.login();
            }
        },
        _logout : function(){            
            if(Y.Lang.isNull(this._auth) === true){
                this._createAuthWidget();
                this.after("_authCreated",this._logout);                
            } else {
                this._auth.logout();
            }            
        }
        
    }, {
        ATTRS: {
            forceAuthentication: {
                value: false,
                validator: Y.Lang.isBoolean,
                writeOnce: "initOnly"
            },
            username: {
                value: "anonymous",
                validator: Y.Lang.isString,
                readOnly: true
            },
            isAuth: {
                value: false,
                validator: Y.Lang.isBoolean,
                readOnly: false
            },
            isAdmin: {
                value: false,
                validator: Y.Lang.isBoolean,
                readOnly: true
            },  
            resourcesAllowed: {
                value: [],
                validator: Y.Lang.isArray,
                readOnly: true                    
            },
            enterpriseApplicationData: {
                readOnly: true                    
            }             
        }
    })

}, '2.0', {
    requires: ['base','widget','node','elstr_utils'],
    skinnable: false
});