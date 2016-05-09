var raven = require('raven');
var client = new raven.Client('http://fc9cac2d0ee64de386b0c9ae1b09d6eb:49677cc8d42040e8ad1a586e91a377e0@101.201.210.99:9000/4');

client.patchGlobal();

try {
    var a = 1/0;
} catch (err) {
    client.captureException(err)
}