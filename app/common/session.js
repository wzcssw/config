var rdb = require('../middleware/db').redis;

var getUserByUid = function (uid, cb){
    "use strict";
    rdb.hgetall('session:user:' + uid, function(err, user){
        cb(err, user);
    });
};


var getUserByUname = function(uname, cb){
    "use strict";
    getUidByUname(uname, function(err, uid){
        if (err) return cb(err);
        getUserByUid(uid, cb);
    });
};

function getUidByUname(uname, cb){
    rdb.get('session:uid:' + uname, function(err, uid){
        cb(err, uid);
    });
}


var save = function(user, cb){
    "use strict";
    // 这里可以自定义uname, 提供修改接口
    var uname = user.username;
    user.uname = uname;

    getUidByUname(uname, function(err, uid){
        if (err) return cb(err);
        if (uid){
            // 若想多点登录，直接使用原来的uid
            //user.uid = uid;
            //更新用户信息（可选）
            //update(user, cb);

            // 若想单点登录,先删除已有用户,创建新的reids_id(uid)即可
            // 删除原来的用户创建新的,保证每次save只保留一个新创建的用户
            rdb.del('session:uid:' + user.uname, function(err){
                if (err) return cb(err);
                rdb.del('session:user:uid', function(err){
                    if (err) return cb(err);
                    createNew(user, cb);
                });
            });

        }else {
            createNew(user, cb);
        }
    });
};

function createNew(user, cb){
    "use strict";
    rdb.incr('session:ids', function(err, uid){
        if (err) return cb(err);
        user.uid = uid;
        update(user, cb);
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

exports.save = save;
exports.getUserByUid = getUserByUid;
exports.getUserByUname = getUserByUname;

