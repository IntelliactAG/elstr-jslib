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
ELSTR.Admin = function() {

	// ///////////////////////////////////////////////////////////////
	// Declare all class variables
	


	// Member Variabless
	var that = this;

	// ////////////////////////////////////////////////////////////
	// Event Declarations


	// ////////////////////////////////////////////////////////////
	// Public functions

	/**
	 * Initialisiert das Admin Objekt
	 * 
	 * @method init
	 * @return {Boolean} True, if the values were valid
	 */
	this.openConsole = function() {

		alert("ok");

	}

	

}
