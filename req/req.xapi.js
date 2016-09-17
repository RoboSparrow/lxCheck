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
    
    /**
     * @see https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md#cors
     * @see https://blogs.msdn.microsoft.com/ieinternals/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds/
     */
     
    var transformRequestLegacy = function(config){
        
        // responseType
        config.responseType = '';
        
        // headers: add to data and remove
        var data = config.headers;
        config.headers= {};
        
        // query
        var query = config.query || null;
        
        if(query){
            data = req.mergeHash(data, query);
        }
        // query only method params allowed according to spec
        config.query = {
            method: config.method || 'GET' 
        };
        
        // method
        config.method = 'POST';    
        
        // method
        config.transformResponse = function(response){
            try{
                response.data = JSON.parse(response.data);
            }catch(e){
                //@TODO
                console.error(e);
            }
        };    
            
        // data
        if(typeof config.data !== 'undefined'){
            data.content = config.data;
        }
        config.data = data;
        
        return config;
    };
        
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

        config = req.mergeHash(defaults, config);
        
        if(req.xapi.LEGACY){
            config = transformRequestLegacy(config);
            return req.raw(url, config);
        }
        
        return req.request(url, config);// note the order of merge. default overwrites are allowed
    };

    req.xapi.uuid = function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
        });
    };
    
    req.xapi.LEGACY = false;
    
    return req;

}(req));

//// node
if(req.NODE){
    module.exports = req;
}
