var http = require('../common').http;
var router = require('koa-router')({
    prefix: '/api/hospitals'
});

router.get('/hospitals', function *(){
    "use strict";
    var hos_list = yield http.get('/v1/config_hospital/list', {
      fields: 'id,name,pinyin,level,city_id,lng,lat,address,province_id',
      page: this.query.page
    });
    this.body = {success: true, hospitals: hos_list.hospitals};
    console.log(hos_list);
});

module.exports = router.routes();