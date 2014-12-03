/**
 * Created by sahun on 02.12.2014.
 */

function ElstrCache(){

    // constructor
    this._data = [];
    this._timeToExpire = [];

}


ElstrCache.prototype = {

    /**
     * Returns true if the cache contains a key and false if not.
     * @param key
     * @returns {boolean}
     */
    contains : function(key){
        var contained =  key in this._data;

        // Check if we have it in the cache.
        if (contained){

            // We have the data in the array
            // Then we have to check the timestamp.

            var timeToExpire = this._timeToExpire[key];
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

    },

    /**
     * Gets a value from the cache if it exists.
     * Return null if not.
     * @param key
     * @returns {*}
     */
    get : function(key){
        if (ElstrCache.contains(key)){
            return this._data[key];
        }else{
            return null;
        }
    },

    /**
     * Sets a value in the cache.
     * @param key
     * @param value
     * @param timeToExpire milisecons while the value is active.
     */
    set : function(key, value, timeToExpire){
        this._data[key] = value;

        if (timeToExpire){

            var d = new Date();
            var time = d.getTime() + timeToExpire;
            this._timeToExpire[key] = time;

        }else{

            delete this._timeToExpire[key];

        }
    },

    /**
     * Cleans an specific entry in the cache.
     */
    cleanEntry : function(key){

        delete this._data[key];
        delete this._timeToExpire[key];

    },

    /**
     * Cleans the full cache
     */
    cleanCache : function(){

        this._data = [];
        this._timeToExpire = [];

    }

};


module.exports = ElstrCache;
