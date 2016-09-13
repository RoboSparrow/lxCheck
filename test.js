//// suite
var mocha = require('mocha');
var assert = require('chai').assert;
mocha.setup('bdd');

//// req
var req = require('./req/req.xapi.js');

// lrs auth
var config = require('./config.lrs.js');
req.xapi.LRS = config.lrs;
req.xapi.AUTH = 'Basic ' + new Buffer(config.user + ':' + config.pass).toString('base64');
req.xapi.VERSION = config.version;

//// specs

// @TODO
require('./src/specs/statement-api.js');
require('./src/specs/activity-state-api.js');

//// run

mocha.run();
