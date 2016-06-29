var common = require('../common');
var http = common.http;
var router = require('koa-router')({
  prefix: '/api/body_modes'
});

router.get('/', function*(){
    "use strict";
    var self = this;
    var page = 1;
    var params = self.query;
    params.fields = 'id,body_id,name,price,created_at,remark,rank,details';
    var result = yield http.get('/v1/body_mode/list', params);
    self.body = {
        success:true,
        body_modes:result.body_modes,
        total_count:result.total_count,
        current_page:result.current_page
    }
});

router.put('/edit_body_mode', function*(){
    "use strict";
    var self = this;
    var body_mode = self.request.body.body_mode;
    var access = yield http.put('/v1/body_mode/update',{
        access_token:self.currentUser.access_token,
        id:body_mode.id,
        name:body_mode.name,
        details:body_mode.details,
        remark:body_mode.remark
    });
    self.body = {success:true};
});

router.put('/edit_rank', function*(){
    "use strict";
    var self = this;
    var body_mode = self.request.body.body_mode;
    var access = yield http.put('/v1/body_mode/update_rank',{
        access_token:self.currentUser.access_token,
        id:body_mode.id,
        rank:body_mode.rank
    });
    console.log(access);
    self.body = {success:true};
})

module.exports = router.routes();