var ElstrLog = require('../ElstrLog');

/**
 * Helper class lib definition.
 * @constructor
 */
function ElstrServerRpcUtils (){}

ElstrServerRpcUtils.parseError = function(errorObject) {

    var errorTxt = "";

    if (errorObject.type){
        errorTxt = (errorObject.type.toUpperCase()) + ": [" + errorObject.code + "] " + errorObject.message;
    }else  if (errorObject.message){
        errorTxt = errorObject.message;
    }else{
        errorTxt = (errorObject);
    }

    return errorTxt;

};

ElstrServerRpcUtils.validateMessages = function(data) {

    var error = null;

    /* We check for errors first */
    if (data === null) {

        error = " Null data received";

    } else if (data.result && data.result.messages && data.result.messages.length > 0) {

        error = ElstrServerRpcUtils.parseError(data.result.messages[0]);

        /* We check for the base object info */
    } else if (data.messages && data.messages.length > 0) {

        error = ElstrServerRpcUtils.parseError(data.messages[0]);

        /* We check for the base object info */
    }

    return error;

};


module.exports = ElstrServerRpcUtils;