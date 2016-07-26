/**
 * Created by lxl on 2016/7/26 0026.
 */
var request = require('request');

var apiUrl='http://www.tuling123.com/openapi/api';

var param={
    "key":"a0643c898057d80d2ab6bb71e27e147d"
}

// fs = require('fs');

// Path = require('path');

var chat={};
var content='m天气';
var content=content.trim();
if(content.match(/^m/gi)){
    content=content.substr(1);
    console.log(content);
    param.info=content;
    // param.userid=message.from_uin;
    console.log(param);
    request.post({url:apiUrl,body: JSON.stringify(param)},function (e,r,b) {
        if(e){
            return e;
            console.log(e);

        }else{
            console.log(12);
            try{
                var data =  JSON.parse(b);
            }catch(ee){
                var data = {
                    code:2333,
                    data:[]
                }
            }

            if(data.text.length>0){
                chat.text = data.text;
                console.log(data);
                // send(chat.text);
                return;
            }else{
                return 'data null';
            }

            console.log(data);
        }
    });

}