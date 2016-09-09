/**
 * lrs-check - v0.0.1 - 2016-09-09
 * Copyright (c) 2016 @RoboSparrow (jboeselt)
 * Licensed MIT <https://opensource.org/licenses/MIT>
 */

/*req/req.js*/

/**
 * @author jboeselt
 * simple xapi http requests via XHR or NODE (request module)
 * `$ node my-test.js`
 */

/* jshint node: true */
/* jshint esversion: 3 */

var req = (function(){

    'use strict';

    var exports = {};

    //// check node or browser
    var NODE = (typeof module !== 'undefined' && module.exports);
    if(typeof window !== 'undefined' && window.XMLHttpRequest){
        /* global window */
        /* global XMLHttpRequest */
        NODE = false;
    }

    // if node then load npm.request module
    if(NODE){
        var http = require('http');
        var https = require("https");
        var Url = require('url');
    }

    ////
    // Utils
    ////

    // Merges two (or more) objects,
    // @TODO improve
    var mergeHash = function(destination, source) {
        var shallowProperties = ['data'];
        for (var property in source) {
            if(shallowProperties.indexOf(property) > -1){
                destination[property] = source[property];
                continue;
            }
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                mergeHash(destination[property], source[property]);
                continue;
            }
            destination[property] = source[property];
        }
        return destination;
    };

    //// parse JSON
    var _parseRequestBody = function(body, config) {
        if(config.responseType === 'json'){
            try{
                return JSON.stringify(body);
            }catch(e){
                //@TODO
                console.error(e);
            }
        }
        return body;
    };

    //// parse JSON
    var _parseResponseBody = function(body, config) {
        if(config.responseType === 'json'){
            try{
                return JSON.parse(body);
            }catch(e){
                //@TODO
                console.error(e);
            }
        }
        return body;
    };

    //// encode a javascript object into a query string
    var _encode2Query = function(obj, prefix) {
        var str = [];
        for(var p in obj) {
            if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push(typeof v == "object" ? _encode2Query(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    };


    ////
    // response
    ////

    var Response = function(){
        this.data = null;
        this.status = null;
        this.statusText = null;
        this.error = false;
    };

    ////
    // request
    ////

    //// XHR request
    var _xhrRequest = function(url, config){

        var xhr = new XMLHttpRequest();
        xhr.open(config.method, url, true);

        // headers
        for (var key in config.headers){
            if(config.headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, config.headers[key]);
            }
        }

        var result = new Response(xhr, config);
        // core
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {

                result.status = xhr.status;
                result.statusText = xhr.statusText;
                result.data =_parseResponseBody(xhr.responseText, config);

                if(xhr.status < 299) {
                    config.success(result, xhr);
                }else{
                    config.error(result, xhr);
                }
                config.always(result, xhr);
            }
        };

        //catches cors requests
        xhr.onerror = function(error){
            result.error = error;
        };

        var data = null;
        if(config.data){
            data = _parseRequestBody(config.data, config);
        }

        xhr.send(data);
        return xhr;
    };

    /// node/http
    var _httpRequest = function(url, config){

        var _url =  Url.parse(url);
        var module = ( _url.protocol == 'https:') ? https : http;
        var data = '';

        var options = {
            host: _url.host,
            path: _url.path,
            query: _url.query + _encode2Query(config.query),
            method: config.method,
            headers: config.headers,
            body: config.data
        };

        if(config.data){
            config.data = _parseRequestBody(config.data, config);
            options.headers['Content-Length'] = Buffer.byteLength(config.data);
        }

        var result = new Response();
        var request = module.request(options, function (res) {
            res.setEncoding('utf8');

            res.on('data', function(chunk){
                // @var res: http.IncomingMessage
                data += chunk;
            });

            res.on('end', function(){

                if(res.statusCode < 299) {

                    result.status = res.statusCode;
                    result.statusText = res.statusMessage;
                    result.data =_parseResponseBody(data, config);

                    config.success(result, res);
                }else{
                    config.error(result, res);
                }
                config.always(result, res);
            });

        });

        if(config.data){
             request.write(config.data);
        }

        request.on('error', function(error) {
            result.error = error;
            config.error(result, request);
        });

        request.end();

        return null;
    };

    ////
    // request api
    ////

    var request = function (url, config) {

        var defaults = {
            method: 'GET',
            query: {},
            headers: {},
            data: null,
            responseType: '',//?TODO
            success: function(){},  //(data, res)
            error: function(){},    //(error, res)
            always: function(){}   //(statusCode, res)
        };

        // data
        if(config.responseType !== 'json' && config.data){
            if(config.headers['Content-Type'] === 'application/json'){
                config.data = JSON.stringify(config.data);
            }else{
                //? header
                config.data = _encode2Query(config.data);
            }
        }

        // query todo NICER!
        var query = [];
        for(var prop in config.query){

            if(config.query.hasOwnProperty(prop)){
                var value;
                var type = Object.prototype.toString.call(config.query[prop]);
                switch(type){
                    case '[object Array]':
                    case '[object Object]':
                        value = encodeURIComponent(JSON.stringify(config.query[prop]));
                    break;
                    default:
                        value = encodeURIComponent(config.query[prop]);
                }
                query.push(encodeURIComponent(prop) + "=" + value);
            }
        }
        if(query.length){
            url = url + '?' + query.join('&');
        }

        // merge config with defaults
        config = mergeHash(defaults, config);

        // invoke request
        if(NODE){
            return _httpRequest(url, config);
        }
        return _xhrRequest(url, config);
    };

    //// json request
    exports.json = function(url, config){
        var defaults = {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'json'
        };
        return request(url, mergeHash(defaults, config));// note the order of merge. default overwrites are allowed
    };

    //// raw request
    exports.raw = function(url, config){
        return request(url, config);// note the order of merge. default overwrites are allowed
    };

    //// reveal
    exports.NODE = NODE;
    exports.mergeHash = mergeHash;
    exports.request = request;

    return exports;
}());

//// node
if(req.NODE){
    module.exports = req;
}

/*req/req.xapi.js*/

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

//# sourceMappingURL=lx-request.js.map