var mcFly = require('../libs/mcFly.js');

var EventEmitter = require('events').EventEmitter;
var ElstrUrlHashConstants = require('../constants/ElstrUrlHashConstants');
var UrlHashActions = require('../actions/UrlHashActions');

var ElstrLog = require('../ElstrLog');

var _newHash = ""; // Information about the current URL Hash
var _oldHash = ""; // Information about the old URL Hash

/**
 * Hash to object based on this:
 * http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
 * @param hash string
 * @returns Object
 * @private
 */
function _hashToObject(hash) {

  var hashParams = {};

  if (hash){

    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = hash;

    while (e = r.exec(q))
      hashParams[d(e[1])] = d(e[2]);

  }

  return hashParams;
}

var UrlHashStore = mcFly.createStore({

  init: function(){

    // Application init

    var hasher = require('../libs/hasher');

    hasher.changed.add(UrlHashActions.hashChange); //add hash change listener
    hasher.initialized.add(UrlHashActions.hashChange); //add initialized listener (to grab initial value in case it is already set)

    hasher.prependHash = ''; //default value is "/"

    hasher.init(); //initialize hasher (start listening for history changes)

  },

  getHash: function() {
    return _newHash;
  },

  get: function(attribute) {
    var object = _hashToObject(_newHash);
    if (attribute){
      return object[attribute];
    }else{
      return object;
    }
  },

  getHashPrevious: function() {
    return _oldHash;
  },

  getPrevious: function(attribute) {
    var object = _hashToObject(_oldHash);
    if (attribute){
      return object[attribute];
    }else{
      return object;
    }
  }

}, function(payload) {

  switch (payload.actionType) {

    /** CHANGE ****************************************************/
    case ElstrUrlHashConstants.URL_HASH_CHANGE:

      ElstrLog.info("UrlHashStore::event -> AppConstants.URL_HASH_CHANGE ", payload.newHash, payload.oldHash);

      if (payload.newHash) _newHash = payload.newHash;
      else _newHash = "";

      if (payload.oldHash) _oldHash = payload.oldHash;
      else _oldHash = "";

      break;

  }

  UrlHashStore.emitChange();

  return true;
});

module.exports = UrlHashStore;