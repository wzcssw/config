var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/hospitals'
});
router.get('/', function*() {
    "use strict";
    var self = this;
    var page = 1;
    var params = self.query;
    if (params.page != null) {
        page = params.page;
        var result = yield http.get('/v1/config_hospital/list', {
        fields: 'id,name,pinyin,level,city_id,province_id',
        page: page
        }); 
        self.body = {
            success: true,
            hospitals: result.hospitals,
            total_count: result.total_count,
            current_page: result.current_page
        }
    }else{
        var city_result = yield http.get('/v1/config_city/list', {
        fields:'id,name,state'
        });
        var level_result = yield http.get('/v1/config_hospital/hospital_level_list', {
        });
        var arr = city_result.cities;
        var city_arr = [];
        for (var i = 0; i < arr.length ; i++) {
            if(arr[i].state){
                city_arr.push(arr[i]);
            }
        };
        self.body = {
            success: true,
            levels: JSON.parse(level_result.hospital_level),
            cities: city_arr
        };
    };
    
});

router.post('/new_hospital', function *(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var hospital = params.hospital;
    var access = yield http.post('/v1/config_hospital/add', {
      access_token: self.currentUser.access_token,
      name: hospital.name,
      level: hospital.level,
      city_id: hospital.city_id  
    });
    console.log("==========="+access);
    this.body = {success: true};
});

router.put('/edit_hospital', function *(){
    "use strict";
    var self = this;
    var hospital = self.request.body.hospital;
    var access = yield http.put('/v1/config_hospital/update', {
      access_token: self.currentUser.access_token,
      hospital_id: hospital.id,
      name: hospital.name,
      level: hospital.level,
      city_id: hospital.city_id  
    });
    this.body = {success: true};
});

module.exports = router.routes();
