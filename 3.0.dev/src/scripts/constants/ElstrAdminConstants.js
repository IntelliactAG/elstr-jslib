var keyMirror = require('keymirror');

module.exports = keyMirror({

    /* LOAD BOTH LISTS */

    /** Get the role list  */
    ROLE_LIST_GET: null,
    ROLE_LIST_WILL_GET: null,
    ROLE_LIST_DID_GET: null,

    /** Get the resource list  */
    RESOURCE_LIST_GET: null,
    RESOURCE_LIST_WILL_GET: null,
    RESOURCE_LIST_DID_GET: null,

    /* UPDATES IN THE LISTS */

    /** Update Role  */
    ROLE_UPDATE: null,
    ROLE_WILL_UPDATE: null,
    ROLE_DID_UPDATE: null,

    /** Update Resource  */
    RESOURCE_UPDATE: null,
    RESOURCE_WILL_UPDATE: null,
    RESOURCE_DID_UPDATE: null,

    /** Update Acess right  */
    ACCESS_RIGHT_UPDATE: null,
    ACCESS_RIGHT_WILL_UPDATE: null,
    ACCESS_RIGHT_DID_UPDATE: null

});