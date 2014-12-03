/**
 * Created by sahun on 02.12.2014.
 */

function ElstrLog() {
    // constructor
    this._enabled = true;
}

ElstrLog.prototype = {

    /* Displays a message in the console. You pass one or more objects to this method, each of which are evaluated and concatenated into a space-delimited string. The first parameter you pass to log() may contain format specifiers, a string token composed of the percent sign (%) followed by a letter that indicates the formatting to be applied. */
    log : function() {
        if (this._enabled) {
            console.log(arguments);
        }
    },

    /* This method is identical to console.log().
     * Chrome add an "info" icon to it.
     * */
    info : function() {
        if (this._enabled) {
            console.info(arguments);
        }
    },
    debug : function() {
        if (this._enabled) {
            console.debug(arguments);
        }
    },
    warn : function() {
        if (this._enabled) {
            console.error(arguments);
        }
    },
    error : function() {
        if (this._enabled) {
            console.error(arguments);
        }
    },

    // Writes the the number of times that count() has been invoked at the same line and with the same label.
    count : function(label) {
        console.count(label);
    }

};


module.exports = ElstrLog;