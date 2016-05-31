var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/projects'
});
router.get('/', function*() {
    "use strict";
    var params = this.query || {};
    for (var key in params){
        if (!params[key]) delete params[key];
    }
    if (params['categoryZh']){
        if (params['categoryZh'] == '检查'){
            params['category_id'] = 1;
        } else if (params['categoryZh'] == '检验'){
            params['category_id'] = 2;
        }
        delete params['categoryZh'];
    }
    params['page'] = params['page'] || 1;
    params['limit'] = 100;
    params['fields'] = 'id,name,category_id,rank,created_at,updated_at';
    var result = yield http.get('/v1/project/list', params);
    this.body = {
        success: true,
        result: result
    };
});

module.exports = router.routes();
