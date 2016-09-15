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
                        always: function(res, ins){
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
                        always: function(res, ins){
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
                        always: function(res, ins){
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
                        always: function(res, ins){
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
