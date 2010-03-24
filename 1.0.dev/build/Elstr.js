/*******************************************************************************
 * This is the main Object of ELSTR Framework Here all
 * 
 * ToDo: Initially I inteded to use YUI 3.0 initialization style here, but for
 * now I'll keep it simple.
 */

// Build Namespaces
if (ELSTR == undefined) {
	var ELSTR = {};
};

ELSTR = {
	widget : {},
	/**
	 * Load application Data from the server
	 * 
	 * @method loadAppData
	 * @param {string}
	 *            appName Name of the Application
	 * @param {function}
	 *            fn Callback function
	 * @return {object} Object, where the appData ist loaded to
	 */
	loadAppData : function(appName, fn) {
		var oDataSource = new YAHOO.util.XHRDataSource(
				"services/ELSTR_ApplicationDataServer");
		oDataSource.connMethodPost = true;
		oDataSource.connMgr.setDefaultPostHeader(false);
		oDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
		oDataSource.responseSchema = {
			resultsList : "result"
		};

		var oCallback = {
			success : function(oRequest, oParsedResponse, oPayload) {

				ELSTR.applicationData = oParsedResponse.results[0];

				if (YAHOO.lang.isFunction(fn) == true) {
					fn();
				}

			},
			failure : function(oRequest, oParsedResponse, oPayload) {
				alert("Request failed!");

			},
			scope : {},
			argument : {}
		};

		var oRequestPost = {
			"jsonrpc" : "2.0",
			"method" : "load",
			"params" : {
				appName : appName
			},
			"id" : ELSTR.utils.uuid()
		};

		oDataSource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),
				oCallback);
	},
	/**
	 * Load js and css resources
	 * 
	 * @method loader
	 * @param {string}
	 *            type script or css
	 * @param {mixed}
	 *            url source-srting or array of strings
	 * @param {function}
	 *            fn Callback function
	 * @return {object} Object, where the appData ist loaded to
	 */
	loader : function(type, url, fn) {

		var requestUrl;
		if (YAHOO.lang.isArray(url) && type == "script" && LIBS.elstrCombine == true) {
			for ( var i = 0; i < url.length; i++) {
				if (i == 0) {
					requestUrl = 'jslib/elstr/' + LIBS.elstrVersion + '/build/jsLoader.php?file'+i+'=' + url[i];
				} else {
					requestUrl += '&file'+i+'=' + url[i];
				}
			}
		} else {
			requestUrl = url;
		}

		if (type == "script") {
			YAHOO.util.Get.script(requestUrl, {
				onSuccess : function(obj) {
					if (YAHOO.lang.isFunction(fn) == true) {
						fn();
					}
				}
			});
		}
		if (type == "css") {
			YAHOO.util.Get.css(requestUrl, {
				onSuccess : function(obj) {
					if (YAHOO.lang.isFunction(fn) == true) {
						fn();
					}
				}
			});
		}
	},
	utils : {
		/**
		 * Clones a literal object 
		 * 
		 * @return object 
		 */
		cloneObj : function (obj){
		  if(obj == null || typeof(obj) != 'object')
		      return obj;
		
		  var clone = new obj.constructor();
		  for(var key in obj)
			  clone[key] = ELSTR.utils.cloneObj(obj[key]);
		
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
			while(el.firstChild) {
			    el.removeChild(el.firstChild);
			}
			/*if (el.hasChildNodes()) {
				while (el.hasChildNodes()) {
					var elFirstChild = el.firstChild;
					ELSTR.utils.clearChilds(elFirstChild);
					el.removeChild(elFirstChild);					
				}
			}*/
		},
		/**
		 * Public mehtod for showing a wating cursor
		 * 
		 * Needs a CSS Class .cursorWait - Example: .cursorWait { cursor: wait; }
		 * 
		 */
		cursorWait : {
			show : function() {
				if (YAHOO.util.Dom.hasClass(document.body, "cursorWait") == false) {
					YAHOO.util.Dom.addClass(document.body, "cursorWait");
				}
			},
			hide : function() {
				if (YAHOO.util.Dom.hasClass(document.body, "cursorWait") == true) {
					YAHOO.util.Dom.removeClass(document.body, "cursorWait");
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
	},
	error : {
		requestFailure : function (oRequest, oResponse, oPayload, oDataSource, oCallback){
			//alert("Request failed!");
			//console.log(oParsedResponse);
			
			var status = oResponse.status;
			
			try {
			    var parsedResponse = YAHOO.lang.JSON.parse(oResponse.responseText);
			}
			catch (e) {
			    alert("Request failed!");
			    return;
			}
			 
			switch(status) {
			case 401:
				//console.log(status);
				
				var enterpriseApplication = parsedResponse.error.data.context;

				if (YAHOO.lang.isUndefined( ELSTR.user.enterpriseApplicationAuthEvent[enterpriseApplication] )){
					ELSTR.user.login(enterpriseApplication);
				}				
				ELSTR.user.enterpriseApplicationAuthEvent[enterpriseApplication].subscribe(function(type, args){
					oDataSource.sendRequest(oRequest, oCallback);
		        });			  
				//console.log(parsedResponse);
				//console.log(oDataSource);
				//console.log(oCallback);
			  break;
				
			default:
				alert("Request failed!");
			}
			

			
		}
	}
}
