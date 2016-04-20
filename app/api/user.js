var session = require('../common').session;
var router = require('koa-router')({
    prefix: '/api/users'
});

router.get('/login', function *(){
    "use strict";
    console.log('login...');
    this.body = {success: true};
});

router.post('/register', function *(){
    "use strict";
    var params = this.request.body;
    var self = this;

    yield new Promise((resolve, reject) => {
        session.save({username: params.username}, function(err, user){
            if (err){
                reject();
                return self.body = {success: false};
            }
            self.cookies.set("uid", user.uid, {signed: true});
            self.body = {success: true};
            resolve();
        });
    });

});

module.exports = router.routes();