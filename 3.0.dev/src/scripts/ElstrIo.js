/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 10.12.2014.
 */

// Base for ElstrIo is SuperAgent
// SuperAgent is a small progressive client-side HTTP request library, and Node.js module with the same API, sporting many high-level HTTP client features.
// Repo: https://github.com/visionmedia/superagent
// Docs: http://visionmedia.github.io/superagent/
var request = require('superagent');

var ElstrConfigStore = require("./stores/ElstrConfigStore");

var ElstrLog = require("./ElstrLog");

var ElstrId = require("./ElstrId");
//var elstrId = new ElstrId();

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
    this.currentJsonRpcRequests = [];
}

ElstrIo.prototype = {

    /**
     * Use request for any custom requests
     */
    request: request,

    /**
     * Use requestJsonRpc for any JSON-RPC requests to the Elstr server
     * @param className
     * @param methodName
     * @param params
     * @param callback
     * @returns {Request}
     */
    requestJsonRpc: function(className, methodName, params, callback) {
        var options = this.options;
        var currentJsonRpcRequests = this.currentJsonRpcRequests;


        var requestId = ElstrId.create();
        var oRequestPost = {
            "jsonrpc": "2.0",
            "method": methodName,
            "params": params,
            "id": requestId
        };

        if (options.abortStaleRequests) {
            for (var i = 0, len = currentJsonRpcRequests.length; i < len; i++) {
                currentJsonRpcRequests[i].req.abort();
            }
            currentJsonRpcRequests = [];
        }

        var req = request.post('services/' + className)
            .send(oRequestPost)
            .type('json')
            .end(function(error, res) {

                var indexOfCurrentRequest = -1;
                for (var i = 0, len = currentJsonRpcRequests.length; i < len; i++) {
                    if (currentJsonRpcRequests[i].requestId === requestId) {
                        indexOfCurrentRequest = i;
                        break;
                    }
                }
                if (indexOfCurrentRequest > -1) {
                    currentJsonRpcRequests.splice(indexOfCurrentRequest, 1);
                }

                if (error) {

                    // TODO: Do not call onError if req is aborted because of abortStaleRequests is true
                    ElstrLog.error(error);

                    if (callback.onError) {
                        callback.onError(req, res, error);
                    }else{
                        ElstrLog.error("No callback.onError method provided");
                    }

                } else {
                    ElstrLog.info(res);
                    var data = null;

                    if (res.body) {

                        if (res.body.error) {

                            ElstrLog.error(res.body.error);

                            if (callback.onError) {

                                callback.onError(req, res, res.body.error);

                            }else{
                                ElstrLog.error("No callback.onError method provided");
                            }

                        }else{

                            if (callback.onSuccess){

                                // All went well
                                data = res.body.result;
                                callback.onSuccess(req, res, data);

                            }else{
                                ElstrLog.error("No callback.onSuccess method provided");
                            }
                        }

                    }else{
                        ElstrLog.warn("Object res.body is not defined. No data argument provided to onSuccess method.");
                    }

                }
            });

        currentJsonRpcRequests.push({
            id: requestId,
            className: className,
            methodName: methodName,
            req: req
        });

        return req;
    }

};

module.exports = ElstrIo;
