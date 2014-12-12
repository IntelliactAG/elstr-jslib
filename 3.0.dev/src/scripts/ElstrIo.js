/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 10.12.2014.
 */

// Base for ElstrIo is SuperAgent
// SuperAgent is a small progressive client-side HTTP request library, and Node.js module with the same API, sporting many high-level HTTP client features.
// Repo: https://github.com/visionmedia/superagent
// Docs: http://visionmedia.github.io/superagent/
var request = require('./libs/superagent/superagent.js');

var ElstrConfigStore = require("./stores/ElstrConfigStore");

var ElstrLog = require("./ElstrLog");
var elstrLog = new ElstrLog({
    enabled: ElstrConfigStore.option("ElstrLog","enabled"),
    serverLevel: ElstrConfigStore.option("ElstrLog","serverLevel")
});

var ElstrId = require("./ElstrId");
var elstrId = new ElstrId();

/**
/* Private
 */

var _currentJsonRpcRequests = [];

/**
 * This is the class for IO used in Elstr projects
 *
 * options attributes:
 *     abortStaleRequests: aborts stale requests (only works with requestJsonRpc)
 *
 * @class ElstrIo
 * @param {Object} [options]  The options object
 */
function ElstrIo(options) {
    this.options = {};
    if (options) {
        this.options = options;
    }
}

ElstrIo.prototype = {

    // Use request for any custom requests
    request: request,

    // Use requestJsonRpc for any JSON-RPC requests to the Elstr server
    requestJsonRpc: function(className, methodName, params, callback) {
        var options = this.options;
        var requestId = elstrId.create();
        var oRequestPost = {
            "jsonrpc": "2.0",
            "method": methodName,
            "params": params,
            "id": requestId
        };

        if (options.abortStaleRequests) {
            for (var i = 0, len = _currentJsonRpcRequests.length; i < len; i++) {
                _currentJsonRpcRequests[i].req.abort();
            }
            _currentJsonRpcRequests = [];
        }

        var req = request.post('services/' + className)
            .send(oRequestPost)
            .type('json')
            .end(function(error, res) {

                var indexOfCurrentRequest = -1;
                for (var i = 0, len = _currentJsonRpcRequests.length; i < len; i++) {
                    if (_currentJsonRpcRequests[i].requestId === requestId) {
                        indexOfCurrentRequest = i;
                        break;
                    }
                }
                if (indexOfCurrentRequest > -1) {
                    _currentJsonRpcRequests.splice(indexOfCurrentRequest, 1);
                }

                if (error) {
                    // TODO: Do not call onError if req is aborted because of abortStaleRequests is true
                    callback.onError(req, error);
                    elstrLog.error(error);
                } else {
                    callback.onSuccess(req, res);
                    elstrLog.info(res);
                }
            });

        _currentJsonRpcRequests.push({
            id: requestId,
            className: className,
            methodName: methodName,
            req: req
        });
        return req;
    }

};

module.exports = ElstrIo;