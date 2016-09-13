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

//# sourceMappingURL=spec.js.map