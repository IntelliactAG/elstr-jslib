
/**
 * @author egli
 */
// Cerate the Namespace for this application
if (ELSTR == undefined) {
    var ELSTR = new Object();
};


ELSTR.Language = function(){

    /////////////////////////////////////////////////////////////////
    // Declare all language variables
    var widgetElement;
    var currentLanguage = null;
    var currentIsLoaded = false;
    var datasource;
    var textFrontend = [];
    var visibleAlertMessages = [];
    
    var serviceUrl = '../getLanguage.php';
    
    
    
    // Member Variabless
    var that = this;
    
    // Event Declarations
    that.onAfterLoadEvent = new YAHOO.util.CustomEvent("afterLoadEvent", this);
    that.onBeforeLoadEvent = new YAHOO.util.CustomEvent("beforeLoadEvent", this);
    
    
    
    //////////////////////////////////////////////////////////////
    // Privileged functions
    
    // Funktion, um die Classe zu initialisieren
    this.init = function(){
        // Die als selected markierte Sprache laden
        
        
        _renderLanguageSelection();
        
        
        datasource = new YAHOO.util.XHRDataSource(serviceUrl);
        datasource.connMethodPost = true;
        datasource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        datasource.responseSchema = {
            resultsList: "result"
        };
        
        
        var callbackLoad = function(){
            // No action                       
        }
        
        _loadLanguage(_getCurrentLanguage(), callbackLoad);
        
    }
    
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
        
    }
    
    
    this.change = function(lang){
        var callbackLoad = function(){
            _draw();
        }
        _loadLanguage(lang, callbackLoad);
    }
    
    
    
    
    
    //////////////////////////////////////////////////////////////    
    // Private functions 
    
    var _renderLanguageSelection = function(){
        // widgetElement ist das UL-Element mit der Klasse languageSelection
        widgetElement = YAHOO.util.Dom.getElementsByClassName("languageSelection", "ul")[0];
        
        var selectionElements = YAHOO.util.Dom.getElementsBy(function(){
            return true;
        }, "li", widgetElement);
        
        
        var onClickUpdateLanguage = function(){
            if (!YAHOO.util.Dom.hasClass(this, "selected")) {
            
                var lang = this.getAttribute("name");
                that.change(lang);
                
                for (var i = 0; i < selectionElements.length; i++) {
                    YAHOO.util.Dom.removeClass (selectionElements[i], "selected");
                }
                
                YAHOO.util.Dom.addClass (this, "selected");
                
            }
        }
        
        for (var i = 0; i < selectionElements.length; i++) {
            YAHOO.util.Event.addListener(selectionElements[i], "click", onClickUpdateLanguage);
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
                "customer": "sulzersms",
                "file": "qbrowser",
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
        /*
         * priority        Priority of message        error
         *                                            warning
         *                                            info
         *                                            tip
         *                                            help
         * key             Key (textid) of message
         *
         * return          Objekt der Meldung
         */
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
            messageText = textFrontend[key];
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

