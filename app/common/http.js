var http = require('http');
var moment = require('moment');
var querystring = require('querystring');
var _ = require('underscore');
var sign = require('./http/sign');
var config = require('../../config')();
var apiConfig = config['api'];

var commonParams = {
    app_key: apiConfig.key,
    app_token: apiConfig.token,
    timestamp: '',
    sign: ''
};

function request(url, method, params){
    "use strict";
    return new Promise((resolve, reject) => {
        method = method || 'GET';
        _.extend(params, commonParams);
        params.timestamp = moment().subtract(100, 'seconds').format('YYYY-MM-DD HH:mm:ss');
        params.sign = sign(params);
        console.log(params);
        var postData = querystring.stringify(params);

        var headers = {};
        if(method.match(/get/i)){
            url = url + '?' + postData;
            console.log(url);
        }else {
            headers["Content-Type"] = 'application/x-www-form-urlencoded; charset=UTF-8';
            headers["Content-Length"] = postData.length;
        }

        var options = {
            hostname: apiConfig.host,
            path: url,
            port: apiConfig.port,
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "Content-Length": postData.length
            }
        };

        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function(){
                console.log('----', data);
                resolve(data);
            });
        });

        req.on('error', function (e) {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

exports.post = function (url, params){
    "use strict";
    var params = params || {
            login_type: 'user',
            login: 'wangsen',
            password: '123456'
        };
    return request(url, 'POST', params);
};

exports.get = function(url, params){
    "use strict";
    var params = params || {
            fields: 'id,name,pinyin,level,city_id,lng,lat,address,province_id'
        };
    return request(url, 'GET', params);
};

