/**
 * Module to privide a Widget and functionallity for multilanguage handling
 * in Elstr applications.
 *
 * @module elstr_lang
 * @namespace ELSTR
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2011
 */

YUI.add('elstr_lang', function (Y) {

    /**
     * Text and language handling for Elstr applications
     *
     * MARKUP examples
     *
     * Required for language selection
     * Current language has the class selected
     * 
     *     <ul class="languageSelection">
     *         <li name="de"> Deutsch </li>
     *         <li name="en"> English </li>
     *     </ul>
     *
     * Example for multi lang element
     * <span data-textid='myTextId'>my text</span>
     * 
     * @class Lang
     * @extends YUI.Widget
     * @namespace ELSTR
     * @param config {Object} Configuration object
     */
    Y.namespace('ELSTR').Lang = Y.Base.create('elstr_lang', Y.Widget, [], {
                
        //
        // WIDGET FUNCTIONS
        //
        
        /**
         * Designated initializer
         *
         * @method initializer
         */
        initializer: function () {
            // Init the language object from DOM
            if (Y.Lang.isObject(ELSTR.applicationData.language)) {
                this._set("currentLanguage",ELSTR.applicationData.language.current);
                this._set("loadedModules",ELSTR.applicationData.language.modules);
                this._textFrontend = ELSTR.applicationData.language.translations;
                ELSTR.applicationData.language = "empty after reading it to the language widget";
            }
            Y.log("elstr_lang init complete");
        },

        /**
         * Designated destructor
         *
         * @method destructor
         */
        destructor: function () {
            // Remove all click listeners
            this.get('contentBox').purge(true);
        },

       /**
         * renderUI implementation
         *
         * The auth UI is allways loaded from markup, never rendered at runtime
         * @method renderUI
         */
        renderUI: function () {
        // Always loaded from markup
        // E.g. srcNode:".languageSelection"
        },

        /**
         * bindUI implementation
         *
         * Hooks up events for the widget
         * @method bindUI
         */
        bindUI: function () {
            var contentBox = this.get('contentBox');
            contentBox.all("li").on("click", function(e) {
                if(e.target.hasClass("selected") === false){
                    this.change(e.target.getAttribute("name"));
                }
            },this);
        },
        
        /**
         * syncUI implementation
         *
         * @method syncUI
         */
        syncUI: function () {
            this._updateLanguageSelection();
            this._draw();
        },
    
        //
        // PUBLIC FUNCTIONS
        //

        /**
         * Gibt eine Meldung in der geladenen Sprache aus List of priorities error
         * warning info tip help
         * 
         * @method message
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
            });
            return true;
        },

        /**
         * Gibt eine Meldung in der geladenen Sprache in einem Container aus
         * 
         * @method messageInContainer
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
         * @method text
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
            var that = this;

            Y.use('datasource', function (Y) {
                //Y.log("load this lang: "+lang);

                if(!that._datasource){
                    that._createDatasource();
                }

                var oRequestPost = {
                    "jsonrpc": "2.0",
                    "method": "load",
                    "params": {
                        "file": "", // Used for deprecated file api
                        "lang": lang
                    },
                    "id": Y.ELSTR.Utils.uuid()
                };
                
                var oCallbackStatus = {
                    success: function(e) {
                        var response = Y.JSON.parse(e.response.results[0].responseText);
                        Y.log(response.result);
                        that._textFrontend = response.result;
                        that._set("currentLanguage",lang);
                        that.syncUI();
                    },
                    failure: function(e) {
                        Y.use('elstr_error', function(Y) {
                            Y.ELSTR.Error.datasourceCallbackFailure(e, that._datasource);
                        });
                    }
                };
                that._datasource.sendRequest({
                    request: Y.JSON.stringify(oRequestPost),
                    callback: oCallbackStatus
                });

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
            Y.use('datasource', function (Y) {
                Y.log("load this module: "+module);
                Y.log("NOT IMPLEMENTED");
            });
            return true;
        },

        //
        // PRRIVATE VARIABLES
        //

        _textFrontend : {},
        _datasource: null,

        //
        // PRRIVATE FUNCTIONS
        //

        _draw: function() {
            var textNodes;

            // Using HTML5 attibute
            textNodes = Y.all('[data-textid');
            textNodes.each(function (textNode) {
                var textid = textNode.getAttribute('data-textid');
                textNode.setHTML(this.text(textid));
            }, this);

            // Using non standard deprecated elstr attribute
            textNodes = Y.all('[textid');
            textNodes.each(function (textNode) {
                var textid = textNode.getAttribute('textid');
                if(textNode.setHTML){
                    textNode.setHTML(this.text(textid));
                } else {
                    // Only for backward compatibility
                    // Can be removed if all customers are on latest YUI 3.x
                    textNode.setContent(this.text(textid));
                }
                
            }, this);
        },

        _createDatasource: function() {
            this._datasource = new Y.DataSource.IO({
                source: this.get('serviceUrl'),
                ioConfig: {
                    method: "POST"
                }
            });
        },

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
        /**
         * Static property used to define the default attribute configuration of
         * the Widget.
         *
         * @property ATTRS
         * @type {Object}
         * @protected
         * @static
         */
        ATTRS: {
            /**
             * The current langunage
             *
             * @attribute currentLanguage
             * @readonly
             * @type {String}
             * @default true
             */
            currentLanguage: {
                value: null,
                validator: Y.Lang.isString,
                readOnly: true
            },
            /**
             * All loaded language modules
             *
             * @attribute loadedModules
             * @readonly
             * @type {Array}
             * @default Empty array
             */
            loadedModules: {
                value: [],
                validator: Y.Lang.isArray,
                readOnly: true
            },
            /**
             * Url of the Elstr language service
             *
             * @attribute serviceUrl
             * @type {String}
             * @default "services/ELSTR_LanguageServer"
             */
            serviceUrl: {
                value: "services/ELSTR_LanguageServer",
                validator: Y.Lang.isString
            },
            /**
             * Width of the generated message box
             *
             * @attribute messageWidth
             * @type {String}
             * @default "20em"
             */
            messageWidth: {
                value: "20em",
                validator: Y.Lang.isString
            },
            /**
             * Z-Index of the generated mmessage box
             *
             * @attribute currentLanguage
             * @type {Number}
             * @default 1000
             */
            messageZIndex: {
                value: 1000,
                validator: Y.Lang.isNumber
            }
        }
    });

}, '2.0', {
    requires: ['base','widget','node','elstr_utils'],
    skinnable: false
});