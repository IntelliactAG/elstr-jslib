"use strict";
/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 14.12.2014.
 */

var mcFly = require('../libs/mcFly.js');

var ElstrUserConstants = require('../constants/ElstrUserConstants');

var ElstrLog = require("../ElstrLog");

/**
 *  Private variables
 */

var _username = "anonymous";
var _isAuth = false;
var _isAdmin = false;
var _resourcesAllowed = [];
var _enterpriseApplicationData = {};
var _clientIp = null;
var _memberOf = null;

var _message = null;
var _loading = false;

var _forceAuthentication = true;

/**
 * This is the class for storing Elstr lang
 
 * @class ElstrUserStore
 */
var ElstrUserStore = mcFly.createStore({
    init: function(options) {

        if (options && (options.forceAuthentication === false || options.forceAuthentication === "")) {
            _forceAuthentication = false;
        }

        _username = window.ELSTR.applicationData.user.username;
        _isAuth = window.ELSTR.applicationData.user.isAuth;
        _isAdmin = window.ELSTR.applicationData.user.isAdmin;
        _resourcesAllowed = window.ELSTR.applicationData.user.resourcesAllowed;
        _enterpriseApplicationData = window.ELSTR.applicationData.user.enterpriseApplicationData;
        _memberOf = window.ELSTR.applicationData.user.memberOf;
        _clientIp = window.ELSTR.applicationData.user.clientIp;

        // Remove global ELSTR values after configuration
        window.ELSTR.applicationData.user = null;

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
     * Returns the short username if authenticaed, anonymous if not
     *
     * @method getShortUsername
     * @return {String} shortUserName
     */
    getShortUsername: function() {
        var shortUserName = _username;
        var atPosition = _username.lastIndexOf("@");
        if (atPosition>=0){
            shortUserName = _username.substring(0, atPosition);
        }
        return shortUserName;
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
     * Returns the last message
     *
     * @method getLastMessage
     * @return {String} mesage
     */
    getMessage: function() {
        return _message;
    },

    /**
     * Returns if it is loading
     *
     * @method isLoading
     * @return {Boolean} If it is loading from the server
     */
    isLoading: function() {
        return _loading;
    },

    /**
     * Returns if the user is forced to login
     *
     * @method forceAuthentication
     * @return {Boolean} If the user is admin
     */
    forceAuthentication: function() {
        return _forceAuthentication;
    },

    /**
     * Returns if the user has allowed access to a resource
     *
     * @method resourceAllowed
     * @param {string/array} name of a resource
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
     * Returns if the user is a member of the role
     *
     * @method isMemberOf
     * @param {string} name of a role
     * @return {Boolean} If the user is member of the role
     */
    isMemberOf: function(role) {
        var isMember = false;
        if(_memberOf.indexOf(role) >= 0){
            isMember = true;
        }
        return isMember;
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
    },

    /**
     * Returns the client IP adress
     *
     * @method getClientIp
     * @return {String} of the client ip
     */
    getClientIp: function() {
        return _clientIp;
    }

}, function(payload) {

    try{

        switch (payload.actionType) {
            case ElstrUserConstants.ELSTR_USER_WILL_LOGIN:
                _message = null;
                _loading = true;

                ElstrUserStore.emitChange();

                break;
            case ElstrUserConstants.ELSTR_USER_DID_LOGIN_SUCCESS:

                if (payload.username !== null) _username = payload.username;
                if (payload.isAuth !== null) _isAuth = payload.isAuth;
                if (payload.isAdmin !== null) _isAdmin = payload.isAdmin;
                if (payload.resourcesAllowed !== null) _resourcesAllowed = payload.resourcesAllowed;
                if (payload.memberOf !== null) _memberOf = payload.memberOf;
                if (payload.enterpriseApplicationData !== null) _enterpriseApplicationData = payload.enterpriseApplicationData;
                _message = payload.message; // Change the message anyway
                _loading = false;

                ElstrUserStore.emitChange();

                break;


            case ElstrUserConstants.ELSTR_USER_DID_LOGIN_FAILED:

                if (payload.username !== null) _username = payload.username;
                if (payload.isAuth !== null) _isAuth = payload.isAuth;
                if (payload.isAdmin !== null) _isAdmin = payload.isAdmin;
                if (payload.resourcesAllowed !== null) _resourcesAllowed = payload.resourcesAllowed;
                if (payload.memberOf !== null) _memberOf = payload.memberOf;
                if (payload.enterpriseApplicationData !== null) _enterpriseApplicationData = payload.enterpriseApplicationData;
                _message = payload.message; // Change the message anyway
                _loading = false;

                ElstrUserStore.emitChange();

                break;
            case ElstrUserConstants.ELSTR_USER_WILL_LOGOUT:
                _message = null;
                _loading = true;

                ElstrUserStore.emitChange();

                break;
            case ElstrUserConstants.ELSTR_USER_DID_LOGOUT:
                if (payload.username !== null) _username = payload.username;
                if (payload.isAuth !== null) _isAuth = payload.isAuth;
                if (payload.isAdmin !== null) _isAdmin = payload.isAdmin;
                if (payload.resourcesAllowed !== null) _resourcesAllowed = payload.resourcesAllowed;
                if (payload.memberOf !== null) _memberOf = payload.memberOf;
                if (payload.enterpriseApplicationData !== null) _enterpriseApplicationData = payload.enterpriseApplicationData;
                _message = payload.message; // Change the message anyway
                _loading = false;

                ElstrUserStore.emitChange();

                break;
        }

        return true;

    }catch(e){
        console.error(e);
        throw e;
    }
});

module.exports = ElstrUserStore;