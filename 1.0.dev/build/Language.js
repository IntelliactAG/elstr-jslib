// Create the Namespace for the Framework
if (ELSTR === undefined) {
	var ELSTR = {};
}

/**
 * Die Language Klasse regelt den Umgang mit Sprachen in einer Webapplikation
 * 
 * Beispiel eines Widgets/Markups im HTML. Die Liste (UL) muss die Klasse
 * 'languageSelection' haben Die im Frontend gerenderte Sprache wird mit der
 * Klasse 'elstr_lang_selected' markiert
 * <ul class="languageSelection">
 *     <li name="de"> Deutsch </li>
 *     <li name="en"> English </li>
 * </ul>
 * 
 * To use this component the following YUI components ar required YUI
 * components: ["dom","event","datasource","json","dialog"]
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2009
 * @namespace ELSTR
 * @class ELSTR.Language
 * @alias ElstrLanguage
 * @classDescription Language handling for Elstr applications
 * @constructor
 */
ELSTR.Language = function(){

	// ///////////////////////////////////////////////////////////////
	// Declare all language variables
	var widgetElement,
	currentLanguage = null,
	currentIsLoaded = false,
	datasource,
	textFrontend = [],
	visibleAlertMessages = [],
	file,
	serviceUrl;

	var YEvent = YAHOO.util.Event,
	YDom = YAHOO.util.Dom,
	YCustomEvent = YAHOO.util.CustomEvent;
      

	// Member Variabless
	var that = this;
    
	// ////////////////////////////////////////////////////////////
	// Event Declarations
	that.onAfterInitEvent = new YCustomEvent("afterInitEvent", this);
    
	that.onAfterLoadEvent = new YCustomEvent("afterLoadEvent", this);
	that.onBeforeLoadEvent = new YCustomEvent("beforeLoadEvent", this);
    
	that.onAfterChangeEvent = new YCustomEvent("afterChangeEvent", this);
	that.onBeforeChangeEvent = new YCustomEvent("beforeChangeEvent", this);
    
    
	// ////////////////////////////////////////////////////////////
	// Public functions
    
	/**
	 * Initialisiert das Sprachenobjekt
	 * 
	 * @method init
	 * @param {String}
	 *            serviceUrl The url to service to load a language
	 * @param {String/Object}
	 *            resource string->The path with filename to the translation
	 *            file on backend object->ELSTR.applicationData.language
	 * @param {Boolean}
	 *            drawOnLoaded True, if the initial loaded language will be
	 *            applied
	 * @param {Function}
	 *            fnInitComplete Callback function that is executed when the
	 *            initialisation ist completed and the language is loaded
	 * @return {Boolean} True, if the values were valid
	 */
	this.init = function(serviceUrl, resource, drawOnLoaded, fnInitComplete){

		// THis mehtods causes a but in IE with Tabviews
                _renderLanguageSelection(resource);

		// Die als elstr_lang_selected markierte Sprache laden
		if (serviceUrl !== undefined && resource !== undefined) {
            
			datasource = new YAHOO.util.XHRDataSource(serviceUrl);
			datasource.connMethodPost = true;
			datasource.responseType = YAHOO.util.DataSource.TYPE_JSON;
			datasource.maxCacheEntries = 3;
			datasource.responseSchema = {
				resultsList: "result"
			};
            
			var callbackLoad = function(){
				if (drawOnLoaded) {
					_draw();
				}
				that.onAfterInitEvent.fire();
                
				if (YAHOO.lang.isFunction(fnInitComplete)) {
					fnInitComplete();
				}
			};
            
			if(YAHOO.lang.isString(resource)){
				file = resource;
				_loadLanguage(_getCurrentLanguage(), callbackLoad);
			} else {
				file = "";
				_loadLanguageObject(resource, callbackLoad);
			}
            
			return true;
		}
		else {
			return false;
		}
	};
    
    
	/**
	 * Gibt eine Meldung in der geladenen Sprache aus List of priorities error
	 * warning info tip help
	 * 
	 * @method alert
	 * @param {String}
	 *            priority The priority of the alert Message (error, warning, info, tip, help)
	 * @param {String}
	 *            textid The id of the text in the TMX-File OR The text of the message
	 * @param {String or Dom-element}
	 * 			  element id of a dom element or the dom element. if set, the message is rendered into the specified element
	 * @return {Boolean} True
	 */
	this.alert = function(priority, textid, element){
		var showMessage = function(priority, textid, element){
			if(YAHOO.lang.isUndefined(element)){
				_alertMessage(priority, textid);
			} else {
				_renderMessage(priority, textid, element);
			}
		};
		if (currentIsLoaded === true) {
			showMessage(priority, textid, element);
		}
		else {
			var subscribedAlertMessage = function(){
				showMessage(priority, textid, element);
				that.onAfterLoadEvent.unsubscribe(subscribedAlertMessage);
			};
			that.onAfterLoadEvent.subscribe(subscribedAlertMessage);
		}
		return true;
	};
    
    
	/**
	 * Gibt den Text in der geladenen Sprache zurueck
	 * 
	 * @method alert
	 * @param {String}
	 *            textid The id of the text in the TMX-File OR The text of the
	 *            message
	 * @return {String} The (translated) text in the current language OR
	 *         undefined, if the textid does not exist
	 */
	this.text = function(textid){
		var messageText;
		if (currentIsLoaded === true) {
			messageText = textFrontend[textid];
		}
		else {
			if (textFrontend[textid]) {
				messageText = textFrontend[textid];
			}
			else {
				messageText = undefined;
			}
		}
		return messageText;
	};
    
    
	/**
	 * Changes the Frontend Language
	 * 
	 * @method change
	 * @param {String}
	 *            lang The new language to be loaded (e.g. "de" or "en")
	 * @return {Boolean} True
	 */
	this.change = function(lang){
		that.onBeforeChangeEvent.fire(lang);
		var callbackLoad = function(){
			_draw();
			_drawLanguageSelection();
			that.onAfterChangeEvent.fire(lang);
		};
		_loadLanguage(lang, callbackLoad);
		return true;
	};
    
    
	/**
	 * Gibt die aktuelle Sprache zurueck
	 * 
	 * @method language
	 * @return {String} The current language
	 */
	this.language = function(){
		var lang = _getCurrentLanguage();
		return lang;
	};

	/**
	 * Changes the Frontend Language
	 * 
	 * @method registerModules
	 * @param {String} module The new module to be registered
	 * @param {function}
	 *            fnRegisterComplete Callback function after all newly
	 *            registered modules are loaded
	 * @return {Boolean} True
	 */
	this.registerModule = function(module, fnRegisterComplete){
		_registerModule(module,function(){
			var callbackLoad = function(){
				if (YAHOO.lang.isFunction(fnRegisterComplete)) {
					fnRegisterComplete();
				}
			};
			var lang = _getCurrentLanguage();
			_loadLanguage(lang, callbackLoad);
		});
	};
    
	this.currentIsLoaded = function(){
		return currentIsLoaded
	}
    
	// ////////////////////////////////////////////////////////////
	// Private functions
    
	var _getLanguageSelectionElements = function(){
		// widgetElement ist das UL-Element mit der Klasse languageSelection
		widgetElement = YDom.getElementsByClassName("languageSelection", "ul")[0];
        
		var selectionElements = YDom.getElementsBy(function(){
			return true;
		}, "li", widgetElement);
        
		return selectionElements;
	};
    
	var _renderLanguageSelection = function(resource){
		var currentLang;
		if (resource !== undefined){
			currentLang = resource.current;
		}

		var selectionElements = _getLanguageSelectionElements();
		var onClickUpdateLanguage = function(){
			if (!YDom.hasClass(this, "elstr_lang_selected")) {
				var lang = this.getAttribute("name");
				that.change(lang);
			}
		};
        
		for (var i = 0,len = selectionElements.length; i < len; i++) {
			YEvent.addListener(selectionElements[i], "click", onClickUpdateLanguage);

			// Remove any elstr_lang_selected
			YDom.removeClass(selectionElements[i],"elstr_lang_selected");
			// Add elstr_lang_selected class to current language
			if(selectionElements[i].getAttribute("name") == currentLang){
				YDom.addClass(selectionElements[i],"elstr_lang_selected");
			}

		}  
	};
    
	var _drawLanguageSelection = function(){
    
		var selectionElements = _getLanguageSelectionElements();
        
		for (var i = 0; i < selectionElements.length; i++) {
			YDom.removeClass(selectionElements[i], "elstr_lang_selected");
            
			if (selectionElements[i].getAttribute("name") == currentLanguage) {
				YDom.addClass(selectionElements[i], "elstr_lang_selected");
			}
		}
	};
    
	var _getCurrentLanguage = function(){
		if (currentLanguage === null) {
			var selectedLiElement = YDom.getElementsByClassName("elstr_lang_selected", "li", widgetElement)[0];
			currentLanguage = selectedLiElement.getAttribute("name");
		}
		return currentLanguage;
	};
    
    
	var _registerModule = function(module, fnLoadComplete){
        
		var callback = {
        
			// if our XHR call is successful, we want to make use
			// of the returned data and create child nodes.
			success: function(oRequest, oParsedResponse, oPayload){
				oPayload.fnLoadComplete();
			},
			failure: function(oRequest, oParsedResponse, oPayload){
				ELSTR.error.requestFailure(oRequest, oParsedResponse, oPayload);
				oPayload.fnLoadComplete();
			},
            
			argument: {
				"fnLoadComplete": fnLoadComplete
			}
		};
        
		var oRequestPost = {
			"jsonrpc": "2.0",
			"method": "registerModule",
			"params": {
				"module": module
			},
			"id": 1
		};
        
		datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost), callback);
	};
    
    
	var _loadLanguage = function(lang, fnLoadComplete){
    
		// Event nach dem Laden
		that.onBeforeLoadEvent.fire();
        
		currentIsLoaded = false;
		var callback = {
        
			// if our XHR call is successful, we want to make use
			// of the returned data and create child nodes.
			success: function(oRequest, oParsedResponse, oPayload){
            
				textFrontend = oParsedResponse.results[0];
                
				currentIsLoaded = true;
				currentLanguage = lang;
                
				// Event nach dem Laden
				that.onAfterLoadEvent.fire();
                
				oPayload.fnLoadComplete();
			},
			failure: function(oRequest, oParsedResponse, oPayload){
				ELSTR.error.requestFailure(oRequest, oParsedResponse, oPayload);
				oPayload.fnLoadComplete();
			},
            
			argument: {
				"fnLoadComplete": fnLoadComplete
			}
		};
        
		var oRequestPost = {
			"jsonrpc": "2.0",
			"method": "load",
			"params": {
				"file": file,
				"lang": lang
			},
			"id": 1
		};
        
		datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost), callback);
	};

	var _loadLanguageObject = function(resource, fnLoadComplete){
		// Event nach dem Laden
		that.onBeforeLoadEvent.fire();
        
		currentIsLoaded = false;
		textFrontend = resource.translations;
		currentIsLoaded = true;
		currentLanguage = resource.current;
        
		// Event nach dem Laden
		that.onAfterLoadEvent.fire();
        
		fnLoadComplete();
	};
    
    
	var _draw = function(fnDrawComplete){
		// Was ist ein Text-Element?
		var isTextElement = function(el){
			if (el.getAttribute('textid') != null) {
				return true;
			}
			else {
				return false;
			}
		};
		// Alle Text-Elemente finden
		var textElements = YDom.getElementsBy(isTextElement);
		for (var i = 0, len = textElements.length; i < len; i++) {
			var index = textElements[i].getAttribute('textid');
			textElements[i].innerHTML = textFrontend[index];
		}        
	};
    
	// Meldung in der geladenen Sprache ausgeben (Meldung auf UI)
	var _alertMessage = function(priority, key){
		// Die Handler fuer das Meldungsfenster initialisieren
		var handleOk = function(){
			this.hide();
		};
        
		var destroyPanel = function(){
			// Element aus der Liste der Meldungen entferenen
			for (var i = 0, len = visibleAlertMessages.length; i < len ; i++) {
				if (visibleAlertMessages[i] == this.id) {
					visibleAlertMessages.splice(i, 1);
				}
			}
			this.destroy();
		};
        
		// Die Parameter fuer das Meldungsfenster initialisieren
		var messageId = YDom.generateId('', 'elstrLanguage'),
		coordY = YDom.getViewportHeight() / 2 - 100 + (visibleAlertMessages.length * 60),
		coordX = YDom.getViewportWidth() / 2 - 150;
        
		// Das Meldungsfenster initialisieren
		var dialogAlertMessage = new YAHOO.widget.SimpleDialog(messageId, {
			width: "300px",
			xy: [coordX, coordY],
			visible: false,
			draggable: true,
			close: true,
			underlay: "matte",
			iframe: true,
			zindex: 900,
			icon: YAHOO.widget.SimpleDialog.ICON_HELP,
			constraintoviewport: true,
			effect: {
				effect: YAHOO.widget.ContainerEffect.FADE,
				duration: 0.25
			},
			buttons: [{
				text: "Ok",
				handler: handleOk,
				isDefault: true
			}]
		});
        
		var messageText = "";
		if (textFrontend[key]) {
			messageText = "<div textid='" + key + "'>" + textFrontend[key] + "</div>";
		}
		else {
			messageText = key;
		}
        
		var icon = YAHOO.widget.SimpleDialog.ICON_HELP;
		if (priority === 'error') {
			icon = YAHOO.widget.SimpleDialog.ICON_BLOCK;
		}
		if (priority === 'warning') {
			icon = YAHOO.widget.SimpleDialog.ICON_WARN;
		}
		if (priority === 'info') {
			icon = YAHOO.widget.SimpleDialog.ICON_INFO;
		}
		if (priority === 'tip') {
			icon = YAHOO.widget.SimpleDialog.ICON_TIP;
		}
		if (priority === 'help') {
			icon = YAHOO.widget.SimpleDialog.ICON_HELP;
		}
        
		dialogAlertMessage.setHeader(priority.toUpperCase());
		dialogAlertMessage.cfg.queueProperty('icon', icon);
		dialogAlertMessage.cfg.queueProperty('text', messageText);
		dialogAlertMessage.hideEvent.subscribe(destroyPanel);
		dialogAlertMessage.render(document.body);
		dialogAlertMessage.show();
		dialogAlertMessage.bringToTop();
        
		// Element in die Liste der Meldungen eintragen
		visibleAlertMessages[visibleAlertMessages.length] = messageId;        
	};
    
	var _renderMessage = function(priority, key, elMessageContainer){
		var elMessage,
		messageText = "";

		if (textFrontend[key]) {
			messageText = "<div textid='" + key + "'>" + textFrontend[key] + "</div>";
		}
		else {
			messageText = key;
		}
        
		if (typeof elMessageContainer == "string") {
			elMessageContainer = document.getElementById(elMessageContainer);
		}
        
		elMessage = document.createElement("div");
		elMessageContainer.appendChild(elMessage);
        
		YDom.addClass(elMessage, priority);
		elMessage.innerHTML = messageText;
	};
};

