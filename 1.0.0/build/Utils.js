// Create the Namespace for the Framework
if (ELSTR == undefined) {
	var ELSTR = new Object();
};

/**
 * Die Utils Klasse beinhaltet einige Shortcuts fuer Funktionen
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2009
 * @namespace ELSTR
 * @class ELSTR.Utils
 * @alias ElstrUtils
 * @classDescription Sugar for Elstr applications
 * @constructor
 */
ELSTR.Utils = {

	/**
	 * Generate a random uuid.
	 * Modified script from: http://www.broofa.com/Tools/Math.uuid.js
	 * @return string (RFC4122, version 4 ID)
	 */
	uuid : function() {
		// Private array of chars to use
		var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
				.split('');

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
	 * @param dom-node
	 */
	clearChilds : function(el) {
		if (el.childNodes) {
			while (el.hasChildNodes()) {
				el.removeChild(el.firstChild);
			}
		}
	},
	/**
	 * Public mehtod for showing a wating cursor
	 * 
	 * Needs a CSS Class .cursorWait - Example:
	 * .cursorWait {
	 * 		cursor: wait;
	 * }
	 * 
	 */	
	cursorWait : {
		show : function() {	
			if (YAHOO.util.Dom.hasClass(document.body,"cursorWait") == false){
				YAHOO.util.Dom.addClass(document.body,"cursorWait");
			}			
		},
		hide : function() {			
			if (YAHOO.util.Dom.hasClass(document.body,"cursorWait") == true){
				YAHOO.util.Dom.removeClass(document.body,"cursorWait");
			}
		}
	},

	// public method for url encoding
	utf8_encode : function(string) {
		return escape(this._utf8_encode(string));
	},

	// public method for url decoding
	utf8_decode : function(string) {
		return this._utf8_decode(unescape(string));
	},
	// private method for UTF-8 encoding
	_utf8_encode : function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for ( var n = 0; n < string.length; n++) {
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
	_utf8_decode : function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
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
				string += String.fromCharCode(((c & 15) << 12)
						| ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}
		return string;
	}
}