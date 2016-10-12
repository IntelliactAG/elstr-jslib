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
     * @param requestMethod [Optional] POST | GET | PUT, defines the request method to use
     * @returns {Request}
     */
    requestJsonRpc: function(className, methodName, params, callback, requestMethod) {
        var options = this.options;
        var currentJsonRpcRequests = this.currentJsonRpcRequests;

        if (!requestMethod || (typeof requestMethod == 'undefined')){ requestMethod = "POST"; }
        else { requestMethod = requestMethod.toUpperCase(); }

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

        var maxTimeout = 60000;
        if (options.maxTimeout) {
            maxTimeout = options.maxTimeout;
        }

        var URL = 'services/' + className;

        // For debug purposes of default requests
        if (requestMethod == "POST" ||
            requestMethod == "PUT"){
            URL+='?__'+ methodName;

        }else if (requestMethod == "GET"){

            // When the request is GET
            URL+='?'+Object.keys(params).map(function(k) {
                    return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
                }).join('&');
        }else{
            console.error("Request unkwon ",requestMethod)
        }

        var req = request(requestMethod, URL)
            .send(oRequestPost)
            .type('json')
            .timeout(maxTimeout)
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
                        ElstrLog.error("Object res.body is not defined. No data argument provided to onSuccess method.");

                        ElstrLog.error(res.text);

                        callback.onError(req, res, {
                            message: "Unexpected JSON error :: " + (res.text)?
                                res.text.substr(0, res.text.indexOf("Call Stack")):"",
                            resText: res.text
                        });
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