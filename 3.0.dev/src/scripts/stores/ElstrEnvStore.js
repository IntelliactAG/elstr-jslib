/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by sahun@intelliact on 20.02.2014.
 *
 * This store provides information about the browser and current environment.
 *
 */
var mcFly = require('../libs/mcFly.js');

/**
 *  Private variables
 */

function _get_browser_info() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {
            name: 'IE',
            version: (tem[1] || '')
        };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) {
            return {
                name: tem.slice(1)[0].replace('OPR', 'Opera'),
                version: tem.slice(1)[1]
            };
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return {
        name: M[0],
        version: M[1]
    };
}

var ElstrEnvStore = mcFly.createStore({

    /**
     * Get the navigator information from the browser.
     * @returns {Navigator}
     */
    getNavigator: function() {
        return navigator;
    },

    /**
     * Get the Name and version from the current browser.
     * @returns {
     * name: String name of the browser
     * version: String version of the browser
     * }
     */
    getBrowserInfo: function() {
        return _get_browser_info();
    }

}, function(payload) {

    return true;
});

module.exports = ElstrEnvStore;
