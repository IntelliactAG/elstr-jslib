"use strict";
var mcFly = require('../libs/mcFly.js');

var EventEmitter = require('events').EventEmitter;

var ElstrLog = require('../ElstrLog');
var ElstrId = require('../ElstrId');

var ElstrIo = require('../ElstrIo');
var ElstrUrlHashStore = require('../stores/ElstrUrlHashStore');

var elstrIo = new ElstrIo({
    abortStaleRequests: true
});

/**
 * Helper class lib definition.
 * @constructor
 */
function ElstrServerRpcCallsAdmin (){}


/** Get the role list
 ROLE_LIST_GET: null,
 ROLE_LIST_WILL_GET: null,
 ROLE_LIST_DID_GET: null,
 */

ElstrServerRpcCallsAdmin.getRoleList = function(){

    var className = "ELSTR_WidgetServer_JSON_Admin";
    var methodName = "getRoleList";

    var params = {};

    var callback = {
        onError: function (req, res, error) {

            ElstrLog.error("ServerRpcCallsAttachments.getComments ERROR");
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            // Handle error;
            ElstrAdminActions.didGetRoleList(error, null);
        },
        onSuccess: function (req, res, data) {

            ElstrLog.info("ServerRpcCallsAttachments.getComments Success",req, res, data);
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            var roleList = data;
            ElstrAdminActions.didGetRoleList(null, roleList);

        }
    };


    elstrIo.requestJsonRpc(className, methodName, params, callback);

};


/**
 Get the resource list
 RESOURCE_LIST_GET: null,
 RESOURCE_LIST_WILL_GET: null,
 RESOURCE_LIST_DID_GET: null,
 */

/** Get the resource list  */
ElstrServerRpcCallsAdmin.getResourceList = function() {

    var className = "ELSTR_WidgetServer_JSON_Admin";
    var methodName = "getResourceDataTable";

    var params =  {
    };

    var callback = {
        onError: function (req, res, error) {

            ElstrLog.error("ElstrServerRpcCallsAdmin.getResourceList ERROR");
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            // Handle error;
            ElstrAdminActions.didGetResourceList(error, null);
        },
        onSuccess: function (req, res, data) {

            ElstrLog.info("ElstrServerRpcCallsAdmin.getResourceList Success", req, res, data);
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            var resourceList = data;
            ElstrAdminActions.didGetResourceList(null, resourceList);

        }
    };


    elstrIo.requestJsonRpc(className, methodName, params, callback);
};

/**
 Update Role
 ROLE_UPDATE: null,
 ROLE_WILL_UPDATE: null,
 ROLE_DID_UPDATE: null,
 */

/** Update Role    */
ElstrServerRpcCallsAdmin.updateRole = function(mode, roleName) {

    var className = "ELSTR_WidgetServer_JSON_Admin";
    var methodName = "updateRole";

    var params = {
        mode: mode, // "add","delete"
        roleName: roleName // "vaca"
    };

    var callback = {
        onError: function (req, res, error) {

            ElstrLog.error("ElstrServerRpcCallsAdmin.updateRole ERROR");
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            // Handle error;
            ElstrAdminActions.didUpdateRole(error);
        },
        onSuccess: function (req, res, data) {

            ElstrLog.info("ElstrServerRpcCallsAdmin.updateRole Success");
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            var ElstrServerRpcUtils = require('./ElstrServerRpcUtils');
            var error = ElstrServerRpcUtils.validateMessages(data);

            if (error === null) {
                ElstrAdminActions.didUpdateRole(null);
            }

            ElstrAdminActions.didUpdateRole(error);

        }
    };


    elstrIo.requestJsonRpc(className, methodName, params, callback);
};


/** Update Resource
 RESOURCE_UPDATE: null,
 RESOURCE_WILL_UPDATE: null,
 RESOURCE_DID_UPDATE: null,
 */

/** Update Resource  */
ElstrServerRpcCallsAdmin.updateResource = function(mode, resourceName, type) {

    var className = "ELSTR_WidgetServer_JSON_Admin";
    var methodName = "updateResource";

    var params =  {
        mode: mode, // "add", "delete"
        resourceName: resourceName, // "vaca",
        type: type // "Application", "Service", "WidgetServer", "Method"
    };

    var callback = {
        onError: function (req, res, error) {

            ElstrLog.error("ElstrServerRpcCallsAdmin.updateResource ERROR");
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            // Handle error;
            ElstrAdminActions.didUpdateResource(error);
        },
        onSuccess: function (req, res, data) {

            ElstrLog.info("ElstrServerRpcCallsAdmin.updateResource Success");
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            var ElstrServerRpcUtils = require('./ElstrServerRpcUtils');
            var error = ElstrServerRpcUtils.validateMessages(data);

            if (error === null) {
                ElstrAdminActions.didUpdateResource(null);
            }

            ElstrAdminActions.didUpdateResource(error);

        }
    };


    elstrIo.requestJsonRpc(className, methodName, params, callback);
};


/** Update Acess right  */
ElstrServerRpcCallsAdmin.updateAcessright = function(accessRight, resourceName, roleName) {

    var className = "ELSTR_WidgetServer_JSON_Admin";
    var methodName = "updateAccessRight";

    var params = {
        resourceName: resourceName, // "KISTLER_WidgetServer_JSON_ChangeAttachments",
        roleName: roleName, // "role_admin"
        accessRight: accessRight // "deny","inherit","allow"

    };


    var callback = {
        onError: function (req, res, error) {

            ElstrLog.error("ElstrServerRpcCallsAdmin.updateAcessright ERROR");
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            // Handle error;
            ElstrAdminActions.didUpdateAcessright(error);
        },
        onSuccess: function (req, res, data) {

            ElstrLog.info("ElstrServerRpcCallsAdmin.updateAcessright Success");
            var ElstrAdminActions = require('../actions/ElstrAdminActions.js');

            var ElstrServerRpcUtils = require('./ElstrServerRpcUtils');
            var error = ElstrServerRpcUtils.validateMessages(data);

            if (error === null) {
                ElstrAdminActions.didUpdateAcessright(null);
            }

            ElstrAdminActions.didUpdateAcessright(error);

        }
    };

    elstrIo.requestJsonRpc(className, methodName, params, callback);
};

module.exports = ElstrServerRpcCallsAdmin;