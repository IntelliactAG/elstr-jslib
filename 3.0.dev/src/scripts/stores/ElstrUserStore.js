/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 14.12.2014.
 */

var mcFly = require('../libs/mcFly.js');

var EventEmitter = require('events').EventEmitter;
var ElstrUserConstants = require('../constants/ElstrUserConstants');

var ElstrConfigStore = require("../stores/ElstrConfigStore");

var ElstrLog = require("../ElstrLog");

var _username = "anonymous";
var _isAuth = false;
var _isAdmin = false;
var _resourcesAllowed = [];
var _enterpriseApplicationData = {};

/**
 * This is the class for storing Elstr lang
 
 * @class ElstrUserStore
 */
var ElstrUserStore = mcFly.createStore({
    init: function() {
        _username = window.ELSTR.applicationData.user.username;
        _isAuth = window.ELSTR.applicationData.user.isAuth;
        _isAdmin = window.ELSTR.applicationData.user.isAdmin;
        _resourcesAllowed = window.ELSTR.applicationData.user.resourcesAllowed;
        _enterpriseApplicationData = window.ELSTR.applicationData.user.enterpriseApplicationData;

        // Remove global ELSTR values after configuration
        window.ELSTR.applicationData.user = null;

        ElstrLog.info("ElstrUserStore initialized");
    },

    /**
     * Returns the username if authenticaed, anonymous if not
     *
     * @method getUsername
     * @return {String} username
     */
    getUsername: function() {
        return _username;
    },

    /**
     * Returns if the user is authenticated
     *
     * @method isAuth
     * @return {Boolean} If the user is authenticated
     */
    isAuth: function() {
        return _isAuth;
    },

    /**
     * Returns if the user is admin
     *
     * @method isAdmin
     * @return {Boolean} If the user is admin
     */
    isAdmin: function() {
        return _isAdmin;
    },

    /**
     * Returns if the user has allowed access to a resource
     *
     * @method resourceAllowed
     * @param {string/array} resource Name of a resource
     * @return {Boolean} If the resource is allowed
     */
    resourceAllowed: function(resource) {
        var isAllowed = true,
            objectLiteralOfResourcesAllowed = {},
            i, len;

        for (i = 0, len = _resourcesAllowed.length; i < len; i++) {
            objectLiteralOfResourcesAllowed[_resourcesAllowed[i]] = '';
        }
        if (Array.isArray(resource)) {
            for (i = 0, len = resource.length; i < len; i++) {
                if (!(resource[i] in objectLiteralOfResourcesAllowed)) {
                    isAllowed = false;
                }
            }
        } else {
            if (!(resource in objectLiteralOfResourcesAllowed)) {
                isAllowed = false;
            }
        }
        return isAllowed;
    },

    /**
     * Interface for reading enterprise application data
     *
     * @method getEnterpriseApplicationData
     * @param {string} enterpriseApplication
     * @param {string} key
     * @return
     */
    getEnterpriseApplicationData: function(enterpriseApplication, key) {
        if (_enterpriseApplicationData[enterpriseApplication]) {
            var oEnterpriseApplication = _enterpriseApplicationData[enterpriseApplication];
            if (oEnterpriseApplication[key]) {
                return oEnterpriseApplication[key];
            }
        }
        return null;
    }

}, function(payload) {
    var action = payload.action;
    switch (payload.actionType) {

        case ElstUserConstants.ELSTR_USER_DID_LOGIN:
            _username = payload.username;
            _isAuth = payload.isAuth;
            _isAdmin = payload.isAdmin;
            _resourcesAllowed = payload.resourcesAllowed;
            _enterpriseApplicationData = payload.enterpriseApplicationData;
            break;

        case ElstUserConstants.ELSTR_LANG_DID_LOGOUT:
            _username = payload.username;
            _isAuth = false;
            _isAdmin = false;
            _resourcesAllowed = [];
            _enterpriseApplicationData = {};
            break;
    }

    ElstrLog.trace('ElstrUserStore.emitChange');
    ElstrUserStore.emitChange();

    return true;
});

module.exports = ElstrUserStore;