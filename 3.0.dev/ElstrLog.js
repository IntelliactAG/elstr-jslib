/**
 * Created by sahun on 02.12.2014.
 */

function ElstrLog(){};

ElstrLog.enabled = true;

/* Displays a message in the console. You pass one or more objects to this method, each of which are evaluated and concatenated into a space-delimited string. The first parameter you pass to log() may contain format specifiers, a string token composed of the percent sign (%) followed by a letter that indicates the formatting to be applied. */
ElstrLog.log = function(){
    if (ElstrLog.enabled){
        console.log(arguments);
    }
}

/* This method is identical to console.log().
* Chrome add an "info" icon to it.
* */
ElstrLog.info = function(){
    if (ElstrLog.enabled) {
        console.info(arguments);
    }
}

ElstrLog.debug = function(){
    if (ElstrLog.enabled) {
        console.debug(arguments);
    }
}

ElstrLog.warn = function(){
    if (ElstrLog.enabled) {
        console.error(arguments);
    }
}

ElstrLog.error = function(){
    if (ElstrLog.enabled) {
        console.error(arguments);
    }
}


// Writes the the number of times that count() has been invoked at the same line and with the same label.
ElstrLog.count = function(label){
    console.count(label);
}

module.exports = ElstrLog;
