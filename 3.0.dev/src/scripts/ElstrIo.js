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

var ElstrLog = require("./ElstrLog");
var elstrLog = new ElstrLog(true);

var ElstrId = require("./ElstrId");
var elstrId = new ElstrId();

var _currentJsonRpcRequests = [];

/**
 * This is the class for IO used in Elstr projects
 * 
 * option attributes:
 *     abortStaleRequests: aborts stale requests
 * 
 * @class ElstrIo
 * @param {Object} [options]  The options object
 */
function ElstrIo(options) {
    this.options = {};
    if (options) {
        this.options = options;
    }

    //this.requestURLs = '/elstrCustomerResearch/public/services/';
    //if (requestURLs) this.requestURLs = requestURLs;
}

ElstrIo.prototype = {

    request: request,

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

                var indexOfCurrentRequest;
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
                    callback.onError(req, error);
                } else if (res.status > 200) {
                    callback.onError(req, error);
                } else if (!res.ok) {
                    callback.onError(req, error);
                } else {
                    callback.onSuccess(req, res);
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