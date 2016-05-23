var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/hospitals'
});
router.get('/', function*() {
    "use strict";
    var self = this;
    var hospitals;
    var page = 1;
    var params = self.query;
    if (params.page != null) {
        page = params.page;
    }
    var result = yield http.get('/v1/config_hospital/list', {
        fields: 'id,name,pinyin,level,city_id,province_id',
        page: page
    });
    hospitals = JSON.stringify(result.hospitals);
    self.body = {
        success: true,
        hospitals: hospitals,
        total_count: result.total_count,
        current_page: result.current_page
    }
});

module.exports = router.routes();
