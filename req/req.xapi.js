/**
 * @author jboeselt
 * simple xapi http requests via XHR or NODE (request module)
 * `$ node my-test.js`
 */

/* jshint node: true */
/* jshint esversion: 3 */
if((typeof module !== 'undefined' && module.exports)){
    var req = require('./req.js');
}

(function(req){

    'use strict';

    //// default xapi request
    req.xapi = function(api, config){
        var url = req.xapi.LRS + api;
        var defaults = {
            headers: {
                'Content-Type'             : 'application/json',
                'Authorization'            : req.xapi.AUTH,
                'X-Experience-API-Version' : req.xapi.VERSION
            },
            responseType: 'json'
        };
        return req.request(url, req.mergeHash(defaults, config));// note the order of merge. default overwrites are allowed
    };

    return req;

}(req));

//// node
if(req.NODE){
    module.exports = req;
}
