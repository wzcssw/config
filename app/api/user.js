var session = require('../common').session;
var router = require('koa-router')({
    prefix: '/api/users'
});

router.post('/login', function *(){
    "use strict";
    //console.log('1111111');
    //var params = this.request.body;
    //var self = this;
    //yield new Promise((resolve, reject) => {
    //    session.getUserByUname(params.username, function(err, user){
    //        if (err){
    //            self.body = {success: false};
    //            reject(err);
    //        }
    //        resolve(user);
    //    });
    //}).then(function(user){
    //    console.log(user);
    //    self.cookies.set("uid", user.uid, {signed: true});
    //    self.body = {success: true};
    //});

    var http = require('../common').http;
    //var data = yield http.post('/v1/login');
    var data = yield http.get('/v1/config_hospital/list');
    this.body = data;

});

router.post('/register', function *(){
    "use strict";
    var params = this.request.body;
    var self = this;

    yield new Promise((resolve, reject) => {
        session.save({username: params.username}, function(err, user){
            if (err){
                self.body = {success: false};
                reject(err);
            }
            resolve(user);
        });
    }).then(function(user){
        console.log(user);
        self.body = {success: true, user: user};
    });

});

module.exports = router.routes();