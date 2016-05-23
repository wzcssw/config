/**
 * Created by tx-0020 on 16/5/23.
 */
var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/cities'
});

router.get('/', function*(){
    "use strict";
    console.log("---------------------");
    var self = this;
    var page = 1;
    var params = self.query;
    if (params.page != null) {
        page = params.page;
    }
    var result = yield http.get('/v1/config_city/list', {
        fields:'id,name,pinyin,province_id,state,go_public_sea_day,develop_coefficient,maturity',
        page:page
    });
    self.body = {
        success:true,
        cities:result.cities,
        total_count: result.total_count,
        current_page: result.current_page
    }
});

module.exports = router.routes();