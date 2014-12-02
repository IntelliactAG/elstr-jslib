/**
 * Created by sahun on 02.12.2014.
 */

var jQuery = require("jquery");
var ElstrLog = require("../lib/ElstrLog");

function ElstrIo(){};


ElstrIo.currentRequest = [];

/** Aborts the specific request defined by
 * className & methodName
**/
ElstrIo.abort = function(className, methodName){

    if (ElstrIo.currentRequest[className] &&
        ElstrIo.currentRequest[className][methodName]){

        ElstrIo.currentRequest[className][methodName].abort();
        ElstrLog.log("Request Aborted ",className, methodName);
    }

}

/**
 * Aborts all the requests
 */
ElstrIo.abortAll = function(){

    for (var i = 0; i < ElstrIo.currentRequest.length; i++){
        for (var j = 0; j < ElstrIo.currentRequest[i].length; j++){
            ElstrIo.currentRequest[i][j].abort();
        }
    }

}

/**
 * Call an Elstr
 */
ElstrIo.rpc = function(className, methodName, params, onSuccess, onError){

    var oRequestPost = {
        "jsonrpc": "2.0",
        "method": methodName,
        "params": params,
        "id": "993D5698-A3DE-411D-9E49-E008838DC00D"
    };

    var url = '/elstrCustomerResearch/public/services/'+className;


    if (!ElstrIo.currentRequest[className])
        ElstrIo.currentRequest[className] = [];

    ElstrIo.currentRequest[className][methodName] =
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

module.exports = ElstrIo;
