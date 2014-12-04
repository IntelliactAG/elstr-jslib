/**
 * Created by sahun on 02.12.2014.
 */

var jQuery = require("jquery");
var ElstrLog = require("../lib/ElstrLog");
var ElstrId = require("../lib/ElstrId");

function ElstrRpc(requestURLs){

    this._currentRequests = [];

    this.requestURLs = '/elstrCustomerResearch/public/services/';
    if (requestURLs) this.requestURLs = requestURLs;
    
}

ElstrRpc.prototype = {

    /** Aborts the specific request defined by
     * className & methodName
    **/
    abort : function(className, methodName){

        if (this._currentRequests[className] &&
            this._currentRequests[className][methodName]){

            this._currentRequests[className][methodName].abort();
            ElstrLog.log("Request Aborted ",className, methodName);
        }

    }

    /**
     * Aborts all the requests
     */
    abortAll : function(){

        for (var i = 0; i < this._currentRequests.length; i++){
            for (var j = 0; j < this._currentRequests[i].length; j++){
                this._currentRequests[i][j].abort();
            }
        }

    }

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


        if (!this._currentRequests[className])
            this._currentRequests[className] = [];

        this._currentRequests[className][methodName] =
            jQuery.post(url, JSON.stringify(oRequestPost), function(data) {

                var error = "Unknown error";
                if (data && data.result){

                        if (onSuccess) onSuccess(data.result);

                }else{
                    if (onError) onError(error);
                }

                ElstrLog.log(data);

            }).done(function() {
                ElstrLog.log("Request Completed ",className, methodName);
            }).fail(function() {
                ElstrLog.error("Request Failed ",className, methodName);
            }).always(function() {
                ElstrLog.error("Request Finished ",className, methodName);
                delete this._currentRequests[className][methodName];
            });


    }

};



module.exports = ElstrRpc;
