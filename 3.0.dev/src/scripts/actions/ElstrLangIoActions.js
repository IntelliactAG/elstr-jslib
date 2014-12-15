/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 12.12.2014.
 */

var ElstrConfigStore = require("../stores/ElstrConfigStore");

var ElstrLog = require("../ElstrLog");

var ElstrIo = require('../ElstrIo');
var elstrIo = new ElstrIo({
    abortStaleRequests: true
});

var ElstrLangActions = require('./ElstrLangActions.js');

/**
 * This is the class for IO actions in Elstr lang

 * @class ElstrLangIoActions
 */
var ElstrLangIoActions = {

    /**
     * Load a new language
     *
     * @method change
     * @param {String} [lang] lang string of the new language to be loaded (e.g. "de" or "en")
     */
    change: function(lang) {
        ElstrLangActions.willLoad();

        var params = {
            file: "",
            lang: lang
        };

        var req = elstrIo.requestJsonRpc("ELSTR_LanguageServer", "load", params, {
            onSuccess: function(req, res) {
                ElstrLangActions.didLoad(lang, res.body.result);
            },
            onError: function(req, error) {
                ElstrLog.error(error);
            }
        });

    }

};

module.exports = ElstrLangIoActions;