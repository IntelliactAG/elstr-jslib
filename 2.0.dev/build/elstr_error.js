/**
 * Module for consistent error handling throught Elstr applications
 *
 * @module elstr_error
 * @namespace ELSTR
 * @requires json-parse,elstr_utils
 * @author egli@intelliact.ch
 */

YUI.add('elstr_error', function(Y) {
 
    /**
     * Static class prividing generic error and request failure handlers
     *
     * @class Error
     * @static
     * @namespace ELSTR
     */
   
    Y.namespace('ELSTR').Error = {
        /**
         * Handler for genereal request failures. In case of a a 401 error, try a login
         * and repeate the request.
         *
         * @method requestFailure
         * @static
         * @param {Object} oRequest
         * @param {Object} oResponse
         * @param {Object} oPayload
         * @param {Object} oDataSource
         * @param {Function} oCallback
         */
        requestFailure : function (oRequest, oResponse, oPayload, oDataSource, oCallback){
            var status = oResponse.status;
            var responseText =  oResponse.responseText;
            var parsedResponse;
            //console.log(oResponse);
			
            try {
                parsedResponse = Y.JSON.parse(responseText);
            }
            catch (e) {
                Y.ELSTR.Utils.log(e,"error");
                Y.ELSTR.Utils.log("Request: " + oRequest,"info");
                Y.ELSTR.Utils.log("Response: " + responseText,"info");
                return;
            }
			 
            switch(status) {
                case 401:
                    var enterpriseApplication = parsedResponse.error.data.context;

                    if (Y.Lang.isUndefined( Y.ELSTR.user.enterpriseApplicationAuthEvent[enterpriseApplication] )){
                        Y.ELSTR.user.login(enterpriseApplication);
                    }
                    Y.ELSTR.user.enterpriseApplicationAuthEvent[enterpriseApplication].subscribe(function(type, args){
                        oDataSource.sendRequest(oRequest, oCallback);
                    });
                    break;
				
                default:
                    Y.ELSTR.Utils.log("Request failed!","error");
                    Y.ELSTR.Utils.log("Status: " + status,"info");
                    Y.ELSTR.Utils.log("Response: " + responseText,"info");
            }
        },

        /**
         * Handler for datasource request failures. In case of a a 401 error, try a login
         * and repeate the request.
         *
         * @method requestFailure
         * @static
         * @param {Object} oError
         * @param {Object} oDataSource
         */
        datasourceCallbackFailure : function (oError,oDataSource){
            var parsedResponse,
            status = oError.data.status,
            statusText = oError.data.statusText,
            responseText =  oError.data.responseText;

            switch(status) {
                case 401:
                    try {
                        parsedResponse = Y.JSON.parse(responseText);
                    }
                    catch (e) {
                        Y.ELSTR.Utils.log("Request to server failed! " + oError.error.message + " | Status: " + status + " " + statusText,"error");
                        Y.ELSTR.Utils.log("Response: " + responseText,"info");
                        return;
                    }
                    
                    var enterpriseApplication = parsedResponse.error.data.context;

                    if (Y.Lang.isUndefined( Y.ELSTR.user.enterpriseApplicationAuthEvent[enterpriseApplication] )){
                        Y.ELSTR.user.login(enterpriseApplication);
                    }
                    Y.ELSTR.user.enterpriseApplicationAuthEvent[enterpriseApplication].subscribe(function(type, args){
                        oDataSource.sendRequest({
                            request:oError.request,
                            callback: oError.callback
                        });
                    });
                    
                    break;
				
                default:
                    Y.log(oError);
                    Y.log("Request to server failed! " + oError.error.message + " | Status: " + status + " " + statusText,"error");
                    Y.log("Response: " + responseText,"info");
            }
        },

        /**
         * Generig error handler which logs the error
         *
         * @method unhandledException
         * @static
         * @param {Object} e
         */
        unhandledException : function(e){
            Y.ELSTR.Utils.log(e,"error");
            Y.ELSTR.Utils.log("Unhandled Exception","info");
        }
    };
 
}, '2.0' /* module version */, {
    requires: ['json-parse','elstr_utils']
});