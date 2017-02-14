"use strict";
/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by sahun@intelliact on 20.02.2014.
 *
 * This store provides information about the screen, viewport and window.
 * Provides a Flux event evey time the viewport is resized.
 *
 */

var mcFly = require('../libs/mcFly.js');

/**
 *  Private variables
 */

function _getViewport() {

    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth;
        viewPortHeight = window.innerHeight;
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined' &&
        typeof document.documentElement.clientWidth != 'undefined' &&
        document.documentElement.clientWidth !== 0) {

        viewPortWidth = document.documentElement.clientWidth;
        viewPortHeight = document.documentElement.clientHeight;
    }

    // older versions of IE
    else {

        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;

    }

    return [viewPortWidth, viewPortHeight];
}


function _emitChangeScreen(){
    ElstrDisplayStore.emitChange();
}

window.onresize = _emitChangeScreen;

/*
 ElstrDisplayStore.getScreenDimensions();
 ElstrDisplayStore.getWindowDimensions();
 ElstrDisplayStore.getViewportDimensions();
*/

var ElstrDisplayStore = mcFly.createStore({

    /**
     * Gets the current Screen Dimentions
     * @returns {{width: Number, height: Number}}
     */
    getScreenDimensions: function() {
        return {
            width: screen.width,
            height: screen.height
        };
    },

    /**
     * Gets the current Window Dimentions
     * @returns {{width: Number, height: Number}}
     */
    getWindowDimensions: function() {
        return {
            width: window.width,
            height: window.height
        };
    },

    /**
     * Gets the current ViewPort Dimentions
     * @returns {{width: Number, height: Number}}
     */
    getViewportDimensions: function() {

        var vp = _getViewport();
        return {
            width: vp[0],
            height: vp[1]
        };
    }

}, function(payload) {

    return true;
});

module.exports = ElstrDisplayStore;
