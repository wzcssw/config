var common = require('../common');
var http = common.http;
var router = require('koa-router')({
  prefix: '/api/hospitals'
});

//获取医院列表
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
  var result = yield http.get('/v1/config_hospital/list', {
  fields: 'id,name,pinyin,level,city_id,province_id,nature',
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

//添加医院
router.post('/new_hospital', function *(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var hospital = params.hospital;
  var access = yield http.post('/v1/config_hospital/add', {
    access_token: self.currentUser.access_token,
    name: hospital.name,
    level: hospital.level,
    city_id: hospital.city_id,
    nature: hospital.nature
  });
  this.body = {success: true};
});

//更新医院
router.put('/edit_hospital', function *(){
  "use strict";
  var self = this;
  var hospital = self.request.body.hospital;
  var access = yield http.put('/v1/config_hospital/update', {
    access_token:self.currentUser.access_token,
    hospital_id:hospital.id,
    name:hospital.name,
    level:hospital.level,
    city_id:hospital.city_id,
    nature:hospital.nature
  });
  this.body = {success: true};
});

//获取等级和城市列表
router.get('/options_attr', function*() {
  "use strict";
  var self = this;
  var city_result = yield http.get('/v1/config_city/open_city_list', {
  fields:'id,name,state'
  });
  var level_result = yield http.get('/v1/config_hospital/hospital_level_list', {
  });
  var nature_result = yield http.get('/v1/config_hospital/hospital_nature_list', {
  });
  // var arr = city_result.cities;
  // var city_arr = [];
  // for (var i = 0; i < arr.length ; i++) {
  //   if(arr[i].state){
  //       city_arr.push(arr[i]);
  //   }
  // };
  self.body = {
    success: true,
    levels: JSON.parse(level_result.hospital_level),
    cities: city_result.cities,
    natures: JSON.parse(nature_result.hospital_nature)
  };     
});

module.exports = router.routes();
