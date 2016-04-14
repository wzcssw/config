var redis = require('../db').redis;
function Session(){
    "use strict";
    return function *(next){
        //var session = this.cookies.get("session", {signed: true});
        var session = this.cookies.get("session");
        if (session){
            session = new Buffer(session, 'base64');
            session = session.toString();
            session = JSON.parse(session);
        }

        console.log(session.uid);
        yield  next;
    }
}

module.exports = Session;