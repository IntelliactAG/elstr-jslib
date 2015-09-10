/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by egli@intelliact on 12.12.2014.
 */

var mcFly = require('elstr-jslib/src/scripts/libs/mcFly.js');
var ElstrRealTimeConstants = require('../constants/ElstrRealTimeConstants');

var ElstrLog = require('elstr-jslib/src/scripts/ElstrLog');
var ElstrId = require('elstr-jslib/src/scripts/ElstrId');
var ElstrUserStore = require('elstr-jslib/src/scripts/stores/ElstrUserStore');
var ElstrConfigStore = require('elstr-jslib/src/scripts/stores/ElstrConfigStore');



var PouchDB = require("pouchdb");

var db;
var remoteCouch;

var _localTimes;
var firstLoad = false;
var myPcId = ElstrId.create();

/**
 * Private methods
 */

/*

 {
 timestamp: "201505201500",
 identifier: [{
 object: "change",
 objectId: "c8advjap9w8egn"
 },{
 object: "item",
 objectId: "c8advjap4gfdfsg"
 },{
 object: "task",
 objectId: "2890cvjpaodhuf"
 }],
 event: "completed", //optional
 data: {state: "completed", name: "do anything"} //optional
 }
 */

function _compareIdentifiers(identifierA, identifierB) {

    if (identifierA && !identifierB) return false;
    else if (identifierB && !identifierA) return false;
    else if (!identifierA && !identifierB) return true;
    else{

        if (identifierA.length !== identifierB.length) return false;

        for (var i = 0; i <identifierA.length; i++) {

            var identifierAItem = identifierA[i];
            var identifierBItem = identifierB[i];

            if (identifierAItem.object !== identifierBItem.object){
                return false;
            }else if (identifierAItem.objectId != identifierBItem.objectId){
                return false;
            }
        }
    }

    return true;
}

// http://pouchdb.com/2014/05/01/secondary-indexes-have-landed-in-pouchdb.html
function createDesignDoc(name, mapFunction) {
    var ddoc = {
        _id: '_design/' + name,
        views: {
        }
    };
    ddoc.views[name] = { map: mapFunction.toString() };
    return ddoc;
}

// http://pouchdb.com/2014/06/17/12-pro-tips-for-better-code-with-pouchdb.html

/**
 * @param identifier an object to identify the change.
 * @param timestamp in milisecons, has to come from the server.
 * @param event a string defining what happened.
 * @param data extra optional data.
 * @returns {{actionType: *, target: *, timestamp: *}}
 */
function _setTime(identifier, timestamp, user, event, data) {

    var record = null;

    // We search for it.
    if (_localTimes){
        for (var i = 0; i < _localTimes.length; i++) {
            var obj = _localTimes[i];

            // TODO: compare the identifiers properly
            if (_compareIdentifiers(obj.identifier, identifier)){

                record = obj;

                record.pcId = myPcId;
                record.user = user;
                record.timestamp = timestamp; //  We update the time.
                record.event = event; //  We update the event.
                record.data = data; //  We update the data.

                break;
            }
        }
    }

    // We didn't found it.
    if (record === null) {

        // TODO: find an unique Id

        var uniqueId = new Date().getTime() +"X"+ElstrId.create();

        record = {
            _id: uniqueId,
            pcId: myPcId,
            identifier: identifier,
            timestamp: timestamp,
            user: user,
            event: event,
            data: data
        };
    }

    db.put(record, function callback(err, result) {
        if (err) {
            ElstrLog.error(err);
        }else{
            ElstrLog.log('Successfully updated Times ',result);
        }
    });
}

function _updateTimes(){

    // We request the updates for the last xxx secs
    var timemargin = ElstrConfigStore.option("ElstrRealTime","timemargin");
    var sinceWhen = new Date().getTime() - timemargin;

    db.query({
        include_docs: true,
        map: function(doc, emit) {
            if (doc.timestamp > sinceWhen) {
                emit(doc, 1);
            }
        }}, function(err, doc) {

        if (err){
            ElstrLog.error(err);
        }else{

            ElstrRealTimeActions.updateTimes(doc.rows);

        }
    });
}


/**
 * Public methods
 */

var ElstrRealTimeActions = mcFly.createActions({

    init : function(localDbName, externalUrl) {

        db = new PouchDB(localDbName, {
            auth: {
                username: ElstrConfigStore.option("ElstrRealTime","username"),
                password: ElstrConfigStore.option("ElstrRealTime","password")
            }
        }); // 'clientName'
        remoteCouch = externalUrl; // 'http://127.0.0.1:5984/realtime'

        var filterDb = function(doc){

            // We don't filter now.
            // Here it comes the real filter
            // TODO only listen to the events for the current comment / item
            return true; // doc.target == "comment";

        };

        db.changes({
            since: 'now',
            live: true
            //, filter: filterDb
        }).on('change', _updateTimes);

        function _sync() {

            var filter = function(doc){

                return true; // doc.target == "comment";

            };


            var opts = {
                live: true
            };

            db.replicate.to(remoteCouch, opts);


            var optsFrom = {
                live: true
                // , filter: filter
            };

            db.replicate.from(remoteCouch, optsFrom);


        }

        _sync();
        _updateTimes();

    },

    /**
     * @param identifier an object to identify the change.
     * @param event a string defining what happened.
     * @param data extra optional data.
     * @returns {{actionType: *, target: *, timestamp: *}}
     */
    updateTargetTime: function(identifier, event, data) {

        // Only if the real time is enabled
        var realTimeEnabled = ElstrConfigStore.option("ElstrRealTime","enabled");
        if (realTimeEnabled) {

            var date = new Date();
            var timestamp = date.getTime();
            var user = ElstrUserStore.getUsername();

            _setTime(identifier, timestamp, user, event, data);

        }else{

            ElstrLog.info("Real time update discarted, realtime currently disabled");

        }
    },

    /**
     * @param target a string to identify the change.
     * @param time in milisecons, has to come from the server.
     * @returns {{actionType: *, target: *, time: *}}
     */
    updateTimes: function(newLocalTimes) {

        _localTimes = newLocalTimes;

        // console.log("newLocalTimes",newLocalTimes);

        if (firstLoad){

            return {
                actionType: ElstrRealTimeConstants.REAL_TIME_UPDATE,
                times: newLocalTimes
            };

        }

        firstLoad = true;

        return {
            actionType: ElstrRealTimeConstants.REAL_TIME_UPDATE_DISCARTED
        };
    }

});

ElstrRealTimeActions.myPcId = function() {

    return myPcId;

};

module.exports = ElstrRealTimeActions;