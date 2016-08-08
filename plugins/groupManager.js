(function () {
    var request = require('request');
    var group_manager = {
        manager_codes: ["521955012"]//需要管理的群
    };

    //设置
    var group_config = {
        manager: [
            {
                code: "521955012",//群号
                admin: "306755605"//该群管理员账号
            },
            {
                code:"555067271",
                admin:"306755605"
            }
        ],
        say_time: 10 * 1000,//间隔时间
        max_number:2,//发言条数
    }

    var Log = require('log');
    var log = new Log('debug');

    // 定义一个判断函数
    var in_array = function (str, arr) {
        // 遍历是否在数组中
        for (var i = 0, k = arr.length; i < k; i++) {
            if (str == arr[i].code) {
                return i + 1;
            }
        }
        // 如果不在数组中就会返回false
        return false;
    }


    var group_fun = {};

    group_fun.msg_reset = function (group, time) {
        setInterval(function () {
            for (var i = 0; i < group.members.length; i++) {
                if (group.members[i])
                    group.members[i].msg_numbers = 0;
            }
        }, time);
    }


    module.exports = function (content, send, robot, message) {
        if (message.type === 'group_message') {
            var code_i = in_array(message.from_group.account, group_config.manager);
            if (!code_i) {
                log.debug("无奈。。");
                return;
            }

            //该群的管理员账号
            var admin_count = group_config.manager[code_i-1].admin;

            //该群是否存在于对象当中
            if (!group_manager[message.from_group.account]) {
                log.debug("对象添加成功");
                group_manager[message.from_group.account] = {};
                group_manager[message.from_group.account].members = [];
                group_fun.msg_reset(group_manager[message.from_group.account], group_config.say_time);
            }

            var group = group_manager[message.from_group.account];

            //初始化群成员
            if (!group.members[message.from_user.nick]) {
                group.members[message.from_user.nick] = {};
                group.members[message.from_user.nick].msg_numbers = 0;
                group.members[message.from_user.nick].notice = 0;
                group.members[message.from_user.nick].uin = message.from_user.uin;
                group.members[message.from_user.nick].nick = message.from_user.nick;
                return;
            }

            var member = group.members[message.from_user.nick];

            member.msg_numbers += 1;
            // console.log(JSON.stringify(message));

            if (member.msg_numbers > group_config.max_number) {
                member.notice += 1;

                //获取群成员qq
                robot.get_user_account(member.uin,function (e,account) {
                    if(e){
                        return log.debug("获取qq号失败+",e);
                    }
                    member.account=account;
                });
                if(member.notice>0){
                    robot.group.gag_someone(message.from_group.account,member.account,60,function(e,r){
                        if(!e){
                            send("@"+member.nick+"休息一会儿吧");
                            robot.get_user_uin(admin_count,function (e,uin) {
                                robot.send_message(uin, "用户：" + member.nick + " 在群：" + message.from_group.name + " 中警告次数达到"+member.notice+"次，已经将他禁言 \n 注：群号"+message.from_group.account, function () { });
                            });
                        }else {
                            send("禁言用户失败");
                        }
                    });
                }else {
                    send("@" + member.nick + " 你10秒内发送消息数目超限，警告一次！\n 现已警告：" + member.notice + "次 \n 注：一天内警告次数大于等于两次，将会把你禁言，大与5次将直接请你离开 \n 谢谢合作！");
                    member.msg_numbers = 0;
                }
            }


        }


    };

}).call(this);
