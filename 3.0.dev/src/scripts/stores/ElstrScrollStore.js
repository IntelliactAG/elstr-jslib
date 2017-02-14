"use strict";
var mcFly = require('../libs/mcFly.js');

var ElstrLog = require('../ElstrLog');
require('../libs/ElstrFunctionsControl.js');

var ElstrEditingStates = require('../constants/ElstrEditingStates');
var ElstrLoadingStates = require('../constants/ElstrLoadingStates');

var ElstrUrlHashConstants = require('../constants/ElstrUrlHashConstants');

var _registeredComponents = {};

/**
 * Information of the current scroll of the site.
 * Raises an event everytime the scroll changes.
 *
 * Contains a system to track the scroll position of elements. (Registering them)
 * Allows to know what is the current element inside the scroll position.
 *
 */
var ElstrScrollStore = mcFly.createStore({
    
    /**
     * Returns the current vertical scroll of the site
     */
    getCurrentScroll: function(){
        return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    },

    /**
     * Returns the current horizontal scroll of the site
     */
    getCurrentHorizontalScroll: function(){
        return (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
    },


    /**
     * REGISTER COMPONENTS TO TRACK THEIR SCROLL POSITIONS
     */


    /**
     * Returns the component closer to the scroll position.
     */
    getCurrentComponent: function(margin, excludedMargin){

        var currentScroll = this.getCurrentScroll();

        var marginCorrected = (!margin)?0:margin;
        var excludedMarginCorrected = (!excludedMargin)?0:excludedMargin;

        var minDistance = -99999;
        var currentComp = null;

        for (var index in _registeredComponents){
            var obj = _registeredComponents[index];

            var scrollDiff = parseInt(obj.verticalScroll) - parseInt(currentScroll);

            if (scrollDiff<(marginCorrected+excludedMarginCorrected) && minDistance<scrollDiff){

                minDistance = scrollDiff;

                if (scrollDiff<marginCorrected){
                    currentComp = obj.data;
                }else{
                    currentComp = null;
                }
            }
        }

        return currentComp;
    },


    /**
     * Call to update the positions of the components
     */
    updateScrollPositionsDelayed: function(){

        for (var index in _registeredComponents){
            var obj = _registeredComponents[index];

            if (obj.updateScroll)
                obj.updateScroll();

        }

    },

    /**
     * Call to update the positions of the components (Delayed to allow them to render)
     */
    updateScrollPositions: function(){

        setTimeout(this.updateScrollPositionsDelayed, 500);

    },

    /**
     * Stop tracking the position of an element
     */
    cleanComponent: function(key){
        delete _registeredComponents[key];
    },

    /**
     * Register a component to trck the scroll
     */
    registerComponent: function(verticalScroll, key, data, updateScroll){

        var previousScroll = -1;
        if (_registeredComponents[key] && _registeredComponents[key].verticalScroll){
            previousScroll = _registeredComponents[key].verticalScroll;
        }

        _registeredComponents[key] = {
            verticalScroll: verticalScroll,
            data: data,
            updateScroll: updateScroll
        };

        if (previousScroll != verticalScroll){
            ElstrScrollStore.emitChange();
        }
    }


}, function(payload) {

    switch (payload.actionType) {

        case ElstrUrlHashConstants.URL_HASH_CHANGE:

            ElstrScrollStore.updateScrollPositions();
            break;

    }

    return true;

});

function runOnScroll(){
    ElstrScrollStore.emitChange();
}

// Improves the scrolling events at every 50 milisecs
window.addEventListener("scroll", runOnScroll.throttle(50));

module.exports = ElstrScrollStore;