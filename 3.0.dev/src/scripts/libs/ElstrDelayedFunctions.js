
var ElstrLangStore = require('../stores/ElstrLangStore');

/**
 * Validation function based in regular expresions.
 * Used as reference:
 * http://regexlib.com/
 *
 * @constructor
 */
function ElstrDelayedFunctions (){}


_functions = {};

/**
 * Executes a 'function' after the specified 'time'.
 *
 * If a second 'function' is provided with the same 'identifier' first 'function' will be cancelled.
 * Timer will be reset with the next 'time' value
 * executeBeforeUnload (default value: true) will determine if the function have to be executed before close.
 *
 * return ID value of the timer that is set
 **/
ElstrDelayedFunctions.delay = function (identifier, functionToExecute , time, executeBeforeUnload ){

    ElstrDelayedFunctions.cancel(identifier);

    _functions[identifier] = {
        identifier : identifier,

        timerIdentifier : setTimeout(function (){
            functionToExecute();
            ElstrDelayedFunctions.cancel(identifier);
        }, time),

        executeBeforeUnload : executeBeforeUnload,
        functionToExecute : functionToExecute

    };

    return _functions[identifier];

};

/**
 * Cancels the future execution of the selected identifier.
 **/
ElstrDelayedFunctions.cancel = function (identifier){

    if (_functions[identifier] &&
        _functions[identifier].timerIdentifier){

        clearTimeout(_functions[identifier].timerIdentifier);

        delete _functions[identifier];

        return identifier;

    }

};

ElstrDelayedFunctions.cancelAll = function (){

    for(var identifier in _functions){
        ElstrDelayedFunctions.cancel(identifier);
    }

};

/**
 * Cancels the future execution of the selected identifier.
 **/
ElstrDelayedFunctions.executeNow = function (identifier){

    if (_functions[identifier] &&
        _functions[identifier].timerIdentifier &&
        _functions[identifier].functionToExecute){

        var functionToExe = _functions[identifier].functionToExecute;
        ElstrDelayedFunctions.cancel(identifier);

        functionToExe();
    }



};

/**
 * Cancels the future execution of all the current delayed functions
 **/
ElstrDelayedFunctions.executeNowAll = function (){

    for(var identifier in _functions){
        ElstrDelayedFunctions.executeNow(identifier);
    }

};



// Used to logout the session , when browser window was closed
window.onbeforeunload = function () {

    var functionsLeft = false;
    for(var identifier in _functions){

        if (_functions[identifier] &&
            _functions[identifier].executeBeforeUnload){

            ElstrDelayedFunctions.executeNow(identifier);
            functionsLeft = true;
        }
    }

    if (functionsLeft){

        // "Are you sure you want to leave, background functions are still working. ";
        return ElstrLangStore.text("BACKGROUND FUNCTIONS RUNNING");

    }


};

module.exports = ElstrDelayedFunctions;