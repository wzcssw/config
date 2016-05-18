function JoinedApi(app){
    "use strict";
    app.use(require('./user.js'));
    app.use(require('./hospital.js'));
}

module.exports = JoinedApi;