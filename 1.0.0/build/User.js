// Create the Namespace for the Framework
if (ELSTR == undefined) {
	var ELSTR = new Object();
};

/**
 * Die User Klasse regelt den Umgang mit dem Benutzer in der Webapp
 * 
 * Beispiel eines Widgets/Markups im HTML. <div class="elstrUser"></div>
 * 
 * Damit diese Komponente verwendet werden kann, muessen folgende Komponenten
 * der YUI geladen sein requires: ["dom","event","datasource","json","dialog"]
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
	// Declare all language variables
	var currentUsername = "anonymous";
	var isAuth = false;
	var datasource;
	var loginDialog;
	var forceAuthentication = false;
	
	var serviceUrl;


	// Member Variabless
	var that = this;

	// ////////////////////////////////////////////////////////////
	// Event Declarations
	that.onAfterInitEvent = new YAHOO.util.CustomEvent("afterInitEvent", this);

	that.onAfterLoadEvent = new YAHOO.util.CustomEvent("afterLoadEvent", this);
	that.onBeforeLoadEvent = new YAHOO.util.CustomEvent("beforeLoadEvent", this);

	that.onAfterChangeEvent = new YAHOO.util.CustomEvent("afterChangeEvent",
			this);
	that.onBeforeChangeEvent = new YAHOO.util.CustomEvent("beforeChangeEvent",
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
	 *            fnInitComplete Callback function that is executed when the
	 *            initialisation ist completed and the language is loaded
	 * @return {Boolean} True, if the values were valid
	 */
	this.init = function(serviceUrl, authRequired, fnInitComplete) {

		_renderLoginDialog();
		
		if(YAHOO.lang.isObject(ELSTR.applicationData.user)){
			currentUser = ELSTR.applicationData.user.username;
			
			if (currentUser != "anonymous"){
				// User is not anonymous
				// An authenticated sesses exists on backend
				isAuth = true;
			}
		}
		
		if(authRequired && authRequired == true){
			forceAuthentication = true;
		}
		
		// Die als selected markierte Sprache laden
		if (YAHOO.lang.isString(serviceUrl)) {
			
			datasource = new YAHOO.util.XHRDataSource(serviceUrl);
			datasource.connMethodPost = true;
			datasource.responseType = YAHOO.util.DataSource.TYPE_JSON;
			datasource.maxCacheEntries = 3;
			datasource.responseSchema = {
				resultsList : "result"
			};

			if (forceAuthentication == true && isAuth == false) {
				// It is not allowed to abort the login dialog				
				var loginDialogButtons = loginDialog.getButtons();
				loginDialogButtons[1].set("disabled", true);
				
				loginDialog.show();							
			}

			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the current authentification status
	 * 
	 * @method isAuth
	 * @return {Booleam} The authentification status
	 */
	this.isAuth = function() {
		return isAuth;
	}

	// ////////////////////////////////////////////////////////////
	// Private functions
	
    var _renderLoginDialog = function(){
		
    	var handleSubmit = function() {
			var username = loginDialog.getData().username;  
			var password = loginDialog.getData().password;  

			console.log(username);
			console.log(password);					
			
			this.hide();
		};
		var handleCancel = function() {
			this.cancel();
		};

		loginDialog = new YAHOO.widget.Dialog("loginDialog", {
			width : "320px",
			postmethod: "none",
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
    }

}
