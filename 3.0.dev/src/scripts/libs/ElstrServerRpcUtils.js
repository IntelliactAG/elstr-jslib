var mcFly = require('../libs/mcFly.js');

var EventEmitter = require('events').EventEmitter;

// var RealTimeActions = require('../../../compare/src/scripts/actions/RealTimeActions');

var ElstrLog = require('../ElstrLog');

/**
 * Helper class lib definition.
 * @constructor
 */
function ElstrServerRpcUtils (){}

ElstrServerRpcUtils.validateMessages = function(data) {

    var error = null;

    /* We check for errors first */
    if (data === null) {

        error = " Null data received";

    } else if (data.messages && data.messages.length > 0) {

        var errorMessages = data.messages;

        if (errorMessages[0].type){
            error = (errorMessages[0].type.toUpperCase()) + ": [" + errorMessages[0].code + "] " + errorMessages[0].message;
        }else{
            error = (errorMessages[0]);
        }

        /* We check for the base object info */
    }

    return error;

};


module.exports = ElstrServerRpcUtils;