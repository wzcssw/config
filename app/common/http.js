var http = require('http');
var moment = require('moment');
var querystring = require('querystring');
var _ = require('underscore');
var sign = require('./http/sign');
var config = require('../../config')();
var apiConfig = config['api'];

var commonParams = {
    app_key: apiConfig.key,
    access_token: apiConfig.token,
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
        var postData = querystring.stringify(params);

        var options = {
            hostname: apiConfig.host,
            path: url,
            port: 80,
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

