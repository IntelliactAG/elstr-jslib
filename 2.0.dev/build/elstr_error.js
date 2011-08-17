/**
 * @author egli@intelliact.ch
 */

YUI.add('elstr_error', function(Y) {
 
    // No private properties or functions
   
    Y.namespace('ELSTR').Error = {
        // public properties or functions
        requestFailure : function (oRequest, oResponse, oPayload, oDataSource, oCallback){
            var status = oResponse.status;
            var responseText =  oResponse.responseText;
            //console.log(oResponse);
			
            try {
                var parsedResponse = Y.JSON.parse(responseText);
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
        unhandledException : function(e){
            Y.ELSTR.Utils.log(e,"error");
            Y.ELSTR.Utils.log("Unhandled Exception","info");            
        }
    }
 
}, '2.0' /* module version */, {
    requires: ['json-parse','elstr_utils']
});