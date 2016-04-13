var redis = require("redis");
rdb = redis.createClient();

module.exports = rdb;
