var session = require('../../common').session;
function Session(){
    "use strict";
    return function *(next){
        //var session = this.cookies.get("session", {signed: true});
        var sessionCookie = this.cookies.get("session");
        if (sessionCookie){
            sessionCookie = new Buffer(sessionCookie, 'base64');
            sessionCookie = sessionCookie.toString();
            sessionCookie = JSON.parse(sessionCookie);
            console.log(sessionCookie.uid);
        }

        session.save({id: 111, username: 'wuyuedefeng', name: 'wangsen'}, function(err, user){
            if (err){
                return console.log(err);
            }
            console.log(user);
        });




        yield  next;
    }
}

module.exports = Session;