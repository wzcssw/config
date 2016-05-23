var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/projects'
});
router.get('/', function*() {
    "use strict";
    var params = this.query;
    var result = yield http.get('/v1/config_project/list', {
        page: params['page'] || 1,
        fields: 'id,name,remark,created_at,price,tip_flag,favorite,category_id,rank'
    });
    this.body = {
        success: true,
        result: result
    };
});

module.exports = router.routes();