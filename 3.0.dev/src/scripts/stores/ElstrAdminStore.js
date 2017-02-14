"use strict";
var mcFly = require('../libs/mcFly.js');

var ElstrAdminConstants = require('../constants/ElstrAdminConstants');
var ElstrAdminActions = require('../actions/ElstrAdminActions');

var ElstrUrlHashConstants = require('../constants/ElstrUrlHashConstants');
var ElstrUserConstants = require('../constants/ElstrUserConstants');

var ElstrLog = require('../ElstrLog');
var ElstrId = require('../ElstrId');

var ElstrUserStore = require('../stores/ElstrUserStore');

var _loading_resources = null;
var _loading_roles = null;

var _loading_update_resources = null;
var _loading_update_roles = null;

var _error_resources = null;
var _error_roles = null;

var _resources = null;
var _roles = null;

function _setDefaultValues(){

    _loading_resources = null;
    _loading_roles = null;

    _loading_update_resources = null;
    _loading_update_roles = null;

    _error_resources = null;
    _error_roles = null;

}


var ElstrAdminStore = mcFly.createStore({


    /** DATA */
    getResources : function(){
        return _resources;
    },
    getRoles : function(){
        return _roles;
    },

    /** LOADING STATES */
    getLoadingResources : function(){
        return _loading_resources;
    },
    getLoadingRoles : function(){
        return _loading_roles;
    },

    /** ERRORS */
    getErrorResources : function(){
        return _error_resources;
    },
    getErrorRoles : function(){
        return _error_roles;
    },

    /** LOADING UPDATE STATES */
    getLoadingUpdateResources : function(){
        return _loading_update_resources;
    },
    getLoadingUpdateRoles : function(){
        return _loading_update_roles;
    }

}, function(payload) {

    switch (payload.actionType) {

        /**
         * User log out
         */
        case ElstrUserConstants.ELSTR_USER_DID_LOGOUT:

            // We wait for the user Store.
            mcFly.dispatcher.waitFor([ElstrUserStore.dispatcherID]);
            _setDefaultValues();

            ElstrAdminStore.emitChange();

            break;


        /** Get the role list  */
        case ElstrAdminConstants.ROLE_LIST_WILL_GET:

            _loading_roles = true;
            ElstrAdminStore.emitChange();
            break;

        case ElstrAdminConstants.ROLE_LIST_DID_GET:

            _loading_roles = false;
            _error_roles = payload.error;
            _roles = payload.roleList;

            ElstrAdminStore.emitChange();
            break;

        /** Get the resource list  */
        case ElstrAdminConstants.RESOURCE_LIST_WILL_GET:

            _loading_resources = true;

            ElstrAdminStore.emitChange();
            break;

        case ElstrAdminConstants.RESOURCE_LIST_DID_GET:

            _loading_resources = false;
            _error_resources = payload.error;
            _resources = payload.resourceList;

            ElstrAdminStore.emitChange();
            break;

            /* UPDATES IN THE LISTS */

        /** Update Role  */
        case ElstrAdminConstants.ROLE_WILL_UPDATE:

            _loading_update_roles = true;

            ElstrAdminStore.emitChange();
            break;

        case ElstrAdminConstants.ROLE_DID_UPDATE:

            _loading_update_roles = false;
            _error_roles = payload.error;

            ElstrAdminActions.getRoleList();
            ElstrAdminActions.getResourceList();

            ElstrAdminStore.emitChange();
            break;

        /** Update Resource  */
        case ElstrAdminConstants.RESOURCE_WILL_UPDATE:

            _loading_update_resources = true;

            ElstrAdminStore.emitChange();
            break;

        case ElstrAdminConstants.RESOURCE_DID_UPDATE:

            _loading_update_resources = false;
            _error_resources = payload.error;

            ElstrAdminActions.getResourceList();

            ElstrAdminStore.emitChange();
            break;

        /** Update Acess right  */
        case ElstrAdminConstants.ACCESS_RIGHT_WILL_UPDATE:

            _loading_update_resources = true;

            ElstrAdminStore.emitChange();
            break;

        case ElstrAdminConstants.ACCESS_RIGHT_DID_UPDATE:

            _loading_update_resources = false;
            _error_resources = payload.error;

            ElstrAdminActions.getResourceList();

            ElstrAdminStore.emitChange();
            break;

    }


    return true;

});

module.exports = ElstrAdminStore;