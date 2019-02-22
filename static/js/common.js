var StaticUrl="http://safety.kahntang.com/"
var APIUrl="http://safety.kahntang.com"
var userToken=localStorage.getItem('token');
var _miyao='31e7d8d00616d9eeb2adcbb60c7ab708'
module.exports.commonConfig={StaticUrl,APIUrl}
//判断是否有登录状态
if(!userToken){
    $("#LoginUl").html("");
    $("#loginBtns").show()
}else{
    $("#loginBtns").hide()
     $("#loginuserName").html(localStorage.getItem('userName'))
}
//设置回车事件状态 0--检索  1--登录
//打开登录
$("#loginbtn").click(function(){
  $(".overlay").show();
})
//前往注册
$(".goRegister").click(function(){
    location.href="/register.html"
})
//前往搜索界面
// $("#gotoSearchList").click(function(){
//     //判断哪里点击的，进行不同的搜索页面跳转
//     // var urlMenuId=getQueryVariable("urlmenuId")
//     // var searchGoUrl=''
//     // var searchText=$("#searchText").val()
//     // if(urlMenuId){
//     //     //是在分类里点击的，需要携带分类id
//     //     //10是危险品
//     //     if(urlMenuId==10){
//     //         searchGoUrl="/whpSearch.html?searchText="+searchText+"&urlmenuId="+urlMenuId
//     //     }else{

