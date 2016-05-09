var app = require('koa')();
var render = require('koa-ejs');
var bodyParser = require('koa-bodyparser');
var staticServe = require('koa-static');
var config = require('./config')();
var mdKoa =require('./app/middleware/koa');

app.keys = ['TXPrice', 'DoNode'];

// 静态文件目录
app.use(staticServe('./app/public'));
app.use(staticServe('./bower_components'));
app.use(staticServe('./app/views'));
// 处理post参数到app(this.request.body)中
app.use(bodyParser());
render(app, {
    root: './app/views',
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: true
});

/**
 * error
 */
app.on('error', function(err,ctx){
    console.log('app--err', err);
});

/**
 * session
 */
app.use(mdKoa.Session());

/**
 * logger
 */
app.use(mdKoa.Logger());

/**
 * 404
 */
app.use(mdKoa.NotFound());

/**
 * response
 */
require('./app/routes')(app);
require('./app/api')(app);

module.exports = app;
if (!module.parent) {
    app.listen(config.port, function(){
        "use strict";
        console.log('app has run at port of ' + config.port );
    });
}




//var http = require('http');
//var moment = require('moment');
//var config = require('./config')();
//var querystring = require('querystring');
//
//var apiConfig = config.api;
//var params = {
//    app_key: apiConfig.key,
//    access_token: apiConfig.token,
//    timestamp: moment().subtract(100, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
//    login_type: 'user',
//    login: 'wangsen',
//    password: '123456'
//};
//function getSign(params){
//    var crypto = require('crypto');
//    var md5 = crypto.createHash('md5');
//    var paramsString = querystring.stringify(params).split('&').sort().join('').split('=').join('');
//    paramsString = querystring.unescape(paramsString);
//    md5.update(apiConfig.token +  paramsString + apiConfig.token);
//    var result = md5.digest('hex').toUpperCase();
//    return result;
//}
//params.sign = getSign(params);
////params.timestamp = querystring.escape(params.timestamp);
//var postData = querystring.stringify(params);
//
//var options = {
//    hostname: apiConfig.host,
//    path: '/v1/login',
//    port: 80,
//    method: 'POST',
//    headers: {
//        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//        "Content-Length": postData.length
//    }
//};
//
//var req = http.request(options, function (res) {
//    console.log('STATUS: ' + res.statusCode);
//    console.log('HEADERS: ' + JSON.stringify(res.headers));
//    res.setEncoding('utf8');
//    res.on('data', function (chunk) {
//        console.log('===================success');
//        console.log('BODY: ' + chunk);
//    });
//});
//
//req.on('error', function (e) {
//    console.log('===================err');
//    console.log('problem with request: ' + e.message);
//});
//
//// write data to request body
//req.write(postData);
//req.end();