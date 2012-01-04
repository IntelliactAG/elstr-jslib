/**
 * Module to privide acces to information of API calls to the Elstr server
 * @module elstr_api
 * @namespace ELSTR
 * @requires base
 * @author egli@intelliact.ch
 */

YUI.add('elstr_api', function (Y) {

    /**
     * Create an Api provider which tells us what kind of request we deal with
     * and wich parameters are submitted
     *
     * @class Api
     * @extends YUI.Base
     * @namespace ELSTR
     * @param config {Object} Configuration object
     * @constructor
     */
    Y.namespace('ELSTR').Api = Y.Base.create("elstr_api", Y.Base, [], {

        /**
         * Designated initializer
         *
         * @method initializer
         */
        initializer: function () { 
            if(Y.Lang.isUndefined(window.API) === false && Y.Lang.isNull(window.API) === false){
                this.set("parameters",window.API);
                this.set("isApiRequest",true);
                window.API = null;
            }
        },
        
        destructor: function () {  
          
        },

        disable: function () {
 
        }

    }, {
        
     /**
     * Static property used to define the default attribute configuration of
     * the class.
     *
     * @property ATTRS
     * @type {Object}
     * @protected
     * @static
     */
        ATTRS: {
            /**
             * Declares if the request is an API request or not
             *
             * @attribute isApiRequest
             * @type {Bool}
             * @default flase
             */
            isApiRequest: {
                value: false,
                validator: Y.Lang.isBoolean
            },
            /**
             * Declares if the API request has been executed [veryfiy with marco]
             *
             * @attribute isExecuted
             * @type {Bool}
             * @default flase
             */
            isExecuted: {
                value: false,
                validator: Y.Lang.isBoolean
            },
            /**
             * An object holding the parameters set by the API request
             *
             * @attribute parameters
             * @type {Object}
             * @default Empty object
             */
            parameters: {
                value: {},
                validator: Y.Lang.isObject
            }
        }
    });

}, '2.0' /* module version */, {
    requires: ['base']
});