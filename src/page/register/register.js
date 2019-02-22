// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./register.less')
var _miyao='31e7d8d00616d9eeb2adcbb60c7ab708'
//弹出层方法
function alertFunction(msg){
  $("body #aleertText").html(msg)
  $("body .alert-positon").show()
  setTimeout(function(){
      $("body .alert-positon").hide()
  },2500)
}
$('#kaptchaImg').click(function () {//生成验证码  
    $(this).hide().attr('src', '/login/getKaptcha?' + Math.floor(Math.random()*100) ).fadeIn();  
    event.cancelBubble=true;  
  }); 
    
$(function() {
  var height = $(window).height()-2-$(".header_wrap").height()-$(".logo_wrap").height()-$(".footer_wrap").height();
  $(".register_wrap").css("min-height",height);
  $("#yanTip,#realNameRegTip,#emailRegTip,#usernameRegTip,#password1TipReg,#password2TipReg,#emailTipReg,#telphoneTipReg")
      .hide();
});
var verCode;	//验证码
var countdown = 120;	//发送验证码倒计时
function settime(){
  if(countdown == 0) {
    // $("#getVerCode").bind("click", function() {
    //   var telPhonese = $("#telphoneReg").val();
    //   if(telPhonese == ""){
    //     $("#yanTip").html('请输入正确手机号');
    //     $("#yanTip").show();
    //     return;
    //   }
    //   settime();
    //   // getVerCode();
    // });
    $("#getVerCode").val("重新发送");
    var back_verCode="";
    countdown = 120;
    return;
  }else{
    $("#getVerCode").unbind("click");
    $("#getVerCode").val('重新发送(' + countdown + ')');
    countdown--;
  }
  setTimeout(function() {
    settime();
  }, 1000);
}

$("#getVerCode").bind("click", function() {
  var telPhonese = $("#telphoneReg").val();
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(telPhonese))|| telPhonese.length != 11) {
    $("#telphoneTipReg").show();
    telphoneTipReg = 0;
    return
  } else {
    $("#telphoneTipReg").hide();
    telphoneTipReg = 1;
    $("#yanTip").hide();
  }
  if(telPhonese == ""){
    $("#yanTip").html('请输入正确手机号');
    $("#yanTip").show();
    return;
  }
  $("#yanTip").hide();
  if(countdown==120){
    //发送验证码
    //生成密钥
    var _telPhone=$("#telphoneReg").val();
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
  // getVerCode();
});



// function Listening(value) {
//   if (value != "") {
//     document.getElementById("reset").style.background = "#f96c3e";
//   }
// }
$("#registerReset").click(function(){
  resetFun()
})

function resetFun() {
  $("#usernameReg,#password1Reg,#password2Reg,#emailReg,#telphoneReg,#realNameReg,#verCodeV")
      .val('');
  $("#realNameRegTip,#emailRegTip,#usernameRegTip,#password1TipReg,#password2TipReg,#emailTipReg,#telphoneTipReg,#yanTip")
      .hide();
  $("#reset").css('background','#aaa');
}

$("#usernameReg").blur(function() {
    var reg=/^[a-z0-9]{4,16}$/;    
  if (!reg.test($(this).val())){
    usernameRegTip = 0;
    $("#usernameRegTip").show();
  }/* else if ((/^[0-9]{0,}$/.test($(this).val())) || (/^[_]{0,}$/.test($(this).val()))){
    usernameRegTip = 0;
    $("#usernameRegTip").show();
  } */else if ((/^([0-9]){0,}$/.test($(this).val()))){
    usernameRegTip = 0;
    $("#usernameRegTip").show();
  }else{
    usernameRegTip = 1;
    $("#usernameRegTip").hide();
  }
});

$('#verCodeV').blur(function() {
  // if ($("#verCodeV").val() != verCode) {
  //   $("#yanTip").html('请输入正确验证码');
  //   $("#yanTip").show();
  //   yanTip = 0;
  // } else {
  //   $("#yanTip").hide();
  //   yanTip = 1;
  // }
});

$('#password1Reg').blur(function() {
  var reg = /\s/;
  if (reg.exec($(this).val()) != null || $(this).val() == "") {
    $("#password1TipReg").html('密码不能为空，不能有空格');
    $("#password1TipReg").show();
    password1TipReg = 0;
  } else {
    if ($("#password2Reg").val()!="" && $("#password2Reg").val() != $("#password1Reg").val()) {
      $("#password1TipReg").html('两次密码不一样');
      $("#password1TipReg").show();
      password2TipReg = 0;
    } else {
      $("#password1TipReg").hide();
      password1TipReg = 1;
      if($("#password2Reg").val()!=""){
        $("#password2TipReg").hide();
        password2TipReg = 1;
      }
    }
  }
});

