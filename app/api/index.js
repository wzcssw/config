function JoinedApi(app){
    "use strict";
    app.use(require('./user.js'));
    app.use(require('./hospitals.js'));
    app.use(require('./projects.js'));
    app.use(require('./cities.js'));
    app.use(require('./bodies.js'));
    app.use(require('./categories.js'));
}

module.exports = JoinedApi;