//     //     }
//     // }else{
//     //     //不是分类里点击的
//     //     searchGoUrl="/searchList.html?text="+searchText
//     // }
//     // // location.href="/searchList.html?text="+searchText
//     // location.href=searchGoUrl
// })
//获取url携带的数据
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }
//前往个人信息界面
$("#goUserInfo").click(function(){
    location.href="/userinfo.html"
})
var KeyDownStatus = "0";
function backPwdShow(){
  $("#back_username").val($("#username").val());
  var back_pwdTip=0;
  var back_pwd2Tip=0;
  var back_YanTip=0;
  $("#back_pwd").val("");
  $("#back_pwd2").val("");
  $("#back_Yan").val("");
  $("#back_usernameTip").hide();
  $("#back_YanTip").hide();
  $("#back_pwd2Tip").hide();
  $("#back_pwdTip").hide();
  // if($("#back_username").val()!=""){
  // 	$.ajax({
  // 		type : "post",
  // 		url : "/login/getUserInfoByname",
  // 		data : {
  // 			"username" : $("#back_username").val()
  // 		},
  // 		dataType : "json",
  // 		success : function(res) {
  // 			if(res.data!=null){
  // 				$("#back_usernameTip").hide();
  // 				back_telPhonese=res.data.telphone;
  // 				userid=res.data.id;
  // 				back_usernameTip = 1;
  // 			}else{
  // 				$("#back_usernameTip").html('用户名不存在');
  // 				$("#back_usernameTip").show();
  // 				back_usernameTip=0;
  // 			}
  // 		}
  // 	});
  // }
  $(".overlay_find").show();
}
//打开找回密码
$("#find_password").click(function(){
  backPwdShow()
})
//关闭找回密码
$("#closePsw").click(function(){
  $(".overlay_find").hide();
})
//关闭登录
$("#closePsw1").click(function(){
  $(".overlay").hide();
})
var back_verCode;	//验证码
var countdown = 120;	//发送验证码倒计时
function settime(){
    if(countdown == 0) {
        // $("#back_getVerCode").bind("click", function() {
        //     if ($("#back_username").val() == "" || $("#back_pwd").val() == ""  
        //         || $("#back_pwd2").val() == "") {
        //         alert("请输入完整信息！");
        //         return;
        //     }
        //     if (back_usernameTip == 0 || back_pwdTip == 0 || back_pwd2Tip == 0) {
        //         alert("请填写正确信息！");
        //         return;
        //     } 
        //     settime();
        //     // back_getVerCode();
        // });
        $("#back_getVerCode").html("重新发送");
        back_verCode="";
        countdown = 120;
        return;
    }else{
        $("#back_getVerCode").unbind("click");
        $("#back_getVerCode").html('重新发送(' + countdown + ')');
        countdown--;
    }
    setTimeout(function() {
        settime();
    }, 1000);
}
$("#back_username").blur(function() {
  //查询用户名是否存在
  if($(this).val() == ""){
      $("#back_usernameTip").html('手机号不能为空');
      $("#back_usernameTip").show();
      back_usernameTip=0;
  }else{
    //   $("#back_usernameTip").html('手机号不能为空');
    $("#back_usernameTip").hide();
    back_usernameTip=1;
    // $.ajax({
    // 	type : "post",
    // 	url : "/login/getUserInfoByname",
    // 	data : {
    // 		"username" : $("#back_username").val()
    // 	},
    // 	dataType : "json",
    // 	success : function(res) {
    // 		if(res.data!=null){
    // 			$("#back_usernameTip").hide();
    // 			back_telPhonese=res.data.telphone;
    // 			userid=res.data.id;
    // 			back_usernameTip = 1;
    // 		}else{
    // 			$("#back_usernameTip").html('用户名不存在');
    // 			$("#back_usernameTip").show();
    // 			back_usernameTip=0;
    // 		}
    // 	}
    // });
  }
});
$('#back_pwd').blur(function() {
    var reg = /\s/;
    if (reg.exec($(this).val()) != null || $(this).val() == "") {
        $("#back_pwdTip").html('密码不能为空，不能有空格');
        $("#back_pwdTip").show();
        back_pwdTip = 0;
    }else {
        if ($("#back_pwd2").val() != "" && $("#back_pwd2").val() != $("#back_pwd").val()) {
            $("#back_pwdTip").html('两次密码不一样');
            $("#back_pwdTip").show();
            back_pwdTip = 0;
        } else { 	
            if($("#back_pwd2").val() != ""){
                $("#back_pwd2Tip").hide();
                back_pwd2Tip=1;
            }
            $("#back_pwdTip").hide();
            back_pwdTip = 1;
        }
    }
    
});
$('#back_pwd2').blur(function() {
    var reg = /\s/;
    if (reg.exec($(this).val()) != null || $(this).val() == "") {
        $("#back_pwd2Tip").html('确认密码不能为空');
        $("#back_pwd2Tip").show();
        back_pwd2Tip = 0;
    } else {
        if ($("#back_pwd2").val() != $("#back_pwd").val()) {
            $("#back_pwd2Tip").html('两次密码不一样');
            $("#back_pwd2Tip").show();
            back_pwd2Tip = 0;
        } else {
            $("#back_pwdTip").hide();
            $("#back_pwd2Tip").hide();
            back_pwdTip = 1;
            back_pwd2Tip=1;
        }
    }
});
// $('#back_Yan').blur(function() {
//     if ($("#back_Yan").val() != back_verCode) {
//         $("#back_YanTip").html('请输入正确验证码');
//         $("#back_YanTip").show();
//         back_YanTip = 0;
//     } else {
//         $("#back_YanTip").hide();
//         back_YanTip = 1;
//     }
// });
$("#back_getVerCode").bind("click", function() {
    if ($("#back_username").val() == "" || $("#back_pwd").val() == ""  
        || $("#back_pwd2").val() == "") {
        alertFunction("请输入完整信息！");
        return;
    }
    if (back_usernameTip == 0 || back_pwdTip == 0 || back_pwd2Tip == 0) {
        alertFunction("请填写正确信息！");
        return;
    }
    if(countdown==120){
        //发送验证码
        //生成密钥
        var _telPhone=$("#back_username").val();
        var _sign=md5('appId=10001&mobile='+_telPhone+'&stime=123456'+_miyao)
        $.ajax({
          type : "post",
          url : "http://safety.kahntang.com/sms/sendCode?appId=10001&mobile="+_telPhone+"&stime=123456&sign="+_sign,
          data : {},
          dataType : "json",
          success : function(res) {
            if(res.code!='200'){
                alertFunction(res.errorMsg)
            }else{
              settime();
            }
          },
        })
      }
    // settime();
    // back_getVerCode();
});
var back_telPhonese;
function back_getVerCode(){
    if(back_telPhonese=="" || back_telPhonese==null){
        alert("手机号为空，检查用户名是否存在");
        return;
    }
    // $.ajax({
    // 	type : "post",
    // 	url : "/login/SendMd",
    // 	data : {
    // 		"telphone" : back_telPhonese
    // 	},
    // 	dataType : "json",
    // 	success : function(res) {
    // 		back_verCode = res;
    // 	}
    // });
}
var userid;
var back_usernameTip=1;
var back_pwdTip=0;
var back_pwd2Tip=0;
var back_YanTip=0;
//提交修改密码
$("#subPswBtn").click(function() {
    saveBack()
})
function saveBack() {	
    if ($("#back_username").val() == "" || $("#back_pwd").val() == ""  
            || $("#back_pwd2").val() == "") {
            alertFunction("请输入完整信息！");
            return;
    }
    if (back_usernameTip == 0 || back_pwdTip == 0 || back_pwd2Tip == 0) {
        alertFunction("请填写正确信息！");
        return;
    } 
    // if(back_YanTip==0){
    //     alert("请输入正确验证码！");
    //     return;
    // }
    $("#loading").show()
    //先进行验证码验证
    var _telPhone=$("#back_username").val();
    var _code=$("#back_Yan").val();
    var _sign=md5('appId=10001&code='+_code+'&mobile='+_telPhone+'&stime=123456'+_miyao)
    $.ajax({
        type : "post",
        url : "http://safety.kahntang.com/sms/checkCode?appId=10001&code="+_code+"&mobile="+_telPhone+"&stime=123456&sign="+_sign,
        data : {},
        dataType : "json",
        success : function(res) {
            if(res.code!='200'){
                alertFunction(res.errorMsg)
            }else{
                $.ajax({
                    type : "post",
                    url : "http://safety.kahntang.com/user/forget",
                    data : {
                        "mobile" : $('#back_username').val(),
                        "password" : $("#back_pwd").val().trim(),
                        "code" :$('#back_Yan').val(),
                    },
                    dataType : "json",
                    success : function(res) {
                        $("#loading").hide()
                        if(res.code!="200"){
                            alertFunction(res.errorMsg);
                        }else{
                            alertFunction("修改成功");
                            $(".overlay_find").hide();
                        }
                    } 
                });
            }
        }
    })
    
}

