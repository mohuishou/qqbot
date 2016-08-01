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

    chat.config={
        group:{
            sleep_time:2, //机器人休息间隔，默认5分钟
            say_numbers:4, //一分钟内机器人的发言条数限制
            say_space:5, //几分钟内机器人无回复，自动退出
            clear_time:1, //发送消息数目定时清零时间，默认1分钟

        }
    }


    var users={};

    var date=new Date();

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

    /**
     * 图灵机器人聊天
     * @param content
     * @param message
     * @param send
     */
    chat.turing=function (content,message,send) {
        param.info=content;
        param.userid=message.from_uin;
        param.loc="成都市";
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
                    //文本类消息
                    if(data.code==100000){
                        chat.text = data.text;
                    }else if(data.code==200000){
                        //图片类消息
                        chat.text=data.text+"\n"+data.url;
                    }else if(data.code==302000){
                        //新闻类消息
                        chat.text=data.text+"\n";
                        for (var i=0 ;i<data.list.length;i++){
                            var news=data.list[i];
                            chat.text+=news.article+"\n";
                            chat.text+="点击查看详情"+news.detailurl+"\n";
                            //新闻条数过多会导致发送失败
                            if(i>2){
                                break;
                            }
                        }
                    }else if(data.code==308000){
                        //菜谱类消息
                        chat.text=data.text+"\n";
                        for (var i=0 ;i<data.list.length;i++){
                            var news=data.list[i];
                            chat.text+=news.name+"\n";
                            chat.text+="关键词："+news.info+"\n";
                            chat.text+="点击查看详情"+news.detailurl+"\n";
                            //条数过多会导致发送失败
                            if(i>1){
                                break;
                            }
                        }
                    }
                    send(chat.text);
                    return 1;
                }else{
                    return 'data null';
                }

                console.log(data);
            }
        });
    }

    /**
     * 定时清零
     * @param users_group
     * @param time
     */
    chat.group_reset=function (users_group,time) {
        setInterval(function () {
            if(users_group.msg_numbers){
                users_group.msg_numbers=0;
            }
        },time);
    }
    
    chat.send_user=function (qqbot,user_account,content) {
        qqbot.get_user_uin(user_account,function (e,uin) {
            qqbot.send_message(uin, content, function () { });
        });
    }
    
    chat.send_group=function (qqbot,group_ccount,content) {
        qqbot.get_group_gid(group_ccount,function (err,gid) {
            qqbot.send_message_to_group(gid,content,function () {
            });
        });
    }

    /**
     * 机器人从休眠中恢复
     * @param users_group
     * @param time
     */
    chat.robot_sleep=function (users_group,qqbot,time) {
        setTimeout(function () {
            users_group.check_on=1;

            //提示机器人已复活
            chat.send_group(qqbot,users_group.accout,'我已经休息好啦，不过不要让我再去休息哦！');

            //从休眠中恢复之后last重置
            users_group.last=date.getTime();
        },time)
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
                    users[message.from_uin].last=date.getTime();
                    send("开启聊天模式");
                    users[message.from_uin].check_on=1;
                }
                return;
            }

            //退出聊天模式
            if(content=='退出'){
                users[message.from_uin].last=date.getTime();
                send("退出聊天模式");
                users[message.from_uin].check_on=0;
                return;
            }

            //聊天时间间隔五分钟退出聊天模式
            if(date.getTime()-users[message.from_uin].last>300*1000){
                send("由于距离上次回复时间过长，已退出聊天模式");
                users[message.from_uin].check_on=0;
                return;
            }

            users[message.from_uin].last=date.getTime();

            console.log(content);
            chat.turing(content,message,send);
            //消息来自于群组时
        }else if(message.type==='group_message') {
            if (content.match(/^m/gi)) {
                content=content.substr(1);

                var config=chat.config.group;

                if (!users[message.group_code]) {
                    users[message.group_code] = {};
                    users[message.group_code].accout = message.from_group.account;
                    users[message.group_code].check_on = 0;
                    users[message.group_code].msg_numbers = 0;
                    // chat.send_group(robot,message.from_group.account,date.getHours()+date.getMinutes());
                    chat.group_reset(users[message.group_code],config.clear_time*60*1000);//每分钟清零
                }

                if(message.from_user.nick == '莫，回首'){
                    if (users[message.group_code].check_on != 1 ) {
                        if(content=='聊天'){
                            users[message.group_code].last=date.getTime();
                            send("开启聊天模式");
                            users[message.group_code].check_on=1;
                        }
                        return;
                    }

                    //退出聊天模式
                    if(content=='退出'){
                        users[message.group_code].last=date.getTime();
                        send("退出聊天模式");
                        users[message.group_code].check_on=0;
                        return;
                    }
                }

                if(users[message.group_code].check_on != 1){
                    return -1;
                }


                //聊天时间间隔五分钟退出聊天模式
                if(date.getTime()-users[message.group_code].last>config.say_space*60*1000){
                    send("由于距离上次回复时间过长，已退出聊天模式");
                    users[message.group_code].check_on=0;
                    return;
                }

                users[message.group_code].last=date.getTime();

                //检测机器人是否刷屏
                if(users[message.group_code].msg_numbers>config.say_numbers){
                    send("1分钟内说了太多话机器人有些累了，让它休息"+config.sleep_time+"分钟吧");
                    users[message.group_code].check_on=0;//退出智能聊天
                    chat.robot_sleep(users[message.group_code],robot,config.sleep_time*60*1000);
                    return;
                }
                users[message.group_code].msg_numbers+=1;
                chat.turing(content,message,send);



            }
        }

    };

}).call(this);
