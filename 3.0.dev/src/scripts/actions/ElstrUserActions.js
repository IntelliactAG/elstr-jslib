/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 12.12.2014.
 */

var mcFly = require('../libs/mcFly.js');
var ElstrUserConstants = require('../constants/ElstrUserConstants');

var ElstrLog = require("../ElstrLog");

/**
 * This is the class for actions in Elstr lang
 
 * @class ElstrUserActions
 */
var ElstrUserActions = mcFly.createActions({

    /***********************************/
    /** LOGIN LOGIN LOGIN LOGIN LOGIN **/
    /***********************************/

    /**
     * Login as a user
     *
     * @method login
     * @param {String} username
     * @param {String} password
     * @param {String} enterpriseApplication
     */
    login(username, password, enterpriseApplication) {

        ElstrLog.trace("ElstrUserActions.login");

        ElstrUserActions.willLoad();

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
     *
     * @returns {{actionType: *}}
     */
    willLogin() {
        ElstrLog.trace("ElstrUserActions.willLogin");

        return {
            actionType: ElstrUserConstants.ELSTR_USER_WILL_LOGIN
        };
    },

    /**
     *
     * @param enterpriseApplicationData
     * @param isAdmin
     * @param isAuth
     * @param resourcesAllowed
     * @param username
     * @returns {{actionType: *, enterpriseApplicationData: *, isAdmin: *, isAuth: *, resourcesAllowed: *, username: *}}
     */
    didLogin(enterpriseApplicationData, isAdmin, isAuth, resourcesAllowed, username) {
        ElstrLog.trace("ElstrUserActions.didLogin");

        return {
            actionType: ElstrUserConstants.ELSTR_USER_DID_LOGIN,
            enterpriseApplicationData: enterpriseApplicationData,
            isAdmin: isAdmin,
            isAuth: isAuth,
            resourcesAllowed: resourcesAllowed,
            username: username
        };
    },


    /*********************************/
    /** LOGOUT LOGOUT LOGOUT LOGOUT **/
    /*********************************/

    /**
     *
     * @returns {{actionType: *}}
     */
    willLogout() {
        ElstrLog.trace("ElstrUserActions.willLogout");

        return {
            actionType: ElstrUserConstants.ELSTR_USER_WILL_LOGOUT
        };
    },

    /**
     *
     * @param username
     * @returns {{actionType: *, username: *}}
     */
    didLogout(username) {
        ElstrLog.trace("ElstrUserActions.didLogout");

        return {
            actionType: ElstrUserConstants.ELSTR_USER_DID_LOGOUT,
            username: username
        };
    },

    /**
     * Logout
     * @method logout
     */
    logout() {

        ElstrLog.trace("ElstrUserActions.logout");

        ElstrUserActions.willLogout();

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


});

module.exports = ElstrUserActions;