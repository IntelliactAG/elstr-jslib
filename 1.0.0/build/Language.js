/**
 * @author egli
 */
var ELSTR = {};

YUI().use("base", function(Y){

    ELSTR.Language = function(config){
    
        // Invoke Base constructor, passing through arguments
        ELSTR.Language.superclass.constructor.apply(this, arguments);
    }
    
    // Used to identify instances of this class
    // For example, to prefix event names
    ELSTR.Language.NAME = "ElstrLanguage";
    
    // "Associative Array", used to define the set of attributes 
    // added by this class. The name of the attribute is the key,
    // and the object literal value acts as the configuration 
    // object passed to addAttrs
    
    ELSTR.Language.ATTRS = {
        // Attribute "A" configuration
        A: {
            value: true
        }
    }
    
    
    // Prototype methods for your new class
    Y.extend(ELSTR.Language, Y.Base, {});
    

});

