'use strict';

var fs = require('fs');
var index = {};

index.services = {};

index.map = {};

fs.readdir('./services', function (e, r) {
    if(!e){
        for(var k in r){
            if(r[k]=='index.js')continue;

            var _s = require('./'+r[k]);
            if(_s.name && _s.keywords && _s.execute){
                for(var i in _s.keywords){
                    index.map[_s.keywords[i]] = _s.name;
                }
                index.services[_s.name] = _s;
            }
        }
    }
});


module.exports = index;