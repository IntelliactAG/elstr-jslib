/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 11.12.2014.
 */

var mcFly = require('../libs/mcFly.js');

var ElstLangConstants = require('../constants/ElstrLangConstants');

// http://airbnb.github.io/polyglot.js/
var Polyglot = require('node-polyglot');
var _polyglot = new Polyglot();

var ElstrLog = require("../ElstrLog");

/**
 *  Private variables
 */

var _translations = {};
var _currentLanguage = null;
var _defaultLanguage = null;
var _loadedModules = [];

var _dataOptions = {};
var _currentDataLanguage = null;
var _defaultDataLanguage = null;


var _setCurrentDataLanguage = function() {
    _currentDataLanguage = _currentLanguage;
    if (_dataOptions.mapping && _dataOptions.mapping[_currentLanguage]) {
        _currentDataLanguage = _dataOptions.mapping[_currentLanguage];
    }
};


/**
 * This is the class for storing Elstr lang
 * @class ElstrLangStore
 */
var ElstrLangStore = mcFly.createStore({
        init: function() {
            _translations = window.ELSTR.applicationData.language.translations;
            _currentLanguage = window.ELSTR.applicationData.language.current;
            _defaultLanguage = window.ELSTR.applicationData.language.default;
            _loadedModules = [window.ELSTR.applicationData.language.modules];

            _dataOptions = window.ELSTR.applicationData.language.dataOptions;
            if (_dataOptions.default) {
                _defaultDataLanguage = _dataOptions.default;
            }
            _setCurrentDataLanguage();

            // Remove global ELSTR values after configuration
            window.ELSTR.applicationData.language = null;

            _polyglot = new Polyglot();
            _polyglot.extend(_translations);

            ElstrLog.info("ElstrLangStore initialized");
        },
        getLoadedModules: function() {
            return _loadedModules;
        },
        getCurrentLanguage: function() {
            return _currentLanguage;
        },
        getDefaultLanguage: function() {
            return _defaultLanguage;
        },
        /**
         * Alias for the polyglot.t method
         * @param {String} key
         * @param {Object} option
         * @returns {String} in the current language
         */
        text: function(key, options) {
            return _polyglot.t(key, options);
        },

        /**
         * Looks for a translation option out of a given array.
         * 1st the entry with the current language.
         * 2nd (if not) the entry with the default language.
         * 3rd (if not) the first entry if any
         *
         * @param {Object} values. example values : {"de":"Schraube","en","Bolt"}
         * @returns {String} in the current data language
         */
        data: function(values) {
            var text = "";
            if (values){
                if (values[_currentDataLanguage]){
                    text = values[_currentDataLanguage];
                } else if (_defaultDataLanguage !== null && values[_defaultDataLanguage]) {
                    text = values[_defaultDataLanguage];
                } else if (Object.keys(values).length > 0) {
                    text = values[Object.keys(values)[0]];
                } else {
                    ElstrLog.error("ElstrLangStore::data Translation is empty ");
                }
            } else{
                ElstrLog.error("ElstrLangStore::data Translation values is falsy ");
            }
            return text;
        },

        /**
         * Looks for a translation option out of a given array
         * Returns empty if nothing was found.
         *
         * @param {Object} values. example values : {"de":"Schraube","en","Bolt"}
         * @returns {String} in the current data language
         */
        dataStrict: function(values) {
            var text = "";
            if (values && values[_currentDataLanguage]){
                text = values[_currentDataLanguage];
            }
            return text;
        }

    },
    function(payload) {

        if (payload.actionType === ElstLangConstants.ELSTR_LANG_DID_LOAD) {
            _translations = payload.translations;
            _currentLanguage = payload.lang;

            _setCurrentDataLanguage();

            _polyglot.replace(_translations);
            ElstrLangStore.emitChange();
        }

        return true;
    });

module.exports = ElstrLangStore;