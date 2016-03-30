var ElstrLog = require('../ElstrLog');

/**
 * Helper class lib definition.
 * @constructor
 */
function ElstrServerRpcUtils (){}


ElstrServerRpcUtils.parseErrors = function(messages) {

    var errorTxt = "";

    if (messages && messages.length > 0) {
        for (var i=0;i<messages.length;i++) {
            var message = messages[i];

            if (message.type) {
                if (message.type=="error") { // only messages of type error are treated as error
                    var text = error.text;
                    if (!text) { text = error.message; }
                    var additionalMessage = (message.type.toUpperCase()) + ": [" + message.code + "] " +text;
                    if (errorTxt!=="") { errorTxt = errorTxt + ", " + additionalMessage; }
                    else               { errorTxt =  additionalMessage; }
                }
            } else {  // messages without type error are treated as error
                if (errorTxt!=="") { errorTxt = errorTxt + ", " + message; }
                else               { errorTxt =  message; }
            }
        }
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