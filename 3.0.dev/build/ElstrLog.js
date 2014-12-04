/**
 * Created by sahun on 02.12.2014.
 */

function ElstrLog(enabled) {

    // constructor
    this._enabled = enabled;

}

ElstrLog.prototype = {

    /* Displays a message in the console. You pass one or more objects to this method, each of which are evaluated and concatenated into a space-delimited string. The first parameter you pass to log() may contain format specifiers, a string token composed of the percent sign (%) followed by a letter that indicates the formatting to be applied. */
    log : function() {
        if (console && this._enabled) {
            console.log.apply(console, arguments);
        }
    },

    /* This method is identical to console.log().
     * Chrome add an "info" icon to it.
     * */
    info : function() {
        if (console && this._enabled) {
            console.info.apply(console, arguments);
        }
    },
    debug : function() {
        if (console && this._enabled) {
            console.debug.apply(console, arguments);
        }
    },
    warn : function() {
        if (console && this._enabled) {
            console.error.apply(console, arguments);
        }
    },
    error : function() {
        if (console && this._enabled) {
            console.error.apply(console, arguments);
        }
    },

    // Writes the the number of times that count() has been invoked at the same line and with the same label.
    count : function(label) {
        if (console && this._enabled) {
            console.count.apply(console, label);
        }
    },

    trace: function(){

        if (this._enabled) {
            
            // arguments properties
            this.info("ELSTR Trace: ",arguments.callee.caller.name, arguments.callee.caller.arguments);

        }
    }




};


module.exports = ElstrLog;