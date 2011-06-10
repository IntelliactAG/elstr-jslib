/**
 * @author egli@intelliact.ch
 */
YUI.add('elstr_api', function (Y) {        
    Y.namespace('ELSTR').Api = Y.Base.create("elstr_api", Y.Base, [], {

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
        ATTRS: {
            isApiRequest: {
                value: false,
                validator: Y.Lang.isBoolean
            },
            isExecuted: {
                value: false,
                validator: Y.Lang.isBoolean
            },
            parameters: {
                value: {},
                validator: Y.Lang.isObject
            }
        }
    });

}, '2.0' /* module version */, {
    requires: ['base']
});