$('#password2Reg').blur(function() {
  var reg = /\s/;
  if (reg.exec($(this).val()) != null || $(this).val() == "") {
    $("#password2TipReg").html('确认密码不能为空');
    $("#password2TipReg").show();
    password2TipReg = 0;
  } else {
    if ($("#password2Reg").val() != $("#password1Reg").val()) {
      $("#password2TipReg").html('两次密码不一样');
      $("#password2TipReg").show();
      password2TipReg = 0;
    } else {
      $("#password1TipReg").hide();
      $("#password2TipReg").hide();
      password1TipReg = 1;
      password2TipReg = 1;
    }
  }
});

$('#telphoneReg').blur(
    function() {
      if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($(this).val()))
          || $(this).val().length != 11) {
        $("#telphoneTipReg").show();
        telphoneTipReg = 0;
      } else {
        $("#telphoneTipReg").hide();
        telphoneTipReg = 1;
        $("#yanTip").hide();
      }
    });
    


$('#emailReg').blur(
  function() {
    var reg = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
    if (reg.test($("#emailReg").val())) {
        $("#emailRegTip").hide();
        emailRegTip = 1;
    } else {
        $("#emailRegTip").show();
        emailRegTip = 0;
    }
  });

$('#realNameReg').blur(function() {
  if ($("#realNameReg").val() != "") {
    $("#realNameRegTip").hide();
    realNameRegTip = 1;
  } else {
    $("#realNameRegTip").show();
    realNameRegTip = 0;
  }
});

var usernameRegTip=1;	//标注信息填写是否正确
var yanTip=1;
var password1TipReg=1;
var password2TipReg=1;
var telphoneTipReg=1;
var emailRegTip=1;
var realNameRegTip=1;
$("#registerSaveReg").click(function(){
  saveReg()
})
function saveReg() {
  if ($("#verCodeV").val() == "" || $("#realNameReg").val() == "" || $("#emailReg").val() == ""
      || $("#usernameReg").val() == ""
      || $("#password2Reg").val() == ""
      || $("#telphoneReg").val() == "") {
    alertFunction("请输入完整信息！");
    return;
  }
  if(usernameRegTip==0 ||password1TipReg==0 || password2TipReg==0 || telphoneTipReg==0 || emailRegTip==0 || realNameRegTip==0){
    alertFunction("请输入正确信息！");
    return;
  }
  if(yanTip==0){
    alertFunction("请输入正确验证码！");
    return;
  } 
  /*var reg=/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
  if($("#startIp").val().length>=1 || $("#endIp").val().length>=1){
    if (!reg.test($("#startIp").val()) || !reg.test($("#endIp").val())) {
      alert("请输入正确IP段");
      return;
    }
  }*/
  var flag =true;
  if (flag) {
    $("#loading").show()
      //先验证验证码是否正确
      //验证码验证
      var _telPhone=$("#telphoneReg").val();
      var _code=$("#verCodeV").val();
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
              //提交注册信息
              $.ajax({
                type : "post",
                url : "http://safety.kahntang.com/user/register",
                data : {
                  "userName" : $("#usernameReg").val().trim(),
                  "password" : md5($("#password1Reg").val().trim()),
                  "email" : $("#emailReg").val().trim(),
                  "phoneNumber" : $("#telphoneReg").val().trim(),
                  "realName" : $("#realNameReg").val().trim(),
                },
                dataType : "json",
                success : function(res) {
                  $("#loading").hide()
                  if (res.code == "200") {
                    checkForms($("#usernameReg").val().trim(), $("#password1Reg").val().trim());
                  } else {
                    alertFunction("注册失败");
                  }
                } 
            });
          }
        },
      })
  }
}

/*登录*/
function checkForms(account, password) {
  $.ajax({
    type : "get",
    url : "http://safety.kahntang.com/user/login",
    data : {
      "username" : account,
      "password" : md5(password)
    },
    dataType : "json",
    success : function(res) {
      if (res.code == "200") {
        localStorage.setItem('token',res.ext)
        localStorage.setItem('userName',account)
        localStorage.setItem('phoneNumber',res.data.phoneNumber)//缓存手机号
        window.location.href = "./index.html";
        // alert("注册成功！");
      } else {
        alertFunction("注册失败！");
      }
    }
  });
}