/*jshint -W083 */
// We tell link than functions can be created in loops for this file
var mcFly = require('./mcFly.js');

var ElstrUserConstants = require('../constants/ElstrUserConstants');
var ElstrUserStore = require('../stores/ElstrUserStore');

var ElstrCache = require('../ElstrCache');

var ElstrEditingStates = require('../constants/ElstrEditingStates');
var ElstrLoadingStates = require('../constants/ElstrLoadingStates');

var ElstrIo = require('../ElstrIo');

var elstrIo = new ElstrIo({
    abortStaleRequests: true
});

var assign =   require('object-assign');

function ElstrFlux (){}

/**
 * Extend the default mcFly create actions behaviour
 *
 * standarRequests = [{
 *      className,
 *      methodName,
 *      constantWill,
 *      constantDid
 *  }]
 *
 */

function createAction(parameters, result,
                      className, methodName, constantWill, constantDid){

    parameters[methodName+"Did"] = function (error, params, data, noRpcParams) {

        return {
            actionType: constantDid,
            error: error,
            params: params,
            noRpcParams: noRpcParams,
            data: data
        };
    };

    parameters[methodName] = function (params, noRpcParams) {

        if (!params) params = {};

        var callback = {
            onError: function (req, res, error) {

                // Handle error;
                if (error.message) error = error.message;

                var ErrorMessageStore = require('../stores/ErrorMessageStore');
                ErrorMessageStore.addError(error);
//

                result.finalActions[methodName+"Did"](error, params, null, noRpcParams);

            },
            onSuccess: function (req, res, data) {

                var ElstrServerRpcUtils = require('./ElstrServerRpcUtils');
                var ErrorMessageStore = require('../stores/ErrorMessageStore');
                var i;
                if (data.result && data.result.messages) {

                    for ( i = 0; i < data.result.messages.length; i++) {
                        ErrorMessageStore.addMessage(data.result.messages[i]);
                    }

                    /* We check for the base object info */
                } else if (data.messages) {

                    for ( i = 0; i < data.messages.length; i++) {
                        ErrorMessageStore.addMessage(data.messages[i]);
                    }

                }

                var error = ElstrServerRpcUtils.validateMessages(data);

                result.finalActions[methodName+"Did"](error, params, data, noRpcParams);

            }
        };

        elstrIo.requestJsonRpc(className, methodName, params, callback);

        var res = assign({
            actionType: constantWill
        }, params);

        // We add the nonRpcParameters
        if (noRpcParams){

            res = assign(res, noRpcParams);

        }

        return res;
    };

}

ElstrFlux.createActions = function(standardRequests,parameters) {

    var result = {};

    if (standardRequests){
        for (var i = 0; i < standardRequests.length; i++) {

            createAction(
                parameters,
                result,
                standardRequests[i].className,
                standardRequests[i].methodName,
                standardRequests[i].constantWill,
                standardRequests[i].constantDid);

        }
    }

    result.finalActions = mcFly.createActions(parameters);
    return result.finalActions;
};




/**
 * Extend the default mcFly create store behaviour
 */
ElstrFlux.createStore = function(
    localCacheId,
    constantWill, constantDid,
    store, listeners) {

    var FinalStore;

    store._message = null;
    store._error = null;
    store._data = ElstrCache.set(localCacheId, store._data);

    store._loadingState = ElstrLoadingStates.EMPTY;
    store._editingState = ElstrEditingStates.NORMAL;

    store.getData = function() {
        return store._data;
    };

    store.getLoadingState = function() {

        if (store._loadingState == ElstrLoadingStates.EMPTY){

            var data = this.getData();
            if (data){
                return ElstrLoadingStates.CACHED;
            }

        }

        return store._loadingState;

    };

    store.getEditingState = function() {

        return store._editingState;

    };

    store.getMessage = function() {

        return store._message;

    };

    store.getError = function() {

        return store._error;

    };

    store.cleanError = function() {

        store._error = null;
        FinalStore.emitChange();

    };

    FinalStore = mcFly.createStore(store, function(payload) {

        listeners(payload);

        switch (payload.actionType) {

        /**
         * User log out
         */
            case ElstrUserConstants.ELSTR_USER_DID_LOGOUT:

                // We wait for the user Store.
                mcFly.dispatcher.waitFor([ElstrUserStore.dispatcherID]);

                store._data = {};
                FinalStore.emitChange();

                break;

        /**
         * LOAD
         */

            case constantWill:

                store._loadingState = ElstrLoadingStates.EMPTY;
                store._error = null;

                FinalStore.emitChange();
                break;

            case constantDid:

                store._loadingState = ElstrLoadingStates.LOADED;
                store._error = payload.error;

                if ( payload.data && payload.data){
                    store._data = payload.data;

                    // Is defined and not null
                    if (typeof localCacheId !== 'undefined' &&
                        localCacheId !== null){

                        ElstrCache.set(localCacheId, store._data);
                    }
                }

                FinalStore.emitChange();

                break;

        }

        return true;

    });

    return FinalStore;
};

module.exports = ElstrFlux;