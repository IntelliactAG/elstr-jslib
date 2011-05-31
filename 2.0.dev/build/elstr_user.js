/**
 * @author egli@intelliact.ch
 */

YUI.add('elstr_user', function(Y) {
 
    // private properties or functions
    var currentUsername,
    isAuth,
    isAdmin,
    resourcesAllowed,
    enterpriseApplicationData,
    datasource,
    loginDialog,
    loginDialogMessageContainer,
    accessDeniedDialog,
    forceAuthentication,
    callbackFunction,
    anyObject = {},
    anyFunction = function(){
        Y.log("anyFunction of elstr user");
    };

    Y.namespace('ELSTR');
    Y.ELSTR.user = {
        // public properties or functions
        init : function(){
            // Any init stuff here
            anyFunction();
            Y.log("elstr user init complete");
            
//            Y.use('elstr_admin', function (Y) {
//
//            });
            
            
        }
    }
 
}, '2.0.0' /* module version */, {
    requires: ['base','node']
});