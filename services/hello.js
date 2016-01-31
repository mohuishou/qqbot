'use strict';

var hello = {};

hello.name = 'hello';

hello.keywords = ['hello'];

hello.execute = function(cb){
    cb(null,'world');
}


module.exports = hello;