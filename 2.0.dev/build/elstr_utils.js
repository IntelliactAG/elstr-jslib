/**
 * @author egli@intelliact.ch
 */

YUI.add('elstr_utils', function(Y) {
 
    // private properties or functions
    var console,
    // private method for UTF-8 encoding
    utf8_encode = function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for ( var n = 0, len = string.length; n < len; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    utf8_decode = function(utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };

    Y.namespace('ELSTR');
    Y.ELSTR.utils = {
        // public properties or functions
        
        /**
		 * Clones a literal object 
		 * 
		 * @return object 
		 */
        cloneObj : function (obj){
            if(obj === null || typeof(obj) != 'object'){
                return obj;
            }
            var clone = new obj.constructor();
            for(var key in obj){
                clone[key] = Y.ELSTR.utils.cloneObj(obj[key]);
            }
            return clone;
        },
        /**
		 * Generate a random uuid. Modified script from:
		 * http://www.broofa.com/Tools/Math.uuid.js
		 * 
		 * @return string (RFC4122, version 4 ID)
		 */
        uuid : function() {
            // Private array of chars to use
            var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var chars = CHARS, uuid = [];

            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock
            // sequence as
            // per rfc4122, sec. 4.1.5
            for ( var i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        },
        /**
		 * Public mehtod for clearing all chids in the dom tree
		 * 
		 * @param el: dom-node
		 */
        clearChilds : function(el) {
            // Use the empty method of the yui3 node module
            // Excample Y.one("#id").empty(true);
            while(el.firstChild) {
                el.removeChild(el.firstChild);
            }
        },
        /**
		 * Public mehtod for showing a wating cursor
		 * 
		 * Needs a CSS Class .cursorWait - Example: .cursorWait { cursor: wait; }
		 */
        cursorWait : {
            show : function() {
                if (!Y.one(document.body).hasClass("cursorWait")) {
                    Y.one(document.body).addClass("cursorWait");
                }
            },
            hide : function() {
                if (Y.one(document.body).hasClass("cursorWait")) {
                    Y.one(document.body).removeClass("cursorWait");
                }
            }
        },		
        // public method for url encoding
        utf8_encode : function(string) {
            return escape(utf8_encode(string));
        },
        // public method for url decoding
        utf8_decode : function(string) {
            return utf8_decode(unescape(string));
        },
        /**
		 * Check if it is a mobile device
		 *
		 * @method isMobile
		 */
        isMobile : function(){
            if(Y.UA.mobile !== null){
                //console.log(YAHOO.env.ua);
                return true;
            } else {
                return false;
            }
        },
        /**
		 * Log elstr (error) messages
		 * 
		 * @method loader
		 * @param {string} msg: message text
		 * @param {string} category: info, warn, error
		 * @param {string} source
		 */
        log : function(msg, category, source){
            var logMsg = msg;
            var logCategory = category;
            var logSource = source;								
            Y.use('console', function (Y) {
                if(Y.Lang.isUndefined(console)){
                    console = new Y.Console();
                    console.render();
                }
                Y.log(logMsg, logCategory,  logSource);
            });
        }
    }
 
}, '2.0' /* module version */, {
    requires: ['base','node','elstr_utilscss']
});