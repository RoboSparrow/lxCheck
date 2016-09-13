<<<<<<< HEAD
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {
=======
/**
 * lrs-check - v0.0.1 - 2016-09-13
 * Copyright (c) 2016 @RoboSparrow (jboeselt)
 * Licensed MIT <https://opensource.org/licenses/MIT>
 */

/*src/spec.js*/

/* global setTimeout */
(function(Helper, req){
    'use strict';

    var statementId;
    var putStatementId;
    var statement;
    var voidingStatement;


    ////
    //  Statement API
    ////

    describe('Statement API', function() {

        statement = {
            actor: {
                'mbox': 'mailto: anonymous@lxhive.com',
                'name': 'Anoymous'
            },
            verb: {
                'id': 'http://adlnet.gov/expapi/verbs/attempted',
                'display': {
                    'en-US': 'launched'
                }
            },
            object: {
                'id': 'http://lxhive.com/activities/lrs-check',
                'definition': {
                    'name': {
                        'en-Us': "Demos"
                    }
                }
            }
        };

        voidingStatement = {
            actor: {
                mbox: 'mailto: anonymous@lxhive.com',
                name: 'Anoymous'
            },
            verb : {
                id: "http://adlnet.gov/expapi/verbs/voided",
                display:{
                    "en-US":"voided"
                }
            },
            object: {
                objectType: "StatementRef",
                id: null
            }
        };

        putStatementId = req.xapi.uuid();

        describe('POST /statements', function() {

            var result;
            var instance;

            before(function(done){
                req.xapi(
                    '/statements',
                    {
                        method: 'POST',
                        data: statement,
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            setTimeout(done, 500);
                        }
                    }
                );
            });

            it('should send a statement', function(done){
                assert.strictEqual(result.status, 200, 'response status: 200' );
                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Array]', 'is an array' );
                assert.strictEqual(result.data.length, 1, 'has one element' );
                statementId = result.data[0];
                done();
            });

        });

        describe('GET /statements', function() {

            var result;
            var instance;

            before(function(done){
                req.xapi(
                    '/statements',
                    {
                        method: 'GET',
                        query: {statementId: statementId},
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('receive a statement object', function(done){
                assert.strictEqual(result.status, 200, 'response status: 200' );
                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Object]', 'is an object' );
                assert.strictEqual(result.data.id, statementId, 'statementId = ' + statementId );
                done();
            });

        });

        describe('PUT /statements', function() {

            var result;
            var instance;

            before(function(done){

                voidingStatement.object.id = statementId;

                req.xapi(
                    '/statements',
                    {
                        method: 'PUT',
                        query: {statementId: putStatementId},
                        data: voidingStatement,
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            setTimeout(done, 500);
                        }
                    }
                );
            });

            it('should send a statement', function(done){
                assert.strictEqual(result.status, 204, 'response status: 204' );
                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: No content' );
                done();
            });

        });

        describe('GET Voided statement', function() {

            var result;
            var instance;

            before(function(done){
                req.xapi(
                    '/statements',
                    {
                        method: 'GET',
                        data: statement,
                        query: {statementId: statementId},
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('reject a request for a voided statement', function(done){
                assert.strictEqual(result.status, 404, 'response status: 404' );
                assert.strictEqual(result.statusText.toLowerCase(), 'not found', 'response status message: Not found' );
                done();
            });

        });

    });

    ////
    //  Statement API
    ////

    describe('State API', function() {

        var now = new Date();

        var _sharedId = req.xapi.uuid();

        var createState = function() {
            return {
                stateId: req.xapi.uuid(),
                activityId: 'http://lxhive.com/activities/' + _sharedId,
                agent: {'mbox' : 'mailto: '  + _sharedId  + '@lxhive.com' },
                registration: req.xapi.uuid()
            };
        };

        var states = [];

        describe('POST /activities/state', function() {

            var result;
            var instance;

            before(function(done){

                var state = createState();
                states.push(state);

                req.xapi(
                    '/activities/state',
                    {
                        method: 'POST',
                        query: state,
                        data: {
                            custom: now.toISOString()
                        },
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('should store an activity state', function(done){
                assert.strictEqual(result.status, 204, 'response status: 204' );
                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: No content' );
                done();
            });

        });

        describe('PUT /activities/state', function() {

            var result;
            var instance;

            before(function(done){

                var state = createState();
                states.push(state);

                req.xapi(
                    '/activities/state',
                    {
                        method: 'PUT',
                        query: state,
                        data: {
                            custom: now.toISOString()
                        },
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            setTimeout(done, 500);
                        }
                    }
                );
            });

            it('should store an activity state', function(done){
                assert.strictEqual(result.status, 204, 'response status: 204' );
                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: No content' );
                done();
            });

        });

        describe('GET single /activities/state', function() {

            var result;
            var instance;

            before(function(done){

                req.xapi(
                    '/activities/state',
                    {
                        method: 'GET',
                        query: states[0],
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('receive a state object with data', function(done){
                assert.strictEqual(result.status, 200, 'response status: 200' );
                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Object]', 'is an object' );
                assert.property(result.data, 'custom', 'result has `custom` property');
                done();
            });

        });

        describe('GET multiple /activities/state', function() {

            var result;
            var instance;

            before(function(done){
                req.xapi(
                    '/activities/state',
                    {
                        method: 'GET',
                        query: {
                            activityId: states[0].activityId,
                            agent: states[0].agent,
                            since: now.toISOString()
                        },
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('receive an array of state ids', function(done){
                assert.strictEqual(result.status, 200, 'response status: 200' );
                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Array]', 'is an array');
                assert.strictEqual(result.data.length, states.length, 'array length matches the previously sent states');

                done();
            });

        });

        describe('GET single /activities/state', function() {

            var result;
            var instance;

            before(function(done){

                req.xapi(
                    '/activities/state',
                    {
                        method: 'GET',
                        query: states[0],
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('receive a state object with data', function(done){
                assert.strictEqual(result.status, 200, 'response status: 200' );
                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Object]', 'is an object' );
                assert.property(result.data, 'custom', 'result has `custom` property');
                done();
            });

        });

        describe('DELETE multiple /activities/state', function() {

            var result;
            var instance;

            before(function(done){
                req.xapi(
                    '/activities/state',
                    {
                        method: 'DELETE',
                        query: {
                            activityId: states[0].activityId,
                            agent: states[0].agent
                        },
                        always: function(res, ins){console.log(res, ins);
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('delete all writen states', function(done){
                assert.strictEqual(result.status, 204, 'response status: 204' );
                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: no content' );
                setTimeout(done, 500);
            });

        });


    });



})(window.Helper, window.req);
>>>>>>> 516d8fbab65cc8217ad5e2855e82debda3a3abd2

	// dumb copy files
	
	__webpack_require__(1);
	__webpack_require__(2);
	
	__webpack_require__(3);
	__webpack_require__(4);
	
	__webpack_require__(5);
	
	// bundle
	__webpack_require__(6);
	__webpack_require__(7);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "req/req.js";

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "req/req.xapi.js";

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "app.css";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "helper.js";

/***/ },
/* 6 */
/***/ function(module, exports) {

	    var statementId;
	    var putStatementId;
	    var statement;
	    var voidingStatement;
	
	    ////
	    //  Statement API
	    ////
	
	    describe('Statement API', function() {
	
	        statement = {
	            actor: {
	                'mbox': 'mailto: anonymous@lxhive.com',
	                'name': 'Anoymous'
	            },
	            verb: {
	                'id': 'http://adlnet.gov/expapi/verbs/attempted',
	                'display': {
	                    'en-US': 'launched'
	                }
	            },
	            object: {
	                'id': 'http://lxhive.com/activities/lrs-check',
	                'definition': {
	                    'name': {
	                        'en-Us': "Demos"
	                    }
	                }
	            }
	        };
	
	        voidingStatement = {
	            actor: {
	                mbox: 'mailto: anonymous@lxhive.com',
	                name: 'Anoymous'
	            },
	            verb : {
	                id: "http://adlnet.gov/expapi/verbs/voided",
	                display:{
	                    "en-US":"voided"
	                }
	            },
	            object: {
	                objectType: "StatementRef",
	                id: null
	            }
	        };
	
	        putStatementId = req.xapi.uuid();
	
	        describe('POST /statements', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	                req.xapi(
	                    '/statements',
	                    {
	                        method: 'POST',
	                        data: statement,
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            setTimeout(done, 500);
	                        }
	                    }
	                );
	            });
	
	            it('should send a statement', function(done){
	                assert.strictEqual(result.status, 200, 'response status: 200' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
	                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Array]', 'is an array' );
	                assert.strictEqual(result.data.length, 1, 'has one element' );
	                statementId = result.data[0];
	                done();
	            });
	
	        });
	
	        describe('GET /statements', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	                req.xapi(
	                    '/statements',
	                    {
	                        method: 'GET',
	                        query: {statementId: statementId},
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            done();
	                        }
	                    }
	                );
	            });
	
	            it('receive a statement object', function(done){
	                assert.strictEqual(result.status, 200, 'response status: 200' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
	                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Object]', 'is an object' );
	                assert.strictEqual(result.data.id, statementId, 'statementId = ' + statementId );
	                done();
	            });
	
	        });
	
	        describe('PUT /statements', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	
	                voidingStatement.object.id = statementId;
	
	                req.xapi(
	                    '/statements',
	                    {
	                        method: 'PUT',
	                        query: {statementId: putStatementId},
	                        data: voidingStatement,
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            setTimeout(done, 500);
	                        }
	                    }
	                );
	            });
	
	            it('should send a statement', function(done){
	                assert.strictEqual(result.status, 204, 'response status: 204' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: No content' );
	                done();
	            });
	
	        });
	
	        describe('GET Voided statement', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	                req.xapi(
	                    '/statements',
	                    {
	                        method: 'GET',
	                        data: statement,
	                        query: {statementId: statementId},
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            done();
	                        }
	                    }
	                );
	            });
	
	            it('reject a request for a voided statement', function(done){
	                assert.strictEqual(result.status, 404, 'response status: 404' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'not found', 'response status message: Not found' );
	                done();
	            });
	
	        });
	
	    });


/***/ },
/* 7 */
/***/ function(module, exports) {

	    ////
	    //  Statement API
	    ////
	
	    describe('State API', function() {
	
	        var now = new Date();
	
	        var _sharedId = req.xapi.uuid();
	
	        var createState = function() {
	            return {
	                stateId: req.xapi.uuid(),
	                activityId: 'http://lxhive.com/activities/' + _sharedId,
	                agent: {'mbox' : 'mailto: '  + _sharedId  + '@lxhive.com' },
	                registration: req.xapi.uuid()
	            };
	        };
	
	        var states = [];
	
	        describe('POST /activities/state', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	
	                var state = createState();
	                states.push(state);
	
	                req.xapi(
	                    '/activities/state',
	                    {
	                        method: 'POST',
	                        query: state,
	                        data: {
	                            custom: now.toISOString()
	                        },
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            done();
	                        }
	                    }
	                );
	            });
	
	            it('should store an activity state', function(done){
	                assert.strictEqual(result.status, 204, 'response status: 204' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: No content' );
	                done();
	            });
	
	        });
	
	        describe('PUT /activities/state', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	
	                var state = createState();
	                states.push(state);
	
	                req.xapi(
	                    '/activities/state',
	                    {
	                        method: 'PUT',
	                        query: state,
	                        data: {
	                            custom: now.toISOString()
	                        },
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            setTimeout(done, 500);
	                        }
	                    }
	                );
	            });
	
	            it('should store an activity state', function(done){
	                assert.strictEqual(result.status, 204, 'response status: 204' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: No content' );
	                done();
	            });
	
	        });
	
	        describe('GET single /activities/state', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	
	                req.xapi(
	                    '/activities/state',
	                    {
	                        method: 'GET',
	                        query: states[0],
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            done();
	                        }
	                    }
	                );
	            });
	
	            it('receive a state object with data', function(done){
	                assert.strictEqual(result.status, 200, 'response status: 200' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
	                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Object]', 'is an object' );
	                assert.property(result.data, 'custom', 'result has `custom` property');
	                done();
	            });
	
	        });
	
	        describe('GET multiple /activities/state', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	                req.xapi(
	                    '/activities/state',
	                    {
	                        method: 'GET',
	                        query: {
	                            activityId: states[0].activityId,
	                            agent: states[0].agent,
	                            since: now.toISOString()
	                        },
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            done();
	                        }
	                    }
	                );
	            });
	
	            it('receive an array of state ids', function(done){
	                assert.strictEqual(result.status, 200, 'response status: 200' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
	                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Array]', 'is an array');
	                assert.strictEqual(result.data.length, states.length, 'array length matches the previously sent states');
	
	                done();
	            });
	
	        });
	
	        describe('GET single /activities/state', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	
	                req.xapi(
	                    '/activities/state',
	                    {
	                        method: 'GET',
	                        query: states[0],
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            done();
	                        }
	                    }
	                );
	            });
	
	            it('receive a state object with data', function(done){
	                assert.strictEqual(result.status, 200, 'response status: 200' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
	                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Object]', 'is an object' );
	                assert.property(result.data, 'custom', 'result has `custom` property');
	                done();
	            });
	
	        });
	
	        describe('DELETE multiple /activities/state', function() {
	
	            var result;
	            var instance;
	
	            before(function(done){
	                req.xapi(
	                    '/activities/state',
	                    {
	                        method: 'DELETE',
	                        query: {
	                            activityId: states[0].activityId,
	                            agent: states[0].agent
	                        },
	                        always: function(res, ins){console.log(res, ins);
	                            result = res;
	                            instance = ins;
	                            done();
	                        }
	                    }
	                );
	            });
	
	            it('delete all written states', function(done){
	                assert.strictEqual(result.status, 204, 'response status: 204' );
	                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: no content' );
	                setTimeout(done, 500);
	            });
	
	        });
	
	
	    });


/***/ }
/******/ ]);
//# sourceMappingURL=spec.js.map