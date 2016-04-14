var redis = require("redis");

rdb = redis.createClient();

// 选择数据库，比如第5个数据库，默认是第0个
rdb.select(5);
rdb.set('test_key', 'test_value1');
rdb.expire('test_key', 5);
rdb.get('test_key', function(err, value){
    if (err) throw(err);
    console.log('test_key:' + value);
});

//错误监听
rdb.on("error", function (err) {
    throw(err);
    console.log("Error: " + err);
});

module.exports = rdb;
