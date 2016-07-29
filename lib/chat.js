var chat={};

chat.config={
    group:{
        sleep_time:5, //机器人休息间隔，默认5分钟
        say_numbers:4, //一分钟内机器人的发言条数限制
        say_space:5, //几分钟内机器人无回复，自动退出
        clear_time:1, //发送消息数目定时清零时间，默认1分钟

    }
}
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

/**
 * 发送消息给一个好友
 * @param qqbot
 * @param user_account
 * @param content
 */
chat.send_user=function (qqbot,user_account,content) {
    qqbot.get_user_uin(user_account,function (e,uin) {
        qqbot.send_message(uin, content, function () { });
    });
}

/**
 * 发送消息给一个群
 * @param qqbot
 * @param group_ccount
 * @param content
 */
chat.send_group=function (qqbot,group_ccount,content) {
    qqbot.get_group_gid(group_ccount,function (err,gid) {
        qqbot.send_message_to_group(gid,content,function () {
        });
    })
}