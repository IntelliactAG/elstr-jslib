/**
 * Created by sahun on 02.12.2014.
 */

var jQuery = require("jquery");
var ElstrLog = require("../lib/ElstrLog");

function ElstrIo(){
    this._currentRequest = [];
}

ElstrIo.prototype = {

    /** Aborts the specific request defined by
     * className & methodName
    **/
    abort : function(className, methodName){

        if (this._currentRequest[className] &&
            this._currentRequest[className][methodName]){

            this._currentRequest[className][methodName].abort();
            ElstrLog.log("Request Aborted ",className, methodName);
        }

    }

    /**
     * Aborts all the requests
     */
    abortAll : function(){

        for (var i = 0; i < this._currentRequest.length; i++){
            for (var j = 0; j < this._currentRequest[i].length; j++){
                this._currentRequest[i][j].abort();
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
            "id": "993D5698-A3DE-411D-9E49-E008838DC00D"
        };

        var url = '/elstrCustomerResearch/public/services/'+className;


        if (!this._currentRequest[className])
            this._currentRequest[className] = [];

        this._currentRequest[className][methodName] =
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
            });


    }

};



module.exports = ElstrIo;
