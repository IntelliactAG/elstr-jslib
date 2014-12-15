/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by sahun@intelliact on 02.12.2014.
 */

var request = require('./libs/superagent/superagent.js');

// Privat data
var _options = {
    enabled: true,
    serverLevel: 0
};

// Privat methods
var _logToServer = function(level, args) {
    var oRequestPost = {
        "jsonrpc": "2.0",
        "method": "write",
        "params": {
            level: level,
            arguments: args
        },
        "id": "0"
    };
    request.post('services/ELSTR_LogServer')
        .send(oRequestPost)
        .type('json')
        .end(function(error, res) {});
};

/**
 * This is the class for IO used in Elstr projects
 *
 * options attributes:
 *     enabled: if the log is enabled in the browser
 *     serverLevel; error/ERR = 3, warn/WARN = 4, log/NOTICE = 5, info/INFO = 6, debug/DEBUG = 7
 *
 * @class ElstrIo
 */
var ElstrLog = {

    init: function(options) {
        if (options.enabled === true) {
            _options.enabled = true;
        } else if (options.enabled === false || options.enabled === "") {
            _options.enabled = false;            
        }
        if (options.serverLevel) {
            _options.serverLevel = options.serverLevel;
        }
    },
    /* Displays a message in the console. You pass one or more objects to this method, each of which are evaluated and concatenated into a space-delimited string. The first parameter you pass to log() may contain format specifiers, a string token composed of the percent sign (%) followed by a letter that indicates the formatting to be applied. */
    log: function() {
        if (console && _options.enabled) {
            console.log.apply(console, arguments);
        }
        if (_options.serverLevel && _options.serverLevel >= 5) {
            _logToServer("log", arguments);
        }
    },
    /* This method is identical to console.log().
     * Chrome add an "info" icon to it.
     * */
    info: function() {
        if (console && _options.enabled) {
            console.info.apply(console, arguments);
        }
        if (_options.serverLevel && _options.serverLevel >= 6) {
            _logToServer("info", arguments);
        }
    },
    debug: function() {
        if (console && _options.enabled) {
            console.debug.apply(console, arguments);
        }
        if (_options.serverLevel && _options.serverLevel >= 7) {
            _logToServer("debug", arguments);
        }
    },
    warn: function() {
        if (console && _options.enabled) {
            console.error.apply(console, arguments);
        }
        if (_options.serverLevel && _options.serverLevel >= 4) {
            _logToServer("warn", arguments);
        }
    },
    error: function() {
        if (console && _options.enabled) {
            console.error.apply(console, arguments);
        }
        if (_options.serverLevel && _options.serverLevel >= 3) {
            _logToServer("error", arguments);
        }
    },

    // Writes the the number of times that count() has been invoked at the same line and with the same label.
    count: function(label) {
        if (console && _options.enabled) {
            console.count.apply(console, label);
        }
    },

    trace: function() {
        if (_options.enabled) {
            // arguments properties
            this.info("ELSTR Trace: ", arguments.callee.caller.name, arguments.callee.caller.arguments);

        }
    }

};

module.exports = ElstrLog;