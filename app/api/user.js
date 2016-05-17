var session = require('../common').session;
var router = require('koa-router')({
    prefix: '/api/users'
});

router.post('/login', function *(){
    "use strict";
    var params = this.request.body;
    console.log(params);
    var self = this;
    //yield new Promise((resolve, reject) => {
    //    session.getUserByUname(params.username, function(err, user){
    //        if (err){
    //            self.body = {success: false};
    //            reject(err);
    //        }
    //        resolve(user);
    //    });
    //}).then(function(user){
    //    console.log('====');
    //    console.log(user);
    //    self.cookies.set("uid", user.uid, {signed: true});
    //    self.body = {success: true};
    //});

    var http = require('../common').http;
    var access = yield http.post('/v1/login', {
        login_type: 'user',
        login: params.username,
        password: params.password
    });
    var info = yield http.get('/v1/account_info', {
        login_type: 'user',
        access_token: access.access_token
    });
    var userInfo = info.data;

    var customInfo = {
        access_token: access.access_token,
        id: userInfo.id,
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        role: userInfo.role,
        realname: userInfo.realname
    };
    yield new Promise((resolve, reject) => {
        session.save(customInfo, function(err, user){
            if (err){
                self.body = {success: false};
                reject(err);
            }
            resolve(user);
        });
    }).then(function(user){
        console.log(user);
        self.cookies.set("uid", user.uid, {signed: true});
        self.body = {success: true, user: user};
    });

});

router.post('/register', function *(){
    "use strict";
    console.log(this.currentUser);
    this.body = {success: true, user: '11'};
});

module.exports = router.routes();