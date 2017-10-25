'use strict';
var mcFly = require('../libs/mcFly.js');

var ElstrUrlHashConstants = require('../constants/ElstrUrlHashConstants');
var ElstrUrlHashActions = require('../actions/ElstrUrlHashActions');

var ElstrLog = require('../ElstrLog');

/**
 *  Private variables
 */

var _newHash = ''; // Information about the current URL Hash
var _oldHash = ''; // Information about the old URL Hash
var _newPathname = ''; // Information about the current patname
var _oldPathname = ''; // Information about the old pathname
var _newRouteParams = {}; // Information about the old URL Route Params
var _oldRouteParams = {}; // Information about the old URL Route Params

var _withReactRouter = false;

/**
 * Hash to object based on this:
 * http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
 * @param hash string
 * @returns Object
 * @private
 */
function _hashToObject (hash) {

    var hashParams = {};

    var q = window.location.hash.substring(1);
    if (hash && !_withReactRouter) {
        q = hash;
    }

    if (hash) {

        var e,
            a = /\+/g, // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, ' ')); };

        while (e = r.exec(q))
            hashParams[d(e[1])] = d(e[2]);

    }

    return hashParams;
}

var ElstrUrlHashStore = mcFly.createStore({

    init: function () {

        // Application init

        var hasher = require('hasher');

        hasher.changed.add(ElstrUrlHashActions.hashChange); //add hash change listener
        hasher.initialized.add(ElstrUrlHashActions.hashChange); //add initialized listener (to grab initial value in case it is already set)

        hasher.prependHash = ''; //default value is "/"

        hasher.init(); //initialize hasher (start listening for history changes)
        _newHash = hasher.getHash();

    },

    initWithReactRouter: function () {
        this.init();
        _withReactRouter = true;
    },

    getHash: function () {
        if (!_withReactRouter) {
            return _newHash;
        } else {
            return window.location.hash.substring(1);
        }
    },

    get: function (attribute) {
        var object = _hashToObject(_newHash);
        if (attribute) {
            return object[attribute];
        } else {
            return object;
        }
    },

    getHashPrevious: function () {
        return _oldHash;
    },

    getPrevious: function (attribute) {
        var object = _hashToObject(_oldHash);
        if (attribute) {
            return object[attribute];
        } else {
            return object;
        }
    },

    getPathname: function () {
        return _newPathname;
    },

    getPreviousPathname: function () {
        return _oldPathname;
    },

    getRouteParams: function () {
        return _newRouteParams;
    },

    getRouteParam: function (key) {
        if (key) {
            return _newRouteParams[key];
        } else {
            return _newRouteParams;
        }
    },

    getPreviousRouteParams: function () {
        return _oldRouteParams;
    },

    getPreviousRouteParam: function (key) {
        if (key) {
            return _oldRouteParams[key];
        } else {
            return _oldRouteParams;
        }
    },

}, function (payload) {

    switch (payload.actionType) {

        /** CHANGE ****************************************************/
        case ElstrUrlHashConstants.URL_HASH_CHANGE:
            if (payload.newHash) _newHash = payload.newHash;
            else _newHash = '';

            if (payload.oldHash) _oldHash = payload.oldHash;
            else _oldHash = '';

            ElstrUrlHashStore.emitChange();

            break;

        case ElstrUrlHashConstants.URL_ROUTE_CHANGE:
            if (payload.params) {
                _oldRouteParams = _newRouteParams;
                _newRouteParams = payload.params;
            }

            if (payload.pathname) {
                _oldPathname = _newPathname;
                _newPathname = payload.pathname;
            }

            ElstrUrlHashStore.emitChange();

            break;

    }

    return true;
});

module.exports = ElstrUrlHashStore;