//登录 退出账户
var loginState=false;
/*登录*/
$("#signUpIn").click(function(){
  checkForm()
})
function checkForm() {
  var account = $("#username").val().trim();
  var password = $("#password").val().trim();
  if (account == "" || password == "") {
    alertFunction("用户名密码不能为空！");
    return;
  }
  var objChk = document.getElementById("checkbox");  
    if(objChk.checked){  
        //添加cookie  
        addCookie("username_shiyou",account,7,"/");  
    }else{  
        deleteCookie("username_shiyou","/");
    } 
  $("#loading").show()
  $.ajax({
        type : "post",
        url : "http://safety.kahntang.com/user/login",
        data : {
          "userName" : account,
          "password" : md5(password),
        },
        dataType : "json",
        success : function(res) {
            $("#loading").hide()
          if (res.code == "200") {
            $(".overlay").hide();
            $("#LoginUl").html("");
            var LoginUl = '';
            LoginUl += '<li class="user_btn">';
            LoginUl += '<a href="/login/UserInfo">欢迎您：<span>'
                + account + '</span></a>';
            LoginUl += '</li>';
            LoginUl += '<li class="exit_btn" onclick="outEdit();">';
            LoginUl += '<a><i class="icon icon_exit"></i>退出</a>';
            LoginUl += '</li>';
            // $("#LoginUl").append(LoginUl);
            //缓存用户信息
            localStorage.setItem('token',res.ext)
            localStorage.setItem('userName',account)
            localStorage.setItem('phoneNumber',res.data.phoneNumber)//缓存手机号
            window.location.reload();
            loginState=false;
          }else if(res.Code == "000002"){
            if (confirm("该用户正在使用，是否强制对方退出！")){
              loginState=true;
              checkForm();
            }
          } else {
            alertFunction("用户名或密码错误~！");
          }
        }
      });
}
/*退出*/
$("#LoginUl .exit_btn").click(function(){
    outEdit()
})
function outEdit() {
  if (!confirm("确定退出登录吗?")) {
    return;
  }
  $("#loading").show()
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/user/logout?token="+userToken,
    dataType : "text",
    async : false,
    success : function(data) {
      $("#loading").hide()
      localStorage.clear()
      window.location.href = "/index.html";
    },
    error : function(xhr, status, error) {

    }
  });
}


