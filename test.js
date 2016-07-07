const addon = require('./build/Release/addon');

var obj1 = addon('pubs');
var obj2 = addon('subs');
console.log(obj1.msg + ' ' + obj2.msg);
