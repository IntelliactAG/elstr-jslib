/**
 * CommentActions
 */

var mcFly = require('../libs/mcFly.js');

var ElstrUrlHashActions = require('../actions/ElstrUrlHashActions');
var ElstrUrlHashStore = require('../stores/ElstrUrlHashStore');

var ElstrLog = require('../ElstrLog');

var ElstrAdminConstants = require('../constants/ElstrAdminConstants');
var ElstrServerRpcCallsAdmin = require('../libs/ElstrServerRpcCallsAdmin');

////////////////////////////////////////////

var AdminActions = mcFly.createActions({


    /** Get the role list
    ROLE_LIST_GET: null,
    ROLE_LIST_WILL_GET: null,
    ROLE_LIST_DID_GET: null,
    */

    getRoleList: function() {

        ElstrServerRpcCallsAdmin.getRoleList();

        return {
            actionType: ElstrAdminConstants.ROLE_LIST_WILL_GET
        };
    },

    didGetRoleList: function(error, roleList) {

        console.log("ACTIONS didGetRoleList ", error, roleList );

        return {
            actionType: ElstrAdminConstants.ROLE_LIST_DID_GET,
            error: error,
            roleList: roleList
        };
    },


    /** Get the resource list
    RESOURCE_LIST_GET: null,
    RESOURCE_LIST_WILL_GET: null,
    RESOURCE_LIST_DID_GET: null,
     */

    /** Get the resource list  */
    getResourceList: function() {

        ElstrServerRpcCallsAdmin.getResourceList();

        return {
            actionType: ElstrAdminConstants.RESOURCE_LIST_WILL_GET
        };
    },

    didGetResourceList: function(error, resourceList) {

        console.log("ACTIONS didGetResourceList ", error, resourceList );

        return {
            actionType: ElstrAdminConstants.RESOURCE_LIST_DID_GET,
            error: error,
            resourceList: resourceList
        };
    },

    /** Update Role
    ROLE_UPDATE: null,
    ROLE_WILL_UPDATE: null,
    ROLE_DID_UPDATE: null,
     */

    /** Update Role    */
    updateRole: function(mode, roleName) {

        ElstrServerRpcCallsAdmin.updateRole(mode, roleName);

        return {
            actionType: ElstrAdminConstants.ROLE_WILL_UPDATE
        };
    },

    didUpdateRole: function(error) {
        return {
            actionType: ElstrAdminConstants.ROLE_DID_UPDATE,
            error: error
        };
    },


    /** Update Resource
    RESOURCE_UPDATE: null,
    RESOURCE_WILL_UPDATE: null,
    RESOURCE_DID_UPDATE: null,
     */


    /** Update Resource  */
    updateResource: function(mode, resourceName, type) {

        ElstrServerRpcCallsAdmin.updateResource(mode, resourceName, type);

        return {
            actionType: ElstrAdminConstants.RESOURCE_WILL_UPDATE
        };
    },

    didUpdateResource: function(error) {
        return {
            actionType: ElstrAdminConstants.RESOURCE_DID_UPDATE,
            error: error
        };
    },


    /** Update Acess right
    ACCESS_RIGHT_UPDATE: null,
    ACCESS_RIGHT_WILL_UPDATE: null,
    ACCESS_RIGHT_DID_UPDATE: null
     */

    /** Update Acess right  */
    updateAcessright: function(accessRight, resourceName, roleName) {

        ElstrServerRpcCallsAdmin.updateAcessright(accessRight, resourceName, roleName);
        return {
            actionType: ElstrAdminConstants.ACCESS_RIGHT_WILL_UPDATE
        };
    },

    didUpdateAcessright: function(error) {
        return {
            actionType: ElstrAdminConstants.ACCESS_RIGHT_DID_UPDATE,
            error: error
        };
    }

});

module.exports = AdminActions;