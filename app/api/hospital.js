var http = require('../common').http;
var router = require('koa-router')({
    prefix: '/api/hospitals'
});

router.get('/', function *(){
    "use strict";
    this.body = {success: true}
});

module.exports = router.routes();