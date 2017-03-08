"use strict";
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

    /**
     * Login as a user
     *
     * @method login
     * @param {String} username
     * @param {String} password
     * @param {String} enterpriseApplication
     */
    login: function(username, password, enterpriseApplication) {

        // Never log any passwords! ElstrLog.info("ElstrUserActions.login");
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

                if (responseAction === "success") {
                    ElstrUserActions.didLogin(responseAction, result.enterpriseApplicationData, result.isAdmin, result.isAuth, result.resourcesAllowed, result.memberOf, result.username, null);
                } else {
                    if (result.message) {
                        ElstrLog.log(result.message);
                        if (typeof result.message === 'string') {
                            responseMessage = result.message;
                        } else {
                            responseMessage = result.message[0];
                        }
                    }
                    ElstrUserActions.didLogin(responseAction, null, null, null, null, null, null, responseMessage);
                }
            },
            onError: function(req, error) {
                ElstrLog.error(error);
            }
        });

        return {
            actionType: "ElstrUserActions.login"
        };

    },

    /**
     *
     * @returns {{actionType: *}}
     */
    willLogin: function() {
        ElstrLog.info("ElstrUserActions.willLogin");

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
    didLogin: function(responseAction, enterpriseApplicationData, isAdmin, isAuth, resourcesAllowed, memberOf, username, message) {
        ElstrLog.info("ElstrUserActions.didLogin ", message);
        var actionType;
        if(responseAction === "success"){
            actionType = ElstrUserConstants.ELSTR_USER_DID_LOGIN_SUCCESS;
        } else {
            actionType = ElstrUserConstants.ELSTR_USER_DID_LOGIN_FAILED;
        }
        return {
            actionType: actionType,
            enterpriseApplicationData: enterpriseApplicationData,
            isAdmin: isAdmin,
            isAuth: isAuth,
            resourcesAllowed: resourcesAllowed,
            memberOf: memberOf,
            username: username,
            message: message
        };
    },

    /**
     * Logout
     * @method logout
     */
    logout: function() {

        ElstrLog.info("ElstrUserActions.logout");

        ElstrUserActions.willLogout();

        var params = {};

        var req = elstrIo.requestJsonRpc("ELSTR_AuthServer", "logout", params, {

            onSuccess: function(req, res) {
                var result = res.body.result;

                var responseAction = result.action;
                var responseMessage = null;
                if (responseAction == "success") {
                    ElstrUserActions.didLogout({}, false, false, [], [],result.username, null);
                } else {
                    if (result.message) {
                        ElstrLog.log(result.message);
                        if (typeof result.message === 'string') {
                            responseMessage = result.message;
                        } else {
                            responseMessage = result.message[0];
                        }
                    }
                    ElstrUserActions.didLogout(null, null, null, null, null, null, responseMessage);
                }

            },

            onError: function(req, error) {
                ElstrLog.error(error);
            }
        });

        return {
            actionType: "ElstrUserActions.logout"
        };
    },

    /**
     *
     * @returns {{actionType: *}}
     */
    willLogout: function() {
        ElstrLog.info("ElstrUserActions.willLogout");

        return {
            actionType: ElstrUserConstants.ELSTR_USER_WILL_LOGOUT
        };
    },

    /**
     *
     * @param username
     * @returns {{actionType: *, username: *}}
     */
    didLogout: function(enterpriseApplicationData, isAdmin, isAuth, resourcesAllowed, memberOf, username, message) {
        ElstrLog.info("ElstrUserActions.didLogout");

        return {
            actionType: ElstrUserConstants.ELSTR_USER_DID_LOGOUT,
            enterpriseApplicationData: enterpriseApplicationData,
            isAdmin: isAdmin,
            isAuth: isAuth,
            resourcesAllowed: resourcesAllowed,
            memberOf: memberOf,
            username: username,
            message: message
        };
    }


});

module.exports = ElstrUserActions;