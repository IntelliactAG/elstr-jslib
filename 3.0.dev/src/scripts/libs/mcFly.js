"use strict";
/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by sahun@intelliact on 11.12.2014.
 *
 * Instance of the mcFly library.
 * This avoid we have to instanciate the lib every time.
 *
 */

var McFly = require('mcfly');
var mcFly = new McFly();
module.exports = mcFly;