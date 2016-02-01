var mcFly = require('../libs/mcFly.js');

var ElstrUrlHashConstants = require('../constants/ElstrUrlHashConstants');
var ElstrUserConstants = require('../constants/ElstrUserConstants');

var ElstrRealTimeActions = require('../actions/ElstrRealTimeActions');

var ElstrUserStore = require('../stores/ElstrUserStore');

var ElstrLog = require('../ElstrLog');
var ElstrId = require('../ElstrId');
var ElstrCache = require('../ElstrCache');

var ElstrEditingStates = require('../constants/ElstrEditingStates');
var ElstrLoadingStates = require('../constants/ElstrLoadingStates');

var ElstrUrlHashStore = require('../stores/ElstrUrlHashStore');
var ElstrUrlHashConstants = require('../constants/ElstrUrlHashConstants');
var ElstrId = require('../ElstrId');

var _errors = [];
var _messages = [];

var ErrorMessageStore = mcFly.createStore({

    addMessage: function(message) {
        console.log("addMessage" , message);
        if(typeof(message) === 'string'){
            _messages.push({
                id: ElstrId.createDocumentUnique(),
                message: message
            });
        } else {
            // It is an object
            if(message.type === 'error'){
                _errors.push({
                    id: ElstrId.createDocumentUnique(),
                    error: message.message
                });
            } else {
                _messages.push({
                    id: ElstrId.createDocumentUnique(),
                    message: message.message
                });
            }
        }
        ErrorMessageStore.emitChange();
    },

    addError: function(error) {
        console.log("addError" , error);
        _errors.push({
            id: ElstrId.createDocumentUnique(),
            error: error
        });
        ErrorMessageStore.emitChange();
    },

    getMessages: function() {

        return _messages;

    },
    getErrors: function() {

        return _errors;

    },

    readMessage: function(id) {
        console.log("readMessage ",id);
        for (var i = 0; i < _messages.length; i++) {
            var message = _messages[i];
            if (message.id==id){
                _messages.splice(i, 1);
                ErrorMessageStore.emitChange();
                return;
            }
        }

    },

    readError: function(id) {
        console.log("readError ",id);
        for (var i = 0; i < _errors.length; i++) {
            var error = _errors[i];
            if (error.id==id){
                _errors.splice(i, 1);
                ErrorMessageStore.emitChange();
                return;
            }
        }

    },

    cleanMessages: function() {

        _messages = [];
        ErrorMessageStore.emitChange();

    },

    cleanErrors: function() {

        _errors = [];
        ErrorMessageStore.emitChange();

    }

}, function(payload) {

    switch (payload.actionType) {


        /**
         * User log out
         */
        case ElstrUserConstants.ELSTR_USER_DID_LOGOUT:

            // We wait for the user Store.
            mcFly.dispatcher.waitFor([ElstrUserStore.dispatcherID]);

            _errors = [];
            _messages = [];

            ErrorMessageStore.emitChange();

            break;
        
    }


    return true;

});

module.exports = ErrorMessageStore;