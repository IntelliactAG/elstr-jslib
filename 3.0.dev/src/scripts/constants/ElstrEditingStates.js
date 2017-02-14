"use strict";
/**
 * Copyright 2015, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by sahun@intelliact on 08.06.2015.
 */

var keyMirror = require('keymirror');

module.exports = keyMirror({

    NORMAL: null,   // The component has content or is in any Loading state.
    EDITING: null,  // The user is editing the content.
    SAVING: null    // The user has finished loading the content, the content is being saved.

});