"use strict";
/**
 * Languaje switch component
 * Allows the user to change the current languaje of the aplication.
 * Available languages can be defined as a property of the component with pairs {key,text}
 * Calls ElstrLangActions to provide a ElstrLangConstants.ELSTR_LANG_DID_LOAD event.
 */

var React = require('react');
var createReactClass = require('create-react-class');

var ElstrLangStore = require('../stores/ElstrLangStore');
var ElstrLangActions = require('../actions/ElstrLangActions');
var ElstrLog = require('../ElstrLog');

var LangSwitch = createReactClass({

    getDefaultProps: function() {
        return {
            currentLanguage: "en",
            availableLanguages: [{
                key: "de",
                text: "DE"
            },{
                key: "en",
                text: "EN"
            }]
        };
    },

    getInitialState: function() {
        return {};
    },
    changeLanguage: function(lang, e) {
        ElstrLangActions.load(lang);
    },
    render: function() {

        var that = this;
        var languageList = this.props.availableLanguages.map(function (lang) {
            var langClass  = "extra-small separation";
            if (that.props.currentLanguage === lang.key)
                langClass += " selected";

            return (
                <li key={lang.key} className={langClass} onClick={that.changeLanguage.bind(that,lang.key)}>
                    {lang.text}
                </li>
            );
        });

        return (
            <div className="langSwitch">
                <ul className="languageSelection user-links menu">
                    {languageList}
                </ul>
            </div>
        );
    }
});
module.exports = LangSwitch;
