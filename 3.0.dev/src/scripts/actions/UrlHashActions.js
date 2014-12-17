/**
 * CommentActions
 */

var mcFly = require('../libs/mcFly.js');
var ElstrUrlHashConstants = require('../constants/ElstrUrlHashConstants');

var ElstrLog = require("../ElstrLog");

var hasher = require('../libs/hasher');

function _serialize(obj) {

    var str = [];
    for(var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function _updateHashObject( newObject ){

    var UrlHashStore = require('../stores/UrlHashStore');
    var hashObject =  UrlHashStore.get();

    for(var i in newObject){
        hashObject[i] = newObject[i];
    }

    var newHash = _serialize(hashObject);

    hasher.setHash(newHash);
}

function _setHashObject( newObject ){

    var newHash = _serialize(newObject);
    hasher.setHash(newHash);
}

var UrlHashActions = mcFly.createActions({

    add: function( object ){
        ElstrLog.trace("UrlHashActions.add");
        _updateHashObject(object);
    },

    set: function( object ){
        ElstrLog.trace("UrlHashActions.set");
        _setHashObject(object);
    },

    replace: function( newMask ){
        ElstrLog.trace("UrlHashActions.changeMask");
        _updateHashObject({
            mask : newMask
        });

    },

    hashChange: function(newHash, oldHash) {
        ElstrLog.trace("UrlHashActions.hashChange");

        return {
            actionType: ElstrUrlHashConstants.URL_HASH_CHANGE,
            newHash: newHash,
            oldHash: oldHash
        };
    }
});

module.exports = UrlHashActions;