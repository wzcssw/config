var app = require('koa')();
var render = require('koa-ejs');
var staticServe = require('koa-static');
var mdKoa =require('./app/middleware/koa');

app.keys = ['TXPrice', 'DoNode'];

app.use(staticServe('./app/public'));
app.use(staticServe('./app/bower_components'));
app.use(staticServe('./app/views'));
render(app, {
    root: './app/views',
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: true
});

// error
app.on('error', function(err,ctx){
    console.log('app--err', err);
});
// session
app.use(mdKoa.Session());
// logger
app.use(mdKoa.Logger());
// 404
app.use(mdKoa.NotFound());

// response
require('./app/routes')(app);
require('./app/api')(app);


module.exports = app;
if (!module.parent) {
    app.listen(3000);
}