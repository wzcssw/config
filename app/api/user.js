var session = require('../common').session;
var router = require('koa-router')({
    prefix: '/api/users'
});

router.post('/login', function *(){
    "use strict";
    var params = this.request.body;
    var self = this;

    yield new Promise((resolve, reject) => {
        session.getUserByUname(params.username, function(err, user){
            if (err){
                self.body = {success: false};
                reject(err);
            }
            resolve(user);
        });
    }).then(function(user){
        console.log(user);
        self.cookies.set("uid", user.uid, {signed: true});
        self.body = {success: true};
    });

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