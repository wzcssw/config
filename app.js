var app = require('koa')();
var render = require('koa-ejs');
var mdKoa =require('./middleware/koa');

render(app, {
    root: './app/views',
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: true
});

// error
app.use(mdKoa.error());
// logger
app.use(mdKoa.logger());
// 404
app.use(mdKoa.notFound());

// response

app.use(function *(){
    yield this.render('test');
});

module.exports = app;
if (!module.parent) {
    app.listen(3000);
}