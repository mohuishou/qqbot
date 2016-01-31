'use strict';

var xiaohua = {};

xiaohua.name = 'xiaohua';

xiaohua.keywords = ['小花'];

xiaohua.execute = function(cb){
    cb(null,'小花萌萌哒');
}


module.exports = xiaohua;