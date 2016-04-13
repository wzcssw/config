var router = require('koa-router')({
    prefix: '/users'
});

router.get('/', function *(){
    "use strict";
    yield this.render('test');
});

module.exports = router;