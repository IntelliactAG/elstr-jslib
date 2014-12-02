/**
 * Created by sahun on 02.12.2014.
 */

function ElstrCache(){};

ElstrCache.data = [];
ElstrCache.timeToExpire = [];

/**
 * Returns true if the cache contains a key and false if not.
 * @param key
 * @returns {boolean}
 */
ElstrCache.contains = function(key){
    var contained =  key in ElstrCache.data;

    // Check if we have it in the cache.
    if (contained){

        // We have the data in the array
        // Then we have to check the timestamp.

        var timeToExpire = ElstrCache.timeToExpire[key];
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

}

/**
 * Gets a value from the cache if it exists.
 * Return null if not.
 * @param key
 * @returns {*}
 */
ElstrCache.get = function(key){
    if (ElstrCache.contains(key)){
        return ElstrCache.data[key];
    }else{
        return null;
    }
}

/**
 * Sets a value in the cache.
 * @param key
 * @param value
 * @param timeToExpire milisecons while the value is active.
 */
ElstrCache.set = function(key, value, timeToExpire){
    ElstrCache.data[key] = value;

    if (timeToExpire){

        var d = new Date();
        var time = d.getTime() + timeToExpire;
        ElstrCache.timeToExpire[key] = time;

    }else{

        delete ElstrCache.timeToExpire[key];

    }
}

/**
 * Cleans an specific entry in the cache.
 */
ElstrCache.cleanEntry = function(key){

    delete ElstrCache.data[key];
    delete ElstrCache.timeToExpire[key];

}

/**
 * Cleans the full cache
 */
ElstrCache.cleanCache = function(){

    ElstrCache.data = [];
    ElstrCache.timeToExpire = [];

}

module.exports = ElstrCache;
