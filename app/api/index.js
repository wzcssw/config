function JoinedApi(app){
    "use strict";
    app.use(require('./user.js'));
}

module.exports = JoinedApi;