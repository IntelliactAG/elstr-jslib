/**
 * @author egli@intelliact.ch
 */

YUI.add('elstr_admin', function(Y) {
 
    // private properties or functions
    var anyObject = {},
    anyFunction = function(){
        Y.log("anyFunction of elstr admin");
    };

    Y.namespace('ELSTR');
    Y.ELSTR.admin = {
        // public properties or functions
        init : function(){
            // Any init stuff here
            anyFunction();
            Y.log("elstr admin init complete");
           
            
        }
    }
 
}, '2.0.0' /* module version */, {
    requires: ['base','node']
});