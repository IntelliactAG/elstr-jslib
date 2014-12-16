/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 12.12.2014.
 */

var mcFly = require('../libs/mcFly.js');
var ElstrLangConstants = require('../constants/ElstrLangConstants');

var ElstrLog = require("../ElstrLog");

var ElstrIo = require('../ElstrIo');
var elstrIo = new ElstrIo({
    abortStaleRequests: true
});


/**
 * This is the class for actions in Elstr lang
 
 * @class ElstrLangActions
 */
var ElstrLangActions = mcFly.createActions({

    /**
     * Load a new language
     *
     * @method change
     * @param {String} [lang] lang string of the new language to be loaded (e.g. "de" or "en")
     */
    load(lang) {

        ElstrLog.trace("ElstrLangActions.load");

        ElstrLangActions.willLoad();

        var params = {
            file: "",
            lang: lang
        };

        elstrIo.requestJsonRpc("ELSTR_LanguageServer", "load", params, {
            onSuccess: function(req, res) {
                ElstrLangActions.didLoad(lang, res.body.result);
            },
            onError: function(req, error) {
                ElstrLog.error(error);
            }
        });

    },

    /**
     *
     * @returns {{actionType: *}}
     */
    willLoad() {

        ElstrLog.trace("ElstrLangActions.willLoad");

        return {
            actionType: ElstrLangConstants.ELSTR_LANG_WILL_LOAD
        };
    },

    /**
     *
     * @param lang
     * @param translations
     * @returns {{actionType: *, lang: *, translations: *}}
     */
    didLoad(lang, translations) {

        ElstrLog.trace("ElstrLangActions.didLoad");

        return {
            actionType: ElstrLangConstants.ELSTR_LANG_DID_LOAD,
            lang: lang,
            translations: translations
        };
    }
});

module.exports = ElstrLangActions;