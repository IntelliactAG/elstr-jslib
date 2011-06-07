/**
 * @author egli@intelliact.ch
 */

YUI.add('elstr_lang', function(Y) {
 
    // private properties or functions
    var anyObject = {},
    anyFunction = function(){
    };

    Y.namespace('ELSTR');
    Y.ELSTR.lang = {
        // public properties or functions
        init : function(){
            // Any init stuff here
            Y.log("elstr lang init complete");
            //NOT IMPLEMENTED JET
            //TODO: Check to use YUI 3: Internationalization
        }
    }
 
}, '2.0' /* module version */, {
    requires: ['base','node']
});