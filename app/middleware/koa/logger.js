function Logger(){
    "use strict";
    return function *(next){
        var start = new Date;
        yield next;
        var ms = new Date - start;
        console.log('%s %s - %sms', this.method, this.url, ms);
    }
}

module.exports = Logger;