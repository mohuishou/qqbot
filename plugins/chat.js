// Generated by CoffeeScript 1.10.0

/*

 插件支持两个方法调用
 init(robot)
 received(content,send,robot,message)
 stop(robot)

 1.直接使用
 module.exports = func 为快捷隐式调用 received 方法
 2.或
 module.exports = {
 init:      init_func       # 初始化调用
 received:  received_func   # 接受消息
 stop:      init_func       # 停止插件（比如端口占用）
 }
 */

(function() {
    var request = require('request');

    var apiUrl='http://www.tuling123.com/openapi/api';

    var param={
        "key":"a0643c898057d80d2ab6bb71e27e147d"
    }

    // fs = require('fs');

    // Path = require('path');

    var chat={};

    var users={};

    // users.prototype.indexOf = function(val) {
    //     for (var i = 0; i < this.length; i++) {
    //         if (this[i] == val) return i;
    //     }
    //     return -1;
    // };
    //
    // users.prototype.remove = function(val) {
    //     var index = this.indexOf(val);
    //     if (index > -1) {
    //         this.splice(index, 1);
    //     }
    // };
    /*
     @param content 消息内容
     @param send(content)  回复消息
     @param robot qqbot instance
     @param message 原消息对象
     */

    chat.turing=function (content,message,send) {
        param.info=content;
        param.userid=message.from_uin;
        request.post({url:apiUrl,body: JSON.stringify(param)},function (e,r,b) {
            if(e){
                return e;
            }else{

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
                    send(chat.text);
                    return;
                }else{
                    return 'data null';
                }

                console.log(data);
            }
        });
    }

    module.exports = function(content, send, robot, message) {
        content=content.trim();

        //消息来自于好友或者讨论组
        if(message.type==='message'||message.type==='sess_message'){

            //判断对象中是否存在该属性
            if(!users[message.from_uin]){
                users[message.from_uin]={};
                users[message.from_uin].check_on=0;
            }

            //开启聊天模式
            if(users[message.from_uin].check_on!=1){
                if(content=='聊天'){
                    users[message.from_uin].last=new Date().getTime();
                    send("开启聊天模式");
                    users[message.from_uin].check_on=1;
                }
                return;
            }

            //退出聊天模式
            if(content=='退出'){
                users[message.from_uin].last=new Date().getTime();
                send("退出聊天模式");
                users[message.from_uin].check_on=0;
                return;
            }

            //聊天时间间隔五分钟退出聊天模式
            if(new Date().getTime()-users[message.from_uin].last>300*1000){
                send("由于距离上次回复时间过长，已退出聊天模式");
                users[message.from_uin].check_on=0;
                return;
            }

            users[message.from_uin].last=new Date().getTime();

            console.log(content);
            chat.turing(content,message,send);
            //消息来自于群组时
        }else if(message.type==='group_message') {
            if (content.match(/^m/gi)) {
                content=content.substr(1);
                if (!users[message.group_code]) {
                    users[message.group_code] = {};
                    users[message.group_code].check_on = 0;
                }
                if(message.from_user.nick == '莫，回首'){
                    if (users[message.group_code].check_on != 1 ) {
                        if(content=='聊天'){
                            users[message.group_code].last=new Date().getTime();
                            send("开启聊天模式");
                            users[message.group_code].check_on=1;
                        }
                        return;
                    }

                    //退出聊天模式
                    if(content=='退出'){
                        users[message.group_code].last=new Date().getTime();
                        send("退出聊天模式");
                        users[message.group_code].check_on=0;
                        return;
                    }
                }

                if(users[message.group_code].check_on != 1){
                    return -1;
                }


                //聊天时间间隔五分钟退出聊天模式
                if(new Date().getTime()-users[message.group_code].last>300*1000){
                    send("由于距离上次回复时间过长，已退出聊天模式");
                    users[message.group_code].check_on=0;
                    return;
                }

                users[message.group_code].last=new Date().getTime();
                chat.turing(content,message,send);

            }
        }

    };

}).call(this);
