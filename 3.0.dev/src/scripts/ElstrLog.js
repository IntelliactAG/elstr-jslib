/**
 * Created by sahun on 02.12.2014.
 */

/*
var ElstrIo = require("./ElstrIo");
console.log(ElstrIo);
var elstrIo = new ElstrIo({
  abortStaleRequests: false
});
*/

/**
 * This is the class for IO used in Elstr projects
 *
 * options attributes:
 *     enabled: if the log is enabled
 *     serverLevel; error/ERR = 3, warn/WARN = 4, log/NOTICE = 5, info/INFO = 6, debug/DEBUG = 7
 *
 * @class ElstrIo
 * @param {Object} [options]  The options object
 */
function ElstrLog(options) {
    this.options = {};
    if (options) {
        this.options = options;
    }
}

ElstrLog.prototype = {

    /* Displays a message in the console. You pass one or more objects to this method, each of which are evaluated and concatenated into a space-delimited string. The first parameter you pass to log() may contain format specifiers, a string token composed of the percent sign (%) followed by a letter that indicates the formatting to be applied. */
    log: function() {
        if (console && this.options.enabled) {
            console.log.apply(console, arguments);
            if (this.options.serverLevel && this.options.serverLevel < 6) {
                var params = {
                    level: "log",
                    arguments: arguments
                };
                var req = elstrIo.requestJsonRpc("ELSTR_LogServer", "write", params, {
                    onSuccess: function(req, res) {},
                    onError: function(req, error) {}
                });
            }
        }
    },

    /* This method is identical to console.log().
     * Chrome add an "info" icon to it.
     * */
    info: function() {
        if (console && this.options.enabled) {
            console.info.apply(console, arguments);
        }
    },
    debug: function() {
        if (console && this.options.enabled) {
            console.debug.apply(console, arguments);
        }
    },
    warn: function() {
        if (console && this.options.enabled) {
            console.error.apply(console, arguments);
        }
    },
    error: function() {
        if (console && this.options.enabled) {
            console.error.apply(console, arguments);
        }
    },

    // Writes the the number of times that count() has been invoked at the same line and with the same label.
    count: function(label) {
        if (console && this.options.enabled) {
            console.count.apply(console, label);
        }
    },

    trace: function() {
        if (this.options.enabled) {
            // arguments properties
            this.info("ELSTR Trace: ", arguments.callee.caller.name, arguments.callee.caller.arguments);

        }
    }

};


module.exports = ElstrLog;