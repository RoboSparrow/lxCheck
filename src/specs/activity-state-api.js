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
