/**
 * Created by sahun on 02.12.2014.
 */

var ElstrLog = require("./ElstrLog");
 ElstrLog = new ElstrLog(true);

var ElstrId = require("./ElstrId");
ElstrId = new ElstrId();

var jQuery;
var _currentRequests = [];

function ElstrRpc(requestURLs, jQueryLib){

    jQuery = jQueryLib;

    this.requestURLs = '/elstrCustomerResearch/public/services/';
    if (requestURLs) this.requestURLs = requestURLs;
    
}

ElstrRpc.prototype = {

    /** Aborts the specific request defined by
     * className & methodName
    **/
    abort : function(className, methodName){

        if (_currentRequests[className] &&
            _currentRequests[className][methodName]){

            _currentRequests[className][methodName].abort();
            ElstrLog.log("Request Aborted ",className, methodName);
        }

    },

    /**
     * Aborts all the requests
     */
    abortAll : function(){

        for (var i = 0; i < _currentRequests.length; i++){
            for (var j = 0; j < _currentRequests[i].length; j++){
                _currentRequests[i][j].abort();
            }
        }

    },

    /**
     * Call an Elstr
     */
    rpc : function(className, methodName, params, onSuccess, onError){

        var oRequestPost = {
            "jsonrpc": "2.0",
            "method": methodName,
            "params": params,
            "id": ElstrId.create()
        };

        var url = this.requestURLs+className;


        if (!_currentRequests[className])
            _currentRequests[className] = [];

        _currentRequests[className][methodName] =
            jQuery.post(url, JSON.stringify(oRequestPost), function(data) {

                var error = "Unknown error";
                if (data && data.result){

                        if (onSuccess) onSuccess(data.result);

                }else{
                    if (onError) onError(error);
                }

                ElstrLog.log(data);

            }).done(function() {
                ElstrLog.info("Request Completed ",className, methodName);
            }).fail(function() {
                ElstrLog.error("Request Failed ",className, methodName);
            }).always(function() {
                ElstrLog.info("Request Finished ",className, methodName);
                delete _currentRequests[className][methodName];
            });


    }

};



module.exports = ElstrRpc;
