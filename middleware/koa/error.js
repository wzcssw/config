function error(){
    "use strict";
    return function *(next){
        try {
            yield next;
        } catch (err) {
            this.status = err.status || 500;
            this.type = 'html';
            this.body = '<p>服务器遛弯去了,请稍后再试</p>';
            //this.app.emit('error', err, this);
            console.log(err);
        }
    }
}

module.exports = error;