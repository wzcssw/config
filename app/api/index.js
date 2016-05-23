function JoinedApi(app){
    "use strict";
    app.use(require('./user.js'));
    app.use(require('./hospitals.js'));
    app.use(require('./projects.js'));
}

module.exports = JoinedApi;