//cookie相关
function addCookie(name,value,days,path){   /**添加设置cookie**/  
    var name = escape(name);  
    var value = escape(value);  
    var expires = new Date();  
    expires.setTime(expires.getTime() + days * 3600000 * 24);  
    //path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用  
    path = path == "" ? "" : ";path=" + path;  
    //GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC  
    //参数days只能是数字型  
    var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();  
    document.cookie = name + "=" + value + _expires + path;  
}  
function getCookieValue(name){  /**获取cookie的值，根据cookie的键获取值**/  
    //用处理字符串的方式查找到key对应value  
    var name = escape(name);  
    //读cookie属性，这将返回文档的所有cookie  
    var allcookies = document.cookie;         
    //查找名为name的cookie的开始位置  
    name += "=";  
    var pos = allcookies.indexOf(name);      
    //如果找到了具有该名字的cookie，那么提取并使用它的值  
    if (pos != -1){                                     //如果pos值为-1则说明搜索"version="失败  
        var start = pos + name.length;                  //cookie值开始的位置  
        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start,end); //提取cookie的值  
        return (value);                           //对它解码        
    }else{  //搜索失败，返回空字符串  
        return "";  
    }  
}  
function deleteCookie(name,path){   /**根据cookie的键，删除cookie，其实就是设置其失效**/  
    var name = escape(name);  
    var expires = new Date(0);  
    path = path == "" ? "" : ";path=" + path;  
    document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;  
}  

//反馈按钮
$("#fankuiBtn").click(function(){
    $(".FeedbackBox").show()
    $("#fankuiInput").val(localStorage.getItem('userName'))
})
$(".BtnClose").click(function(){
    $(".FeedbackBox").hide()
})
//提交反馈信息
$("#subFankuiBtn").click(function(){
    $("#loading").show()
    $.ajax({
        type : "post",
        url : "http://safety.kahntang.com/user/feedback?token="+localStorage.getItem('token')+"&name="+localStorage.getItem('userName')+"&mobile="+$("#feedTelphone").val()+"&content="+$("#feedContent").val(),
        data : {},
        dataType : "json",
        success : function(res) {
            $("#loading").hide()
            if(res.code=='200'){
                alertFunction('提交审核中')
                $(".FeedbackBox").hide()
                $("#feedTelphone").val('')
                $("#feedContent").val('')
            }
            if(res.code=='500'){
                alertFunction('服务器错误')
            }
            //token过期 请求重新登录
            if(res.code=="9002"||res.code=="9003"){
                alertFunction("请先登录")
                $(".overlay").show()
            }
        }
    })
})
var _alert='<div class="alert alert-warning alert-positon"><a href="#" class="close" data-dismiss="alert">&times;</a><strong id="aleertText"></strong></div>'
$("body").append(_alert)
function alertFunction(msg){
    $("body #aleertText").html(msg)
    $("body .alert-positon").show()
    setTimeout(function(){
        $("body .alert-positon").hide()
    },2500)
  }

//滚动到顶部
// $('body').scroll(function(){
//     // gotoTop
//     console.log(1111)
// })
window.onscroll= function(e){
    console.log(document.documentElement.scrollTop,1111)
    if(document.documentElement.scrollTop>30){
        //显示
        $(".skin_Back_to_top").show()
    }else{
        //隐藏返回顶部
        $(".skin_Back_to_top").hide()
    }
}
$("#gotoTop").click(function(){
    document.documentElement.scrollTop=0
})