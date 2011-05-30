/**
 * @author egli@intelliact.ch
 */

YUI.add('elstr_lang', function(Y) {
 
    // private properties or functions
    var anyObject = {},
    anyFunction = function(){
        Y.log("anyFunction of elstr lang");
    };

    Y.namespace('ELSTR');
    Y.ELSTR.lang = {
        // public properties or functions
        init : function(){
            // Any init stuff here
            anyFunction();
            Y.log("elstr lang init complete");
        }
    }
 
}, '2.0.0' /* module version */, {
    requires: ['base','node']
});