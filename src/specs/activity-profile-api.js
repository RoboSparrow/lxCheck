    ////
    //  Activity Profile API
    ////

    describe('Activity Profile API', function() {

        var now = new Date();

        var _activityId = req.xapi.uuid();

        var createProfile = function() {
            return {
                activityId: _activityId,
                profileId: req.xapi.uuid()
            };
        };

        var profiles = [];

        describe('POST /activities/profile', function() {

            var result;
            var instance;

            before(function(done){

                var profile = createProfile();
                profiles.push(profile);

                req.xapi(
                    '/activities/profile',
                    {
                        method: 'POST',
                        query: profile,
                        data: {
                            custom: now.toISOString()
                        },
                        always: function(res, ins){
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('should store an activity profile', function(done){
                assert.strictEqual(result.status, 204, 'response status: 204' );
                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: No content' );
                done();
            });

        });

        describe('POST /activities/profile', function() {

            var result;
            var instance;

            before(function(done){

                var profile = createProfile();
                profiles.push(profile);

                req.xapi(
                    '/activities/profile',
                    {
                        method: 'PUT',
                        query: profile,
                        data: {
                            custom: now.toISOString()
                        },
                        always: function(res, ins){
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('should store an activity profile', function(done){
                assert.strictEqual(result.status, 204, 'response status: 204' );
                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: No content' );
                done();
            });

        });

        describe('GET single /activities/profile', function() {

            var result;
            var instance;

            before(function(done){

                req.xapi(
                    '/activities/profile',
                    {
                        method: 'GET',
                        query: profiles[0],
                        always: function(res, ins){
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('receive an activity profile object with data', function(done){
                assert.strictEqual(result.status, 200, 'response status: 200' );
                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Object]', 'is an object' );
                assert.property(result.data, 'custom', 'result has `custom` property');
                done();
            });

        });

        describe('GET multiple /activities/profile', function() {

            var result;
            var instance;

            before(function(done){
                req.xapi(
                    '/activities/profile',
                    {
                        method: 'GET',
                        query: {
                            activityId: _activityId
                        },
                        always: function(res, ins){
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('receive an array of activity profile ids', function(done){
                assert.strictEqual(result.status, 200, 'response status: 200' );
                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: ok' );
                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Array]', 'is an array');
                assert.strictEqual(result.data.length, profiles.length, 'array length matches the previously sent profiles');

                done();
            });

        });

        describe('DELETE a /activities/profile', function() {

            var result;
            var instance;

            before(function(done){

                var count = 0;

                var _done = function(done){
                    count++;
                    if(count === 2){
                        done();
                    }
                };

                req.xapi(
                    '/activities/profile',
                    {
                        method: 'DELETE',
                        query: profiles[0],
                        always: function(res, ins){
                            result = res;
                            instance = ins;
                            _done(done);
                        }
                    }
                );

                req.xapi(
                    '/activities/profile',
                    {
                        method: 'DELETE',
                        query: profiles[1],
                        always: function(res, ins){
                            result = res;
                            instance = ins;
                            _done(done);
                        }
                    }
                );

            });

            it('delete a previously stored activity profile', function(done){
                assert.strictEqual(result.status, 204, 'response status: 204' );
                assert.strictEqual(result.statusText.toLowerCase(), 'no content', 'response status message: no content' );
                setTimeout(done, 500);
            });

        });


    });
