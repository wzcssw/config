function JoinedApi(app){
    "use strict";
    app.use(require('./user.js'));
    app.use(require('./hospitals.js'));
}

module.exports = JoinedApi;