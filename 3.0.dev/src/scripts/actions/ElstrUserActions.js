/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 12.12.2014.
 */

var mcFly = require('../libs/mcFly.js');
var ElstrUserConstants = require('../constants/ElstrUserConstants');

/**
 * This is the class for actions in Elstr lang
 
 * @class ElstrUserActions
 */
var ElstrUserActions = mcFly.createActions({
    willLogin: function() {
        console.log("ElstrUserActions willLogin");
        return {
            actionType: ElstrUserConstants.ELSTR_USER_WILL_LOGIN
        };
    },
    didLogin: function(enterpriseApplicationData, isAdmin, isAuth, resourcesAllowed, username) {
        console.log("ElstrUserActions didLoad");
        return {
            actionType: ElstrUserConstants.ELSTR_USER_DID_LOGIN,
            enterpriseApplicationData: enterpriseApplicationData,
            isAdmin: isAdmin,
            isAuth: isAuth,
            resourcesAllowed: resourcesAllowed,
            username: username
        };
    },
    willLogout: function() {
        console.log("ElstrUserActions willLogout");
        return {
            actionType: ElstrUserConstants.ELSTR_USER_WILL_LOGOUT
        };
    },
    didLogout: function(username) {
        console.log("ElstrUserActions didLogout");
        return {
            actionType: ElstrUserConstants.ELSTR_USER_DID_LOGOUT,
            username: username
        };
    }
});

module.exports = ElstrUserActions;