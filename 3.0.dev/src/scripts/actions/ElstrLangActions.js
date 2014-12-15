/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 12.12.2014.
 */

var mcFly = require('../libs/mcFly.js');
var ElstrLangConstants = require('../constants/ElstrLangConstants');

/**
 * This is the class for actions in Elstr lang
 
 * @class ElstrLangActions
 */
var ElstrLangActions = mcFly.createActions({
    willLoad: function() {

        return {
            actionType: ElstrLangConstants.ELSTR_LANG_WILL_LOAD
        };
    },
    didLoad: function(lang, translations) {
        return {
            actionType: ElstrLangConstants.ELSTR_LANG_DID_LOAD,
            lang: lang,
            translations: translations
        };
    }
});

module.exports = ElstrLangActions;