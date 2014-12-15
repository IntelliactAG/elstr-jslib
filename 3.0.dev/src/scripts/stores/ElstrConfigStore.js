/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 11.12.2014.
 */

var mcFly = require('../libs/mcFly.js');
var EventEmitter = require('events').EventEmitter;

var _config = null;

/**
 * This is the class for storing Elstr lang
 
 * @class ElstrLangStore
 */
var ElstrConfigStore = mcFly.createStore({
    init: function() {
        _config = window.ELSTR.applicationData.config;

        // Remove global ELSTR values after configuration
        window.ELSTR.applicationData.config = null;
    },
    option: function() {
        // If called for the first time
        if (_config === null) {
            this.initialize();
        }

        var configSubObject = _config;
        for (var i = 0, len = arguments.length; i < len; i++) {
            configSubObject = configSubObject[arguments[i]];
        }
        return configSubObject;
    }

}, function(payload) {
    return true;
});

module.exports = ElstrConfigStore;