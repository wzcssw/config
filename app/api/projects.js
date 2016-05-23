var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/projects'
});
router.get('/', function*() {
    "use strict";
    var self = this;

});

module.exports = router.routes();