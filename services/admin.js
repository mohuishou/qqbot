'use strict';

var admin = {};

admin.name = 'admin';

admin.keywords = [];

admin.execute = function(msg,cb){
    var command = msg.content.split(' ');
    var request = require('request');
    var options = {
        url: 'http://127.0.0.1:1899/replyFromQQ',
        method: 'post',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/json'
        },
        json: {
            to:command[0],
            content:command[1]
        }
    }

    request(options, function (e, r) {
        console.log(e, r);
        cb(e,r);
    });
    //cb(null,'world');
}


module.exports = admin;