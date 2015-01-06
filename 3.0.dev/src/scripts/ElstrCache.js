/**
 * Created by sahun on 02.12.2014.
 */

var ARRAY_MODE = 1;
var LOCAL_STORAGE_MODE = 2;

var kizzy = require('kizzy');

_data = [];
_mode = ARRAY_MODE;
_arrayLimit =  0;

var ElstrLog = require("./ElstrLog");


var ElstrCache = {

    //
    init : function (mode, arrayLimit) {
        if  (mode){
            if (mode == "ARRAY"){

                _mode = ARRAY_MODE;
                _localStorage = _localStorage || [];

            }else if (mode == "LOCAL_STORAGE"){

                _mode = LOCAL_STORAGE_MODE;
                _localStorage = kizzy('Elstr');

            }else{

                ElstrLog.error("Wrong 'mode' provided use: ARRAY | LOCAL_STORAGE");

            }
        }

        if (arrayLimit){
            if (arrayLimit>0){
                _arrayLimit = arrayLimit;
            }else{
                ElstrLog.error("Wrong 'arrayLimit' provided should be >0 ");
            }

        }

    },

    /**
     * Returns true if the cache contains a key and false if not.
     * Removes the element from the cache if it has expired.
     * @param key
     * @returns {boolean}
     */
    contains : function(key){

        if (_mode === LOCAL_STORAGE_MODE){

            // Has no contain method
            return (_localStorage.get(key) !== null);

        }else if (_mode === ARRAY_MODE){

            var contained =  key in _data;

            // Check if we have it in the cache.
            if (contained){

                // We have the data in the array
                // Then we have to check the timestamp.

                var timeToExpire = _data[key]._timeToExpire;

                if (timeToExpire){

                    var d = new Date();
                    var time = d.getTime();

                    // The data was there, but outdated.
                    if (timeToExpire < time){

                        ElstrCache.cleanEntry(key);
                        contained = false;

                    }
                }
            }

            return contained;

        }else{

            ElstrLog.error("Wrong mode.");
            return;

        }


    },

    /**
     * Gets a value from the cache if it exists.
     * Return null if not.
     * @param key
     * @returns {*}
     */
    get : function(key){

        if (_mode === LOCAL_STORAGE_MODE){

            return _localStorage.get(key);

        }else if (_mode === ARRAY_MODE){

            if (ElstrCache.contains(key)){
                return _data[key]._value;
            }else{
                return null;
            }

        }else{

            ElstrLog.error("Wrong mode.");

        }
    },

    /**
     * Sets a value in the cache.
     * @param key
     * @param value
     * @param timeToExpire milisecons while the value is active.
     */
    set : function(key, value, timeToExpire){

        if (_mode === LOCAL_STORAGE_MODE){

            _localStorage.set(key, value, timeToExpire);

        }else if (_mode === ARRAY_MODE){

            var entry = {
                _value: value,
                _timeToExpire: null
            }

            if (timeToExpire){

                var d = new Date();
                var time = d.getTime() + timeToExpire;
                entry._timeToExpire = time;

            }

            _data[key] = entry._value;

            if (_arrayLimit>0){
                if (_data.length > _arrayLimit){
                    delete _data[0];
                }
            }

        }else{

            ElstrLog.error("Wrong mode.");

        }



    },

    /**
     * Cleans an specific entry in the cache.
     * @param key
     */
    cleanEntry : function(key){

        if (_mode === LOCAL_STORAGE_MODE){

            _localStorage.remove(key);

        }else if (_mode === ARRAY_MODE){

            delete _data[key];

        }else{

            ElstrLog.error("Wrong mode.");

        }

    },

    /**
     * Cleans the full cache
     */
    cleanCache : function(){

        if (_mode === LOCAL_STORAGE_MODE){

            _localStorage.clear();

        }else if (_mode === ARRAY_MODE){

            _data = [];

        }else{

            ElstrLog.error("Wrong mode.");

        }

    },

    /**
     * Clean all the expired cache entries.
     */
    cleanExpireds : function(){

        if (_mode === LOCAL_STORAGE_MODE){

            _localStorage.clearExpireds();

        }else if (_mode === ARRAY_MODE){

            for (var k in _data) {

                this.contains(k);

            }

        }else{

            _data = [];

        }

    }
}




module.exports = ElstrCache;
