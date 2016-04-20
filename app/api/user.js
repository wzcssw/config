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
    console.log(this.request.body);
    this.body = {success: true};
});

module.exports = router.routes();