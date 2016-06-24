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
    fields: 'id,project_id,status,mbf,windows_phone,app_make_sms,inspection_notes',
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
  var access = yield http.put('/v1/hospital/edit_hospital_projects', {
    access_token: self.currentUser.access_token,
    id: params.project.id,
    status: params.project.status?params.project.status:'',
    mbf: params.project.mbf,
    windows_phone: params.project.windows_phone?params.project.windows_phone:'',
    app_make_sms: params.project.app_make_sms?params.project.app_make_sms:'',
    inspection_notes: params.project.inspection_notes?params.project.inspection_notes:''
  })
  this.body = {success: true};
})

router.post('/update_inspection_workflows', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.post('/v1/hospital/update_inspection_workflows', {
    access_token: self.currentUser.access_token,
    hospital_project_id: params.hospital_project_id,
    inspection_workflows: JSON.stringify(params.inspection_workflows)
  });
  this.body = {success: true};
})

router.get('/get_hospital_resources', function*(){
  "use strict";
  var self = this;
  var params = self.query;
  var result = yield http.get('/v1/hospital/get_hospital_resources', {
    hospital_id: params.hospital_id,
    project_id: params.project_id
  });
  this.body = {
    success: true,
    co_hospital_resource: result.co_hospital_resource,
    co_appointment_config: result.co_appointment_config
  };
})

router.put('/edit_hospital_resources', function*(){
  "use strict";
  var self = this;
  var params = self.request.body;
  var access = yield http.put('/v1/hospital/edit_hospital_resources', {
    access_token: self.currentUser.access_token,
    hospital_id: params.co_hospital_resource.hospital_id,
    project_id: params.co_hospital_resource.project_id,
    device_count: params.co_hospital_resource.device_count?params.co_hospital_resource.device_count:'',
    device_hour_output: params.co_hospital_resource.device_hour_output?params.co_hospital_resource.device_hour_output:'',
    opration_expire_time: params.co_appointment_config.opration_expire_time?params.co_appointment_config.opration_expire_time:'',
    begin_at: params.co_appointment_config.begin_at?params.co_appointment_config.begin_at:'',
    end_at: params.co_appointment_config.end_at?params.co_appointment_config.end_at:''
  });
  this.body = {
    success: true
  };
})

module.exports = router.routes();
