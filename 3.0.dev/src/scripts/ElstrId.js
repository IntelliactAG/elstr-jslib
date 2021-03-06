"use strict";
/**
 * Created by egli on 02.12.2014.
 */

var ElstrLog = require("./ElstrLog");

/**
 * Private
 */

var _generatedIds = {}; // Only for the createDocumentUnique Method.


/**
 * This is the class for generating ids
 *
 * @class ElstrId
 */
var ElstrId =  {
    /**
     * Generate a random uuid. Modified script from:
     * http://www.broofa.com/Tools/Math.uuid.js
     *
     * @return string (RFC4122, version 4 ID)
     */
    create: function() {
        // Private array of chars to use
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var chars = CHARS,
            uuid = [];

        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high bits of clock
        // sequence as
        // per rfc4122, sec. 4.1.5
        for (var i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    },

    /**
     * Generate a random uuid.
     * Checks that it was never used before in the same document
     *
     * @return string (RFC4122, version 4 ID)
     */
    createDocumentUnique: function(){
        var newUid = this.create();

        while (newUid in _generatedIds) {

            newUid = this.create();
            ElstrLog.error('ElstrId.createDocumentUnique: collision found with ' + newUid);

        }

        _generatedIds[newUid] = true;

        return newUid;

    }
};

module.exports = ElstrId;