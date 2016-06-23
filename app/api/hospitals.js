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

router.get('/get_hospital_projects', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var result = yield http.get('/v1/hospital/hospital_projects', {
    fields: 'id,status,mbf',
    hospital_id: params.hospital_id
  });
  self.body = {
    success: true,
    projects: result.hospital_projects
  }
})

router.put('/edit_hospital_projects', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  if(params.field=="status"){
    if(params.status==null){
      params.status = 'default';
    };
    var access = yield http.put('/v1/hospital/edit_hospital_projects', {
      access_token: self.currentUser.access_token,
      id: params.id,
      field: params.field,
      status: params.status
    })
    this.body = {success: true};
  }else{
    var access = yield http.put('/v1/hospital/edit_hospital_projects', {
      access_token: self.currentUser.access_token,
      id: params.id,
      field: params.field,
      mbf: params.mbf
    })
    this.body = {success: true};
  }
})

router.put('/edit_hospital_assistants', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var hospital_assistant = params.hospital_assistant;
  var access = yield http.put('/v1/hospital/edit_hospital_assistants', {
    access_token: self.currentUser.access_token,
    id: hospital_assistant.id,
    name: hospital_assistant.name,
    phone: hospital_assistant.phone,
    address: hospital_assistant.address,
    state: hospital_assistant.state,
    remark: hospital_assistant.remark
  });
  this.body = {success: true};
})

router.get('/delete_hospital_assistants', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var result = yield http.delete('/v1/hospital/delete_hospital_assistants', {
    id: params.id
  });
  self.body = {
    success: true,
    projects: result.hospital_projects
  }
})

router.post('/add_hospital_assistants', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var assistant = params.assistant;
  if(assistant.state==null){
    assistant.state = "isnotsend";
  }
  if(assistant.remark==null){
    assistant.remark = "";
  }
  if(assistant.address==null){
    assistant.address = "";
  }
  var access = yield http.post('/v1/hospital/add_hospital_assistants', {
    access_token: self.currentUser.access_token,
    hospital_id: assistant.hospital_id,
    name: assistant.name,
    phone: assistant.phone,
    address: assistant.address,
    state: assistant.state,
    remark: assistant.remark
  });
  this.body = {success: true};
})

module.exports = router.routes();
