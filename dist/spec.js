/**
 * lrs-check - v0.0.1 - 2016-09-09
 * Copyright (c) 2016 @RoboSparrow (jboeselt)
 * Licensed MIT <https://opensource.org/licenses/MIT>
 */

/*src/spec.js*/

(function(Helper, req){
    'use strict';

    var statement = {
        actor: {
            'mbox': 'mailto: anonymous@lxhive.com',
            'name': 'Anoymous'
        },
        verb: {
            'id': 'http://adlnet.gov/expapi/verbs/launched',
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

    var statementId;

    describe('Setup Authentication', function() {

        before(function(done){
            this.timeout(0);//disable for this test
            Helper.authForm(done);
        });

        it('have authentication configured', function(done){
            done();
        });



        describe('Send Statement', function() {

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
                            done();
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

    });

})(window.Helper, window.req);

//# sourceMappingURL=spec.js.map