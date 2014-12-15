/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 14.12.2014.
 */

var ElstrConfigStore = require("../stores/ElstrConfigStore");

var ElstrLog = require("../ElstrLog");

var ElstrIo = require('../ElstrIo');
var elstrIo = new ElstrIo({
    abortStaleRequests: true
});

var ElstrUserActions = require('./ElstrUserActions.js');

/**
 * This is the class for IO actions in Elstr lang
 
 * @class ElstrUserIoActions
 */
var ElstrUserIoActions = {

    /**
     * Login as a user
     *
     * @method login
     * @param {String} username
     * @param {String} password
     * @param {String} enterpriseApplication
     */
    login: function(username, password, enterpriseApplication) {
        ElstrLangActions.willLoad();

        var params = {
            username: username,
            password: password,
            enterpriseApplication: enterpriseApplication
        };

        var req = elstrIo.requestJsonRpc("ELSTR_LanguageServer", "auth", params, {
            onSuccess: function(req, res) {
                var result = res.body.result;
                var responseAction = result.action;
                var responseMessage = result.message;
                if (responseAction == "success") {
                    ElstrUserActions.didLogin(result.enterpriseApplicationData, result.isAdmin, result.isAuth, result.resourcesAllowed, result.username);
                } else {
                    ElstrLog.log(responseMessage);
                    // TODO: How to handle this?
                }

            },
            onError: function(req, error) {
                ElstrLog.error(error);
            }
        });
    },

    /**
     * Logout
     *
     * @method logout
     */
    logout: function() {
        ElstrLangActions.willLogout();

        var params = {};

        var req = elstrIo.requestJsonRpc("ELSTR_LanguageServer", "logout", params, {
            onSuccess: function(req, res) {
                var result = res.body.result;
                var responseAction = result.action;
                var responseMessage = result.message;
                if (responseAction == "success") {
                    ElstrUserActions.didLogout(result.username);
                } else {
                    ElstrLog.log(responseMessage);
                    // TODO: How to handle this?
                }

            },
            onError: function(req, error) {
                ElstrLog.error(error);
            }
        });

    }



};

module.exports = ElstrUserIoActions;