    ////
    //  Statement API
    ////

    describe('About', function() {

            var result;
            var instance;

            before(function(done){

                req.xapi(
                    '/about',
                    {
                        method: 'GET',
                        always: function(res, ins){
                            result = res;
                            instance = ins;
                            done();
                        }
                    }
                );
            });

            it('should have an `about` endpoint', function(done){
                assert.strictEqual(result.status, 200, 'response status: 200' );
                assert.strictEqual(result.statusText.toLowerCase(), 'ok', 'response status message: OK' );
                assert.strictEqual(Object.prototype.toString.call(result.data), '[object Object]', 'is an object' );
                assert.property(result.data, 'version', 'result has `version` property');
                done();
            });

        });
