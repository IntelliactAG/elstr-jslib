var ElstrLog = require('../ElstrLog');

/**
 * Helper class lib definition.
 * @constructor
 */
function ElstrServerRpcUtils (){}


ElstrServerRpcUtils.parseError = function(messages) { // this function is for backward compatibility
    return ElstrServerRpcUtils.parseErrors(messages);
};

ElstrServerRpcUtils.parseTrace = function(trace) {

    var result = "";
    if (trace && trace.length>0){
        result = " - " + trace[0].class + "::" + trace[0].function;
    }

    return result;
}

ElstrServerRpcUtils.parseErrors = function(messages) {

    var errorTxt = "";

    if (messages && messages.length > 0) {
        for (var i=0;i<messages.length;i++) {
            var message = messages[i];

            if (message.type) {
                if (message.type=="error") { // only messages of type error are treated as error
                    var text = message.text;
                    if (!text) { text = message.message; }
                    var additionalMessage = (message.type.toUpperCase()) + ": [" + message.code + "] " +text;
                    if (errorTxt!=="") { errorTxt = errorTxt + ", " + additionalMessage; }
                    else               { errorTxt =  additionalMessage; }
                }
            } else {  // messages without type error are treated as error
                if (errorTxt!=="") { errorTxt = errorTxt + ", " + message; }
                else               { errorTxt =  message; }
            }

            if (message.trace){
                errorTxt += ElstrServerRpcUtils.parseTrace(message.trace);
            }

        }
    } else if (messages && typeof(messages.message) !== "undefined") { // ElstrException //
        errorTxt = (messages.message);

        if (messages.trace){
            errorTxt += ElstrServerRpcUtils.parseTrace(messages.trace);
        }

    } else if (messages && !Array.isArray(messages)) {
        errorTxt = (messages);
    }

    return errorTxt;

};

ElstrServerRpcUtils.validateMessages = function(data) {

    var error = null;

    /* We check for errors first */
    if (data === null) {

        error = " Null data received";

    } else if (data.result && data.result.messages && data.result.messages.length > 0) {

        error = ElstrServerRpcUtils.parseErrors(data.result.messages);

        /* We check for the base object info */
    } else if (data.messages && data.messages.length > 0) {

        error = ElstrServerRpcUtils.parseErrors(data.messages);

        /* We check for the base object info */
    }

    return error;

};


module.exports = ElstrServerRpcUtils;