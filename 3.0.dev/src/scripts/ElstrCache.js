/**
 * Created by sahun on 02.12.2014.
 */

var ARRAY_MODE = 1;
var LOCAL_STORAGE_MODE = 2;

var ElstrLog = require("./ElstrLog");
var elstrLog = new ElstrLog({
    enabled: true
});

function ElstrCache(mode, arrayLimit){

    // constructor
    this._data = [];
    this._mode = ARRAY_MODE;


    if  (mode){
        if (mode == "ARRAY"){
            
            this._mode = ARRAY_MODE;

        }else if (mode == "LOCAL_STORAGE"){
            
            this._mode = LOCAL_STORAGE_MODE;
            require("../kizzy/ElstrLog");     
            this._localStorage = kizzy('Elstr');

        }else{

            ElstrLog.error("Wrong 'mode' provided use: ARRAY | LOCAL_STORAGE");

        }
    }

    
    this._arrayLimit =  0;
    if (arrayLimit){
        if (arrayLimit>0){
            this._arrayLimit = arrayLimit;
        }else{
            ElstrLog.error("Wrong 'arrayLimit' provided should be >0 ");   
        }

    }

}


ElstrCache.prototype = {

    /**
     * Returns true if the cache contains a key and false if not.
     * Removes the element from the cache if it has expired.
     * @param key
     * @returns {boolean}
     */
    contains : function(key){

        if (this._mode === LOCAL_STORAGE_MODE){

            // Has no contain method
            return (this._localStorage.get(key) !== null); 

        }else if (this._mode === ARRAY_MODE){

            var contained =  key in this._data;

            // Check if we have it in the cache.
            if (contained){

                // We have the data in the array
                // Then we have to check the timestamp.

                var timeToExpire = this._data[key]._timeToExpire;

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

        if (this._mode === LOCAL_STORAGE_MODE){

            return this._localStorage.get(key); 

        }else if (this._mode === ARRAY_MODE){

            if (ElstrCache.contains(key)){
                return this._data[key]._value;
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

        if (this._mode === LOCAL_STORAGE_MODE){

            this._localStorage.set(key, value, timeToExpire); 

        }else if (this._mode === ARRAY_MODE){

            var entry = {
                _value: value,
                _timeToExpire: null
            }

            if (timeToExpire){

                var d = new Date();
                var time = d.getTime() + timeToExpire;
                entry._timeToExpire = time;

            }

            this._data[key] = entry._value;

            if (this._arrayLimit>0){
                if (this._data.length > this._arrayLimit){
                    delete this._data[0];
                }                
            }

        }else{

            ElstrLog.error("Wrong mode.");   

        }

        

    },

    /**
     * Cleans an specific entry in the cache.
     */
    cleanEntry : function(key){

        if (this._mode === LOCAL_STORAGE_MODE){

            this._localStorage.remove(key); 

        }else if (this._mode === ARRAY_MODE){

            delete this._data[key];

        }else{

            ElstrLog.error("Wrong mode.");   

        }

    },

    /**
     * Cleans the full cache
     */
    cleanCache : function(){

        if (this._mode === LOCAL_STORAGE_MODE){
            
            this._localStorage.clear();

        }else if (this._mode === ARRAY_MODE){

            this._data = [];

        }else{

            ElstrLog.error("Wrong mode.");   

        }

    },

    cleanExpireds : function(){

        if (this._mode === LOCAL_STORAGE_MODE){
            
            this._localStorage.clearExpireds();

        }else if (this._mode === ARRAY_MODE){

            for (var k in this._data) {

                this.contains(k);

            }

        }else{

            this._data = [];

        }

    }

};


module.exports = ElstrCache;
