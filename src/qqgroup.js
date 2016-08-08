/**
 * Created by lxl on 2016/8/8 0008.
 */
var log = new (require('log'))('debug');
var request=require('request');

var header={
    "Referer":"http://qq.com",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36"
};
var client = require('./httpclient');
var skey='';
var bkn='';
var jsons = JSON.stringify;
var group={};
var request = request.defaults({jar: true})

var j = request.jar();


group.set_cookie=function (cookies) {
    var cook;
    var url = 'http://qinfo.clt.qq.com/cgi-bin/qun_info/set_group_shutup';
    var cookie=cookies.map(function (c) {
        cook=c.split(';');
        // log.debug(cook[0]);
        var cook_check=cook[0].split('=');
        if(cook_check[1]){
            log.debug("cook="+cook[0]);
            var cookie_req=request.cookie(cook[0]);
            j.setCookie(cookie_req,url,function (e,c) {
                log.debug("jcook="+c);
            });
            return cookie_req;
        }

    });
    group.cookies=cookie;
    get_skey();
    get_bkn();
    return cookie;
}

var get_bkn=function () {
    var hash = 5381;
    for(var i=0; i<skey.length; ++i){
        hash += (hash << 5) + get_uni(skey[i]);
    }
    bkn=hash & 0x7fffffff;
    console.log("skey:"+jsons(skey));
    console.log("bkn:"+jsons(bkn));
    return bkn;
}

var get_skey=function () {
    if(group.cookies){
        var skey_arr=group.cookies.toString().match(/skey=(.{0,12});/);
        skey=skey_arr[1];
        return skey;
        console.log("skey:"+jsons(skey));
    }
}

var get_uni=function (c) {
    var n;
    switch(c.length) {
        case 1:
            return c.charCodeAt(0);
        case 2:
            n = (c.charCodeAt(0) & 0x3f) << 6;
            n += c.charCodeAt(1) & 0x3f;
            return n;
        case 3:
            n = (c.charCodeAt(0) & 0x1f) << 12;
            n += (c.charCodeAt(1) & 0x3f) << 6;
            n += c.charCodeAt(2) & 0x3f;
            return n;
        case 4:
            n = (c.charCodeAt(0) & 0x0f) << 18;
            n += (c.charCodeAt(1) & 0x3f) << 12;
            n += (c.charCodeAt(2) & 0x3f) << 6;
            n += c.charCodeAt(3) & 0x3f;
            return n;
    }
}
/**
 * 禁言某个群成员
 * @param group_account
 * @param user_account
 * @param time
 * @param callback
 * @returns {*}
 */
group.gag_someone=function (group_account,user_account,time, cb) {
    var url,params;
    url = 'http://qinfo.clt.qq.com/cgi-bin/qun_info/set_group_shutup';
    params="gc=" +group_account +"&shutup_list="+jsons([{"uin":user_account,"t":time}])+"&bkn="+bkn+"&src=qinfo_v3";
    return request.post({
        url: url,
        body:params,
        headers:header,
        jar:j
    }, function(err,r,b) {
        b=JSON.parse(b);
        if(err){
            log.debug('Error',err);
            return cb(err);
        }
        if(b.ec==0){
            return cb(null,"禁言用户"+user_account+"成功");
        }else {
            log.debug('gag_someone',b);
            return cb("禁言失败");
        }
    });
}

module.exports=group;