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

YUI.add('elstr_lang', function(Y) {
 
    // private properties or functions
    var currentLanguage = null,
    textFrontend = [],
    _loadLanguageObject = function(resource, fnLoadComplete){
        textFrontend = ELSTR.applicationData.language.translations;
        currentLanguage = ELSTR.applicationData.language.current;
    },
    _renderLanguageSelection = function(){
        // Render the handler only if it exists
        var nodeLanguageSelection = Y.one(".languageSelection");
        if(nodeLanguageSelection){
            nodeLanguageSelection.all("li").on("click",function(e){
                Y.log(e);
            });
        }
        _updateLanguageSelection();
    },
    _updateLanguageSelection = function(){
        // Update the handler only if it exists
        var nodeLanguageSelection = Y.one(".languageSelection");
        if(nodeLanguageSelection){
            nodeLanguageSelection.all("li").each(function(n){
                Y.log(n.getAttribute("name"));
                if(n.getAttribute("name") == currentLanguage){
                    n.addClass("selected");
                } else {
                    n.removeClass("selected");
                }
            });
        }
    };
    
    Y.namespace('ELSTR').lang = {
        // public properties or functions
        init : function(){
            //TODO: Check to use YUI 3: Internationalization
            _loadLanguageObject();
            _renderLanguageSelection();       
        },
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
            // Show an message overlay
            Y.use('elstr_message',function(Y){
                var message = new Y.ELSTR.Message({
                    message : Y.ELSTR.lang.text(textid),
                    priorty : priority,
                    visible:true,
                    centered:true,
                    width:"10em"
                })
                message.render(document.body);                
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
            Y.one(nodeSelector).append("<div class='"+priority+"' textid='"+textid+"'>"+Y.ELSTR.lang.text(textid)+"</div>");       
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
            if (Y.Lang.isUndefined(textFrontend[textid]) === false) {
                messageText = textFrontend[textid];
            }
            else {
                messageText = textid;
            }
            return messageText;
        },
        /**
         * Returns the current language
         * 
         * @method language
         * @return {String} The current language
         */
        language : function(){
            return currentLanguage;
        },
        /**
         * Changes the Frontend Language
         * 
         * @method change
         * @param {String} lang the new language to be loaded (e.g. "de" or "en")
         * @return {Boolean} True
         */
        change : function(lang){
            Y.use('elstr_intl', function (Y) {
                Y.ELSTR.intl.load(lang);
            });
            return true;
        }        
    }
 
}, '2.0' /* module version */, {
    requires: ['base','node','elstr_utils']
});