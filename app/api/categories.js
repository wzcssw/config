var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/categories'
});

router.get('/', function*(){
    "use strict";
    var self = this;
    var page = 1;
    var params = self.query;
    if (params.page != null) {
       page = params.page;
    }
    params.fields = 'id,name,created_at,body_name,body_mode_name,project_name,flag';
    var result = yield http.get('/v1/category/list', params);
    self.body = {
        success:true,
        categories:result.categories,
        total_count: result.total_count,
        current_page: result.current_page
    }
});

module.exports = router.routes();
