var crypto = require('crypto');
var md5 = crypto.createHash('md5');
module.exports = function(params){
    "use strict";
    var keys = Object.keys(params).sort();
    var paramsString = params.app_token;
    keys.forEach(function (key) {
        if (key == 'sign') return true;
        paramsString += (key + params[key])
    });
    paramsString += params.app_token;
    return md5Encryption(paramsString).toUpperCase();
};

function md5Encryption(string){
    "use strict";
    md5.update(string);
    return md5.digest('hex');
}