"use strict";
/**
 * Copyright 2015, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by sahun@intelliact on 08.06.2015.
 */

var keyMirror = require('keymirror');

module.exports = keyMirror({

    EMPTY: null,   // Fist time that we load the content, no data. (We're loading) ---> Loading bootstrap bar or inline.
    CACHED: null,    // We already had data from the cache. (We're loading) ---> Grey non editable text
    OUTDATED: null,   // External change makes our data outdated. (We're loading) ---> Grey non editable text
    LOADED: null,    // The data was loaded from the server.
    CONFLICTED: null    // You're editing something and then you get the notification from ElstrRealTimeUpdate lib that something was changed there.

});
