var common = require('../common');
var http = common.http;
var router = require('koa-router')({
    prefix: '/api/bodies'
});

router.get('/', function*(){
    "use strict";
    var self = this;
    var page = 1;
    var params = self.query;
    if (params.page != null) {
       page = params.page;
    }
    params.fields = 'id,name,price,created_at,rank,category_id';
    var result = yield http.get('/v1/body/list', params);
    self.body = {
        success:true,
        bodies:result.bodies,
        total_count: result.total_count,
        current_page: result.current_page
    }
});

router.post('/new_body', function*(){
    "use strict";
    var self = this;
    var params = self.request.body;
    var body = params.body;
    var access = yield http.post('/v1/body/add', {
      access_token: self.currentUser.access_token,
      name: body.name,
      category: body.category
    });
    console.log(access.body);
    this.body = {success: true};
});

module.exports = router.routes();
