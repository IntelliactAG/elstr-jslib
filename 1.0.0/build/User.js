// Create the Namespace for the Framework
if (ELSTR == undefined) {
	var ELSTR = new Object();
};

/**
 * Die User Klasse regelt den Umgang mit dem Benutzer in der Webapp
 * 
 * Example of the widget/markup
 * 
 * Required for Authentication: LoginDialog <div id="loginDialog"> <div
 * class="hd">Login</div> <div class="bd"> <form name="loginDialogForm"
 * method="POST" action="services/ELSTR_AuthServer"> <label
 * for="username">Username</label><input type="text" name="username" /> <label
 * for="password">Password</label><input type="password" name="password" />
 * </form> </div> </div>
 * 
 * Optinal for Authentication: LoginDialog <div id="loginHandler"> <span
 * class="login">Anmelden</span> <span class="logout">Abmelden :</span> <span
 * class="user"></span> </div>
 * 
 * To use this component the following YUI components ar required YUI
 * components: ["dom","event","datasource","json","dialog"]
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2009
 * @namespace ELSTR
 * @class ELSTR.User
 * @alias ElstrUser
 * @classDescription User handling for Elstr applications
 * @constructor
 */
ELSTR.User = function() {

	// ///////////////////////////////////////////////////////////////
	// Declare all class variables
	var currentUsername;
	var isAuth;
	var isAdmin;
	var resourcesAllowed;
	var datasource;
	var loginDialog;
	var accessDeniedDialog;
	var forceAuthentication;
	var callbackFunction;

	// Member Variabless
	var that = this;

	// ////////////////////////////////////////////////////////////
	// Event Declarations
	that.onAfterInitEvent = new YAHOO.util.CustomEvent("afterInitEvent", this);

	that.onAfterAuthEvent = new YAHOO.util.CustomEvent("afterAuthEvent", this);

	that.onAfterLogoutEvent = new YAHOO.util.CustomEvent("afterLogoutEvent",
			this);
	that.onBeforeLogoutEvent = new YAHOO.util.CustomEvent("beforeLogoutEvent",
			this);

	// ////////////////////////////////////////////////////////////
	// Public functions

	/**
	 * Initialisiert das Userobject
	 * 
	 * @method init
	 * @param {String}
	 *            serviceUrl The url to service to load a language
	 * @param {Boolean}
	 *            authRequired True, if for the app authentication is required
	 * @param {Function}
	 *            fnLoginComplete Callback function that is executed when the
	 *            login ist successfully completed and the user is authenticated
	 * @return {Boolean} True, if the values were valid
	 */
	this.init = function(authRequired, fnLoginComplete) {

		_renderLoginDialog();

		if (YAHOO.lang.isObject(ELSTR.applicationData.user)) {
			currentUsername = ELSTR.applicationData.user.username;
			isAuth = ELSTR.applicationData.user.isAuth;
			isAdmin = ELSTR.applicationData.user.isAdmin;
			resourcesAllowed = ELSTR.applicationData.user.resourcesAllowed;
		} else {
			currentUsername = "anonymous";
			isAuth = false;
			isAdmin = false;
		}

		_renderLoginHandler();
		_createDatasource();

		if (authRequired && authRequired == true) {
			forceAuthentication = true;

			// It is not allowed to abort the login dialog
			var loginDialogButtons = loginDialog.getButtons();
			loginDialogButtons[1].set("disabled", true);
		} else {
			forceAuthentication = false;
		}

		if (YAHOO.lang.isFunction(fnLoginComplete)) {
			callbackFunction = fnLoginComplete;
		} else {
			// Create empty callback if none or an invalid one is provided
			callbackFunction = function() {
			};
		}

		if (forceAuthentication == true && isAuth == false) {
			that.login();
		}

		that.onAfterInitEvent.fire();

		if (isAuth) {
			that.onAfterAuthEvent.fire();
			callbackFunction();
		}

		return true;

	}

	this.login = function() {
		loginDialog.show();
	}

	this.logout = function() {
		_logoutRequest();
	}

	this.openAdminConsole = function() {
		if (isAdmin) {
			if (YAHOO.lang.isUndefined(ELSTR.admin)) {
				ELSTR.loader('script',
						'jslib/elstr/' + LIBS.elstrVersion + '/build/Admin.js',
						function() {
							ELSTR.admin = new ELSTR.Admin();
							ELSTR.admin.init();
							ELSTR.admin.openConsole();
						})
			} else {

				ELSTR.admin.openConsole();
			}
		}
	}

	/**
	 * Returns the current authentification status
	 * 
	 * @method isAuth
	 * @return {Boolean} The authentification status
	 */
	this.isAuth = function() {
		return isAuth;
	}

	/**
	 * Returns if the user is an admin user
	 * 
	 * @method isAdmin
	 * @return {Boolean} The admin status
	 */
	this.isAdmin = function() {
		return isAdmin;
	}

	/**
	 * Returns if the user has allowed access to a resource
	 * 
	 * @param {string/array}
	 *            resource name of a resource
	 * @method isAdmin
	 * @return {Boolean} The admin status
	 */
	this.resourceAllowed = function(resource) {
		var isAllowed = true;
		var objectLiteralOfResourcesAllowed = {};
		for ( var i = 0; i < resourcesAllowed.length; i++) {
			objectLiteralOfResourcesAllowed[resourcesAllowed[i]] = '';
		}
		if (YAHOO.lang.isArray(resource)) {
			for ( var i = 0; i < resource.length; i++) {
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
	}
	
	/**
	 * Shows a moda access denied Panel
	 * 
	 */
	this.showAccessDenied = function(additionalText){
		var handleOtherUser = function() {
			this.hide();
			that.login();
		};

		accessDeniedDialog = new YAHOO.widget.SimpleDialog("accessDeniedDialog", {
			visible : true,
			fixedcenter : true,
			draggable : false,
			close : false,
			modal : true,
			icon: YAHOO.widget.SimpleDialog.ICON_BLOCK, 			
			buttons : [ {
				text : "Als anderer Benutzer anmelden",
				handler : handleOtherUser
			} ]
		});
		accessDeniedDialog.setHeader("ERROR");
		accessDeniedDialog.setBody("Kein Zugriff auf diese Applikation");
		accessDeniedDialog.render(document.body);
	
		//accessDeniedDialog.show();
	}

	// ////////////////////////////////////////////////////////////
	// Private functions

	var _createDatasource = function() {
		datasource = new YAHOO.util.XHRDataSource("services/ELSTR_AuthServer");
		datasource.connMethodPost = true;
		datasource.responseType = YAHOO.util.DataSource.TYPE_JSON;
		datasource.responseSchema = {
			resultsList : "result"
		};
	}

	var _renderLoginDialog = function() {

		var handleSubmit = function() {
			var username = loginDialog.getData().username;
			var password = loginDialog.getData().password;

			_authRequest(username, password);
		};
		var handleCancel = function() {
			this.cancel();
		};

		loginDialog = new YAHOO.widget.Dialog("loginDialog", {
			postmethod : "none",
			visible : false,
			fixedcenter : true,
			draggable : false,
			close : false,
			modal : true,
			buttons : [ {
				text : "Submit",
				handler : handleSubmit,
				isDefault : true
			}, {
				text : "Cancel",
				handler : handleCancel
			} ]
		});
		loginDialog.render(document.body);

		// Add listeners to the Panel
		var enterListener = new YAHOO.util.KeyListener("loginDialog", {
			ctrl : false,
			keys : 13
		}, {
			fn : handleSubmit,
			correctScope : true
		});
		enterListener.enable();
	}
	

	var _renderLoginHandler = function() {
		// Render the handler only if it exists
		if (document.getElementById('loginHandler')) {
			var loginHandler = document.getElementById('loginHandler');

			var elLogin = YAHOO.util.Dom.getElementsByClassName('login',
					'span', loginHandler);
			var elLogout = YAHOO.util.Dom.getElementsByClassName('logout',
					'span', loginHandler);
			var elUser = YAHOO.util.Dom.getElementsByClassName('user', 'span',
					loginHandler);
			var elAdmin = YAHOO.util.Dom.getElementsByClassName('admin',
					'span', loginHandler);

			// Add event listerners
			for ( var i = 0; i < elLogin.length; i++) {
				YAHOO.util.Event.addListener(elLogin[i], "click", function() {
					that.login();
				});
			}
			for ( var i = 0; i < elLogout.length; i++) {
				YAHOO.util.Event.addListener(elLogout[i], "click", function() {
					that.logout();
				});
			}
			for ( var i = 0; i < elAdmin.length; i++) {
				YAHOO.util.Event.addListener(elAdmin[i], "click", function() {
					that.openAdminConsole();
				});
			}

		}

		_updateLoginHandler();
	}

	var _updateLoginHandler = function() {
		if (document.getElementById('loginHandler')) {
			var loginHandler = document.getElementById('loginHandler');

			var elLogin = YAHOO.util.Dom.getElementsByClassName('login',
					'span', loginHandler);
			var elLogout = YAHOO.util.Dom.getElementsByClassName('logout',
					'span', loginHandler);
			var elUser = YAHOO.util.Dom.getElementsByClassName('user', 'span',
					loginHandler);
			var elAdmin = YAHOO.util.Dom.getElementsByClassName('admin',
					'span', loginHandler);

			if (isAuth) {
				for ( var i = 0; i < elLogin.length; i++) {
					YAHOO.util.Dom.setStyle(elLogin[i], "display", "none");
				}
				for ( var i = 0; i < elUser.length; i++) {
					YAHOO.util.Dom.setStyle(elUser[i], "display", "");
					elUser[i].innerHTML = currentUsername;
				}
				for ( var i = 0; i < elLogout.length; i++) {
					YAHOO.util.Dom.setStyle(elLogout[i], "display", "");
				}
			} else {
				for ( var i = 0; i < elLogin.length; i++) {
					YAHOO.util.Dom.setStyle(elLogin[i], "display", "");
				}
				for ( var i = 0; i < elUser.length; i++) {
					YAHOO.util.Dom.setStyle(elUser[i], "display", "none");
					elUser[i].innerHTML = "";
				}
				for ( var i = 0; i < elLogout.length; i++) {
					YAHOO.util.Dom.setStyle(elLogout[i], "display", "none");
				}
			}

			if (isAdmin) {
				for ( var i = 0; i < elAdmin.length; i++) {
					YAHOO.util.Dom.setStyle(elAdmin[i], "display", "");
				}
			} else {
				for ( var i = 0; i < elAdmin.length; i++) {
					YAHOO.util.Dom.setStyle(elAdmin[i], "display", "none");
				}
			}
		}
	}

	var _authRequest = function(username, password) {

		var oCallback = {
			// if our XHR call is successful, we want to make use
			// of the returned data and create child nodes.
			success : function(oRequest, oParsedResponse, oPayload) {
				ELSTR.utils.cursorWait.hide();

				var responseAction = oParsedResponse.results[0].action;
				var responseMessages = oParsedResponse.results[0].message;

				if (responseAction == "success") {
					isAuth = oParsedResponse.results[0].isAuth;
					isAdmin = oParsedResponse.results[0].isAdmin;
					resourcesAllowed = oParsedResponse.results[0].resourcesAllowed;
					currentUsername = oParsedResponse.results[0].username;
					loginDialog.hide();
					_updateLoginHandler();
					that.onAfterAuthEvent.fire();
					callbackFunction();
				} else {
					if (forceAuthentication == true && isAuth == false) {
						that.login();
					}
					ELSTR.lang.alert("error", responseMessages[0]);
				}

			},
			failure : function(oRequest, oParsedResponse, oPayload) {
				ELSTR.utils.cursorWait.hide();

				alert("Request failed!");

				if (forceAuthentication == true && isAuth == false) {
					that.login();
				}

			},
			scope : {},
			argument : {}
		};

		var oRequestPost = {
			"jsonrpc" : "2.0",
			"method" : "auth",
			"params" : {
				username : username,
				password : password
			},
			"id" : ELSTR.utils.uuid()
		};

		datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),
				oCallback);

		ELSTR.utils.cursorWait.show();
	}

	var _logoutRequest = function() {
		that.onBeforeLogoutEvent.fire();

		var oCallback = {
			// if our XHR call is successful, we want to make use
			// of the returned data and create child nodes.
			success : function(oRequest, oParsedResponse, oPayload) {
				ELSTR.utils.cursorWait.hide();

				isAuth = false;
				isAdmin = false;
				currentUsername = "anonymous";

				_updateLoginHandler();
				that.onAfterLogoutEvent.fire();

				if (forceAuthentication == true && isAuth == false) {
					that.login();
				}

			},
			failure : function(oRequest, oParsedResponse, oPayload) {
				ELSTR.utils.cursorWait.hide();
				alert("Request failed!");
			},
			scope : {},
			argument : {}
		};

		var oRequestPost = {
			"jsonrpc" : "2.0",
			"method" : "logout",
			"params" : {},
			"id" : ELSTR.utils.uuid()
		};

		datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),
				oCallback);

		ELSTR.utils.cursorWait.show();
	}

}
