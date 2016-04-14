var redis = require("redis");
rdb = redis.createClient();

redisClient = redis.createClient();

// 选择数据库，比如第3个数据库，默认是第0个
redisClient.select(5, function(err, result) {
    if (err) throw err;

    redisClient.set('test_key', 'test_value1');
    redisClient.expire('test_key', 5);
    redisClient.get('test_key', function(err, value){
        if (err) throw(err);
        console.log('test_key:' + value);
    });
});

//错误监听
redisClient.on("error", function (err) {
    throw(err);
    console.log("Error: " + err);
});

module.exports = rdb;
