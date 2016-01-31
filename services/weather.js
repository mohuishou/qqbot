'use strict';

var weather = {};

weather.name = 'weather';

weather.keywords = ['天气'];

weather.execute = function(cb){
    cb(null,'weather test');
}


module.exports = weather;