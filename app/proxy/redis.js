var rdb = require('../../middleware/db').redis;

var getUserByUid = function (uid, cb){
    "use strict";
    rdb.hgetall('session:user:' + uid, function(err, user){
        cb(err, user);
    });
};

function getUidByUname(uname, fn){
    rdb.get('session:uid:' + uname, function(err, uid){
        fn(err, uid);
    });
}


var save = function(user, cb){
    "use strict";
    // 这里可以自定义uname, 提供修改接口
    var uname = user.username;
    user.uname = uname;

    getUidByUname(uname, function(err, uid){
        if (err) cb(err);
        if (uid){
            user.uid = uid;
            console.log('uid', uid);
            update(user, cb);
        }else {
            rdb.incr('session:ids', function(err, uid){
                if (err) return cb(err);
                user.uid = uid;
                console.log('uid', uid);
                update(user, cb);
            })
        }
    });
};

function update(user, cb){
    var uid = user.uid;
    console.log(user);
    rdb.set('session:uid:' + user.uname, uid, function(err){
        if (err) return cb(err);
        delete user.uid;
        delete user.uname;
        rdb.hmset('session:user:' + uid, user, function(err, user){
            cb(err, user);
        });
    });
}

module.exports.save = save;
module.exports.getUserByUid = getUserByUid;

