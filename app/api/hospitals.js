var common = require('../common');
var http = common.http;
var router = require('koa-router')({
  prefix: '/api/hospitals'
});

router.get('/', function*() {
  "use strict";
  var self = this;
  var page = 1;
  var q = "";
  var city_id = "";
  var params = self.query;
  if (params.page != null) {
    page = params.page;
  };
  if (params.q!= null||params.city_id!=null) {
    q = params.q;
    city_id = params.city_id;
  };
  var result = yield http.get('/v1/hospital/list', {
  fields: 'id,name,remark,created_at,address,bus_line,flag,mbf,intro,map_image,location,lng,lat,city_id,dic_hospital_id,is_opened_system,name_code,email,should_send_email',
  page: page,
  q: q,
  city_id: city_id
  });
  self.body = {
    success: true,
    hospitals: result.hospitals,
    total_count: result.total_count,
    current_page: result.current_page,
  }
});

module.exports = router.routes();
