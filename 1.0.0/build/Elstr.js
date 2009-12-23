/*******************************************************************************
 * This is the main Object of ELSTR Framework Here all
 * 
 * ToDo: Initially I inteded to use YUI 3.0 initialization style here, but for
 * now I'll keep it simple.
 */

// Build Namespaces
if (ELSTR == undefined) {
	var ELSTR = new Object();
};

ELSTR = {
	widget : new Object(),
	/**
	 * Load application Data from the server
	 * 
	 * @method loadAppData
	 * @param {string}
	 *            appName Name of the Application
	 * @param {function}
	 *            fn Callback function
	 * @return {object} Object, where the appData ist loaded to
	 */
	loadAppData : function(appName, fn) {
		var oDataSource = new YAHOO.util.XHRDataSource(
				"services/ELSTR_ApplicationDataServer");
		oDataSource.connMethodPost = true;
		oDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
		oDataSource.responseSchema = {
			resultsList : "result"
		};

		var oCallback = {
			// if our XHR call is successful, we want to make use
			// of the returned data and create child nodes.
			success : function(oRequest, oParsedResponse, oPayload) {

				ELSTR.applicationData = oParsedResponse.results[0];

				if (YAHOO.lang.isFunction(fn) == true) {
					fn();
				}

			},
			failure : function(oRequest, oParsedResponse, oPayload) {
				alert("Request failed!");

			},
			scope : {},
			argument : {}
		};

		var oRequestPost = {
			"jsonrpc" : "2.0",
			"method" : "load",
			"params" : {
				appName : appName
			},
			"id" : ELSTR.Utils.uuid()
		};

		oDataSource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),
				oCallback);
	}
}
