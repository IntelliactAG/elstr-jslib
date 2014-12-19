/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 12.12.2014.
 */

var mcFly = require('../libs/mcFly.js');
var ElstrUserConstants = require('../constants/ElstrUserConstants');

var ElstrLog = require("../ElstrLog");

var ElstrIo = require('../ElstrIo');
var elstrIo = new ElstrIo({
    abortStaleRequests: true
});

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
    login: function(username, password, enterpriseApplication) {

        // Never log any passwords! ElstrLog.trace("ElstrUserActions.login");
        ElstrUserActions.willLogin();

        var params = {
            username: username,
            password: password,
            enterpriseApplication: enterpriseApplication
        };

        var req = elstrIo.requestJsonRpc("ELSTR_AuthServer", "auth", params, {
            onSuccess: function(req, res) {
                var result = res.body.result;
                var responseAction = result.action;
                var responseMessage = null;
                if (responseAction == "success") {
                    ElstrUserActions.didLogin(result.enterpriseApplicationData, result.isAdmin, result.isAuth, result.resourcesAllowed, result.username, null);
                } else {
                    if (result.message) {
                        ElstrLog.log(result.message);
                        if (typeof result.message === 'string') {
                            responseMessage = result.message;
                        } else {
                            responseMessage = result.message[0];
                        }
                    }
                    ElstrUserActions.didLogin(null, null, null, null, null, responseMessage);
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
    willLogin: function() {
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
    didLogin: function(enterpriseApplicationData, isAdmin, isAuth, resourcesAllowed, username, message) {
        ElstrLog.trace("ElstrUserActions.didLogin");
        return {
            actionType: ElstrUserConstants.ELSTR_USER_DID_LOGIN,
            enterpriseApplicationData: enterpriseApplicationData,
            isAdmin: isAdmin,
            isAuth: isAuth,
            resourcesAllowed: resourcesAllowed,
            username: username,
            message: message
        };
    },


    /*********************************/
    /** LOGOUT LOGOUT LOGOUT LOGOUT **/
    /*********************************/

    /**
     * Logout
     * @method logout
     */
    logout: function() {

        ElstrLog.trace("ElstrUserActions.logout");

        ElstrUserActions.willLogout();

        var params = {};

        var req = elstrIo.requestJsonRpc("ELSTR_AuthServer", "logout", params, {

            onSuccess: function(req, res) {
                var result = res.body.result;

                var responseAction = result.action;
                var responseMessage = null;
                if (responseAction == "success") {
                    ElstrUserActions.didLogout({}, false, false, [], result.username, null);
                } else {
                    if (result.message) {
                        ElstrLog.log(result.message);
                        if (typeof result.message === 'string') {
                            responseMessage = result.message;
                        } else {
                            responseMessage = result.message[0];
                        }
                    }
                    ElstrUserActions.didLogin(null, null, null, null, null, responseMessage);
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
    willLogout: function() {
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
    didLogout: function(enterpriseApplicationData, isAdmin, isAuth, resourcesAllowed, username, message) {
        ElstrLog.trace("ElstrUserActions.didLogout");

        return {
            actionType: ElstrUserConstants.ELSTR_USER_DID_LOGOUT,
            enterpriseApplicationData: enterpriseApplicationData,
            isAdmin: isAdmin,
            isAuth: isAuth,
            resourcesAllowed: resourcesAllowed,
            username: username,
            message: message
        };
    }


});

module.exports = ElstrUserActions;