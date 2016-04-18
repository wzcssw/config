exports.users = require('./users');


var router = require('koa-router')();

router.get('/', function *(){
    "use strict";
    yield this.render('/templates/index');
});

exports.root = router;