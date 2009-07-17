
// Create the Namespace for the Framework
if (ELSTR == undefined) {
    var ELSTR = new Object();
};

/**
 * Die Language Klasse regelt den Umgang mit Sprachen in einer Webapplikation
 * 
 * Beispiel eines Widgets/Markups im HTML. 
 * Die Liste (UL) muss die Klasse 'languageSelection' haben
 * Die im Frontend gerenderte Sprache wird mit der Klasse 'selected' markiert
 *  <ul class="languageSelection">
 *      <li class="selected" name="de">
 *          Deutsch 
 *      </li>
 *      <li name="en">
 *          English 
 *      </li>
 *  </ul>
 *  
 * Damit diese Komponente verwendet werden kann, muessen folgende Komponenten der YUI geladen sein
 * requires: ["dom","event","datasource","json","dialog"]
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

    /////////////////////////////////////////////////////////////////
    // Declare all language variables
    var widgetElement;
    var currentLanguage = null;
    var currentIsLoaded = false;
    var datasource;
    var textFrontend = [];
    var visibleAlertMessages = [];
    var file;
    var serviceUrl;
    

    // Member Variabless
    var that = this;
    
    //////////////////////////////////////////////////////////////
    // Event Declarations
    that.onAfterInitEvent = new YAHOO.util.CustomEvent("afterInitEvent", this);
    
    that.onAfterLoadEvent = new YAHOO.util.CustomEvent("afterLoadEvent", this);
    that.onBeforeLoadEvent = new YAHOO.util.CustomEvent("beforeLoadEvent", this);
    
    that.onAfterChangeEvent = new YAHOO.util.CustomEvent("afterChangeEvent", this);
    that.onBeforeChangeEvent = new YAHOO.util.CustomEvent("beforeChangeEvent", this);
    
    
    //////////////////////////////////////////////////////////////
    // Public functions
    
    /**
     * Initialisiert das Sprachenobjekt
     * @method init
     * @param {String} serviceUrl The url to service to load a language
     * @param {String} filename The path with filename to the translation file on backend
     * @param {Boolean} drawOnLoaded True, if the initial loaded language will be applied
     * @param {Function} fnInitComplete Callback function that is executed when the initialisation ist completed and the language is loaded
     * @return {Boolean} True, if the values were valid
     */
    this.init = function(serviceUrl, filename, drawOnLoaded, fnInitComplete){

        // Die als selected markierte Sprache laden
        if (serviceUrl && serviceUrl !== undefined && filename && filename !== undefined) {
            file = filename;
            
            _renderLanguageSelection();
            
            datasource = new YAHOO.util.XHRDataSource(serviceUrl);
            datasource.connMethodPost = true;
            datasource.responseType = YAHOO.util.DataSource.TYPE_JSON;
            datasource.maxCacheEntries = 3;
            datasource.responseSchema = {
                resultsList: "result"
            };
            
            var callbackLoad = function(){
                if (drawOnLoaded == true) {
                    _draw();
                }
                that.onAfterInitEvent.fire();
                
                if (YAHOO.lang.isFunction(fnInitComplete) == true) {
                    fnInitComplete();
                }
            }
            
            _loadLanguage(_getCurrentLanguage(), callbackLoad);
            
            return true;
        }
        else {
            return false;
        }
    }
    
    
    /**
     * Gibt eine Meldung in der geladenen Sprache aus
     * List of priorities                         error
     *                                            warning
     *                                            info
     *                                            tip
     *                                            help
     *
     * @method alert
     * @param {String} priority The priority of the alert Message (error, warning, info, tip, help)
     * @param {String} textid The id of the text in the TMX-File OR The text of the message
     * @return {Boolean} True
     */
    this.alert = function(priority, textid){
        if (currentIsLoaded === true) {
            _alertMessage(priority, textid);
        }
        else {
        
            var subscribedAlertMessage = function(){
                _alertMessage(priority, textid);
                that.onAfterLoadEvent.unsubscribe(subscribedAlertMessage);
            }
            that.onAfterLoadEvent.subscribe(subscribedAlertMessage);
        }
        return true;
    }
    
    
    /**
     * Gibt den Text in der geladenen Sprache zurueck
     * @method alert
     * @param {String} textid The id of the text in the TMX-File OR The text of the message
     * @return {String} The (translated) text in the current language OR undefined, if the textid does not exist
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
    }
    
    
    /**
     * Changes the Frontend Language
     * @method change
     * @param {String} lang The new language to be loaded (e.g. "de" or "en")
     * @return {Boolean} True
     */
    this.change = function(lang){
        that.onBeforeChangeEvent.fire(lang);
        var callbackLoad = function(){
            _draw();
            _drawLanguageSelection();
            that.onAfterChangeEvent.fire(lang);
        }
        _loadLanguage(lang, callbackLoad);
        return true;
    }
    
    
    /**
     * Gibt die aktuelle Sprache zurueck
     * @method language
     * @return {String} The current language
     */
    this.language = function(){
        var lang = _getCurrentLanguage()
        return lang;
    }
    
    
    
    //////////////////////////////////////////////////////////////    
    // Private functions 
    
    var _getLanguageSelectionElements = function(){
        // widgetElement ist das UL-Element mit der Klasse languageSelection
        widgetElement = YAHOO.util.Dom.getElementsByClassName("languageSelection", "ul")[0];
        
        var selectionElements = YAHOO.util.Dom.getElementsBy(function(){
            return true;
        }, "li", widgetElement);
        
        return selectionElements;
    }
    
    var _renderLanguageSelection = function(){
    
        var selectionElements = _getLanguageSelectionElements();
        
        var onClickUpdateLanguage = function(){
            if (!YAHOO.util.Dom.hasClass(this, "selected")) {
            
                var lang = this.getAttribute("name");
                that.change(lang);
                
                /*
                 for (var i = 0; i < selectionElements.length; i++) {
                 YAHOO.util.Dom.removeClass(selectionElements[i], "selected");
                 }
                 
                 YAHOO.util.Dom.addClass(this, "selected");
                 */
            }
        }
        
        for (var i = 0; i < selectionElements.length; i++) {
            YAHOO.util.Event.addListener(selectionElements[i], "click", onClickUpdateLanguage);
        }
        
    }
    
    var _drawLanguageSelection = function(){
    
        var selectionElements = _getLanguageSelectionElements();
        
        for (var i = 0; i < selectionElements.length; i++) {
            YAHOO.util.Dom.removeClass(selectionElements[i], "selected");
            
            if (selectionElements[i].getAttribute("name") == currentLanguage) {
                YAHOO.util.Dom.addClass(selectionElements[i], "selected");
            }
        }               
    }
    
    var _getCurrentLanguage = function(){
        if (currentLanguage == null) {
            var selectedLiElement = YAHOO.util.Dom.getElementsByClassName("selected", "li", widgetElement)[0];
            currentLanguage = selectedLiElement.getAttribute("name");
        }
        return currentLanguage;
    }
    
    var _loadLanguage = function(lang, fnLoadComplete){
    
        // Event nach dem Laden
        that.onBeforeLoadEvent.fire();
        
        currentIsLoaded = false;
        
        var callback = {
        
            //if our XHR call is successful, we want to make use
            //of the returned data and create child nodes.
            success: function(oRequest, oParsedResponse, oPayload){
            
                textFrontend = oParsedResponse.results[0];
                
                currentIsLoaded = true;
                currentLanguage = lang;
                
                // Event nach dem Laden
                that.onAfterLoadEvent.fire();
                
                oPayload.fnLoadComplete();
            },
            failure: function(oRequest, oParsedResponse, oPayload){
                alert("Request failed!");
                oPayload.fnLoadComplete();
            },
            
            argument: {
                "fnLoadComplete": fnLoadComplete
            }
        };
        
        var oRequestPost = {
            "jsonrpc": "2.0",
            "method": "get",
            "params": {
                "file": file,
                "lang": lang
            },
            "id": 1
        };
        
        datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost), callback);
    }
    
    var _draw = function(fnDrawComplete){
        // Was ist ein Text-Element?
        var isTextElement = function(el){
            if (el.getAttribute('textid') != null) {
                return true;
            }
            else {
                return false;
            }
        }
        // Alle Text-Elemente finden
        var textElements = YAHOO.util.Dom.getElementsBy(isTextElement);
        for (var i = 0; i < textElements.length; i++) {
            var index = textElements[i].getAttribute('textid');
            textElements[i].innerHTML = textFrontend[index]
        }
        
    }
    
    // Meldung in der geladenen Sprache ausgeben (Meldung auf UI)
    var _alertMessage = function(priority, key){
        // Die Handler fuer das Meldungsfenster initialisieren
        var handleOk = function(){
            this.hide();
        };
        
        var destroyPanel = function(){
            // Element aus der Liste der Meldungen entferenen
            for (var i = 0; i < visibleAlertMessages.length; i++) {
                if (visibleAlertMessages[i] == this.id) {
                    visibleAlertMessages.splice(i, 1);
                }
            }
            this.destroy();
        }
        
        // Die Parameter fuer das Meldungsfenster initialisieren
        var messageId = YAHOO.util.Dom.generateId('', 'elstrLanguage');
        
        var coordY = YAHOO.util.Dom.getViewportHeight() / 2 - 100 + (visibleAlertMessages.length * 60);
        var coordX = YAHOO.util.Dom.getViewportWidth() / 2 - 150;
        
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
            var icon = YAHOO.widget.SimpleDialog.ICON_BLOCK;
        }
        if (priority === 'warning') {
            var icon = YAHOO.widget.SimpleDialog.ICON_WARN;
        }
        if (priority === 'info') {
            var icon = YAHOO.widget.SimpleDialog.ICON_INFO;
        }
        if (priority === 'tip') {
            var icon = YAHOO.widget.SimpleDialog.ICON_TIP;
        }
        if (priority === 'help') {
            var icon = YAHOO.widget.SimpleDialog.ICON_HELP;
        }
        
        dialogAlertMessage.setHeader(priority.toUpperCase());
        dialogAlertMessage.cfg.queueProperty('icon', icon);
        dialogAlertMessage.cfg.queueProperty('text', messageText);
        dialogAlertMessage.hideEvent.subscribe(destroyPanel);
        dialogAlertMessage.render(document.body);
        dialogAlertMessage.show();
        dialogAlertMessage.bringToTop()
        
        // Element in die Liste der Meldungen eintragen
        visibleAlertMessages[visibleAlertMessages.length] = messageId;
        
    }
    
}

