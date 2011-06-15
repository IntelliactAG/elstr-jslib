/**
 * Text and language handling for Elstr applications
 * 
 * MARKUP examples
 * 
 * Required for language selection
 * Current language has the class selected 
 * <ul class="languageSelection">
 *     <li name="de"> Deutsch </li>
 *     <li name="en"> English </li>
 * </ul>
 *  
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2011
 */

YUI.add('elstr_lang', function (Y) {
    Y.namespace('ELSTR').Lang = Y.Base.create('elstr_lang', Y.Widget, [], {
                
        //
        // WIDGET FUNCTIONS
        //

        initializer: function () {           
            // Init the language object from DOM
            if (Y.Lang.isObject(ELSTR.applicationData.language)) {
                this._set("currentLanguage",ELSTR.applicationData.language.current);
                this._set("loadedModules",ELSTR.applicationData.language.modules);
                this._textFrontend = ELSTR.applicationData.language.translations;		
                ELSTR.applicationData.language = "empty after reading it to the language widget";
            } 
              
            // TODO: implement correct auth handling
            Y.on('elstr_auth:successfulLogout', this._onSuccessfulLogout);  
            Y.on('elstr_auth:successfulAuth', this._onSuccessfulAuth);  
            if (this.get("forceAuthentication") === true && this.get("isAuth") === false) {
                this._login();
            }
        },

        destructor: function () {
            // Remove all click listeners
            this.get('contentBox').purge(true);
        },

        renderUI: function () {            
        // Always loaded from markup
        // E.g. srcNode:"#loginHandler"
        },

        bindUI: function () {
            var that = this;
            var contentBox = this.get('contentBox');
            contentBox.all("li").on("click", function(e) {
                if(e.target.hasClass("selected") === false){
                    that.change(e.target.getAttribute("name"));
                }
            });
        },

        syncUI: function () {
            this._updateLanguageSelection();
        },
    
        //
        // PUBLIC FUNCTIONS
        //

        /**
         * Gibt eine Meldung in der geladenen Sprache aus List of priorities error
         * warning info tip help
         * 
         * @method alert
         * @param {String} priority The priority of the alert Message (error, warning, info, tip, help)
         * @param {String} textid The id of the text in the TMX-File OR The text of the message
         * @return {Boolean} True
         */
        message : function(textid, priority){  
            var that = this;
            // Show an message overlay
            Y.use('elstr_message',function(Y){
                var message = new Y.ELSTR.Message({
                    message : that.text(textid),
                    priorty : priority,
                    visible:true,
                    centered:true,
                    width:that.get("messageWidth"),
                    zIndex:that.get("messageZIndex"),
                    on:{
                        "destroy":function(e){
                            // Preparation for stacking support
                        }  
                    }
                });
                message.render(document.body);      
                that.set("messageZIndex",that.get("messageZIndex")+1);
            })            
            return true;
        },
        /**
         * Gibt eine Meldung in der geladenen Sprache in einem Container aus
         * 
         * @method alert
         * @param {String} nodeSelector of a dom element or the dom element. if set, the message is rendered into the specified element
         * @param {String} textid The id of the text in the TMX-File OR The text of the message
         * @param {String} priority The priority of the alert Message (error, warning, info, tip, help)
         * @return {Boolean} True
         */
        messageInContainer : function(nodeSelector, textid, priority){       
            Y.one(nodeSelector).append("<div class='"+priority+"' textid='"+textid+"'>"+this.text(textid)+"</div>");       
            return true;
        },        
        /**
         * Returns the text in the current language
         * 
         * @method alert
         * @param {String} textid The id of the text in the TMX-File OR The text of the message
         * @return {String} The (translated) text in the current language OR
         *         undefined, if the textid does not exist
         */
        text : function(textid){
            var messageText;
            if (Y.Lang.isUndefined(this._textFrontend[textid]) === false) {
                messageText = this._textFrontend[textid];
            } else {
                messageText = textid;
            }
            return messageText;
        },
        /**
         * Changes the Frontend Language
         * 
         * @method change
         * @param {String} lang string of the new language to be loaded (e.g. "de" or "en")
         * @return {Boolean} True
         */
        change : function(lang){
            Y.use('io', function (Y) {
                Y.log("load this lang: "+lang);
                Y.log("NOT IMPLEMENTED");
            });
            return true;
        }, 
        /**
         * Load an other language module
         * 
         * @method change
         * @param {String} module to be loaded (e.g. "admin")
         * @return {Boolean} True
         */
        loadModule : function(module){
            Y.use('io', function (Y) {
                Y.log("load this module: "+module);
                Y.log("NOT IMPLEMENTED");
            });
            return true;
        },         
        
    
        //
        // PRRIVATE VARIABLES
        //

        _textFrontend : [],

        //
        // PRRIVATE FUNCTIONS
        //

        _updateLanguageSelection : function() {
            var that = this;
            var contentBox = this.get('contentBox');
            contentBox.all("li").each(function(n){
                if(n.getAttribute("name") == that.get("currentLanguage")){
                    n.addClass("selected");
                } else {
                    n.removeClass("selected");
                }
            });
        }
        
    }, {
        ATTRS: {
            currentLanguage: {
                value: null,
                validator: Y.Lang.isString,
                readOnly: true
            },
            loadedModules: {
                value: [],
                validator: Y.Lang.isArray,
                readOnly: true
            },
            messageWidth: {
                value: "20em",
                validator: Y.Lang.isString
            },
            messageZIndex: {
                value: 1000,
                validator: Y.Lang.isNumber
            }            
        }
    })

}, '2.0', {
    requires: ['base','widget','node','elstr_utils'],
    skinnable: false
});