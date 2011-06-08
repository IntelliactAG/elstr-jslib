/**
 * International language handling for Elstr applications
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2011
 */

YUI.add('elstr_intl', function(Y) {
 
    // private properties or functions
    var isInit = false;

    Y.namespace('ELSTR');
    Y.ELSTR.intl = {
        // public properties or functions
        init : function(){
            //TODO: Check to use YUI 3: Internationalization
            if(isInit === false){
                Y.log("init elstr_intl");
                isInit = true;
            }
        },
        /**
         * Loads an other language
         * 
         * @method laod
         * @param {String} lang the language to be loaded (e.g. "de" or "en")
         * @return {Boolean} True
         */
        load : function(lang){
            Y.ELSTR.intl.init();
            //NOT IMPLEMENTED YET
            Y.log("NOT IMPLEMENTED YET");
            return true;
        }        
    }
 
}, '2.0' /* module version */, {
    requires: ['base','node']
});