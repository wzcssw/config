var redis = require("redis");

rdb = redis.createClient();

// 选择数据库，比如第5个数据库，默认是第0个
rdb.select(5);

//错误监听
rdb.on("error", function (err) {
    throw(err);
    console.log("Error: " + err);
});

module.exports = rdb;