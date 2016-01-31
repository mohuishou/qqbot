'use strict';
var request = require('request');
var scuinfo = {};



scuinfo.random = function(from,start){
    
    
   return Math.floor(Math.random()*(start-from+1))
};

scuinfo.test = function(cb){
    var url = 'http://scuinfo.com/api/hot';
    request(url,function(e,r,b){

        if(e){
            cb(null,e.message);
            return;
        }else{

            try{
               var data =  JSON.parse(b);
            }catch(ee){
                var data = {
                    code:2333,
                    data:[]
                }
            }

            if(data.data.length>0){
                var index = scuinfo.random(0,data.data.length);
                cb(null,data.data[index].content+" 原帖网址:"+"http://scuinfo.com/p/"+data.data[index].id+"/");
                return;
            }else{
                cb(null,'现在scuinfo.com啥都没有');
                return;
            }
        }
    });
};
//scuinfo.test(function(e,r){
//    console.log(e,r);
//});

scuinfo.name = 'scuinfo';

scuinfo.keywords = ['scuinfo','s'];

scuinfo.execute = function(cb){
    var url = 'http://scuinfo.com/api/hot';
    request(url,function(e,r,b){

        if(e){
            cb(null,e.message);
            return;
        }else{

            try{
                var data =  JSON.parse(b);
            }catch(ee){
                var data = {
                    code:2333,
                    data:[]
                }
            }

            if(data.data.length>0){
                var index = scuinfo.random(0,data.data.length-1);
                cb(null,data.data[index].content+" 原帖网址:"+"http://scuinfo.com/p/"+data.data[index].id+"/");
                return;
            }else{
                cb(null,'现在scuinfo.com啥都没有');
                return;
            }
        }
    });
};


module.exports = scuinfo;