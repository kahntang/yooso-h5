// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./userinfo.less')
var token=localStorage.getItem('token');
var accountName=localStorage.getItem('userName')
var localphoneNumber=localStorage.getItem('phoneNumber')
var verCode;	//验证码
var countdown = 60;	//发送验证码倒计时
//弹出层方法
function alertFunction(msg){
  $("body #aleertText").html(msg)
  $("body .alert-positon").show()
  setTimeout(function(){
      $("body .alert-positon").hide()
  },2500)
}
function settime(){
  if(countdown == 0) {
    $("#getVerCode").bind("click", function() {
      if ($("#password1").val() == "" || $("#password2").val() == "" || $("#email").val() == ""
        || $("#telphone").val() == ""
        || $("#realnameReg").val() == "") {
        alertFunction("请输入完整信息！");
        return;
      }
      if (password1TipReg == 0 || password2TipReg == 0 || telphoneTipReg == 0 || emailRegTip == 0 || realNameRegTip== 0) {
        alertFunction("请填写正确信息！");
        return;
      }
      if(flagDisabled==0){
        alertFunction("未修改内容");
        return;
      }
      settime();
      getVerCode();
    });
    $("#getVerCode").val("重新发送");
    countdown = 60;
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
  if ($("#password1").val() == "" || $("#password2").val() == "" || $("#email").val() == ""
    || $("#telphone").val() == ""
    || $("#realnameReg").val() == "") {
      alertFunction("请输入完整信息！");
    return;
  }
  if (password1TipReg == 0 || password2TipReg == 0 || telphoneTipReg == 0 || emailRegTip == 0 || realNameRegTip== 0) {
    alertFunction("请填写正确信息！");
    return;
  }
  if(flagDisabled==0){
    alertFunction("未修改内容");
    return;
  }
  settime();
  getVerCode();
});
function getVerCode(){
  var telPhonese = localphoneNumber;
  $.ajax({
    type : "get",
    url : "/login/SendMd",
    data : {
      "telphone" : telPhonese
    },
    dataType : "json",
    success : function(res) {
        verCode = res;
    }
  });
}
var password1TipReg=1;
var password2TipReg=1;
var telphoneTipReg=1;
var emailRegTip=1;
var realNameRegTip=1;
var flagDisabled = 0; //是否为编辑状态  0：不可编辑状态，1：可编辑状态 
//点击编辑
$("#editUserInfo").click(function(){
  editUserInfo()
})

function editUserInfo(){
  $("#password1").removeAttr("disabled");
  $("#password2").removeAttr("disabled");
  $("#email").removeAttr("disabled");
  $("#telphone").removeAttr("disabled");
  $("#realnameReg").removeAttr("disabled");
  $("#verCodeV").removeAttr("disabled");
  flagDisabled=1;
}

$(function() {
  if("org.bigdata.framework.web.core.model.User@10f184e7"==null || "org.bigdata.framework.web.core.model.User@10f184e7"==""){
    window.location.href = "/indexing/index";
  }
  $("#password1").val("123456");
  $("#password2").val("123456");
  $("#email").val("huizhenjin@126.com");
  $("#telphone").val("13651391986");
  $("#realnameReg").val("金");
  
  var height = $(window).height()-2-$(".header_wrap").height()-$(".logo_wrap").height()-$(".footer_wrap").height();
  $(".register_wrap").css("min-height",height);
  $("#password1").attr("disabled","disabled");
  $("#password2").attr("disabled","disabled");
  $("#email").attr("disabled","disabled");
  $("#telphone").attr("disabled","disabled");
  $("#realnameReg").attr("disabled","disabled");
  $("#verCodeV").attr("disabled","disabled");
  flagDisabled=0;
  $("#emailRegTip").hide();
  $("#UserInfo").attr("href","");
  
  $('.navs a').click(function() {
    $(this).addClass('cur').siblings().removeClass('cur');
    var index = $(this).index();
    $('.navs_con').eq(index).show().siblings('.navs_con').hide();
  });
  initRightList(1);
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
$('#password1').blur(function() {
  var reg = /\s/;
  if (reg.exec($(this).val()) != null || $(this).val() == "") {
    $("#password1Tip").html('密码不能为空，不能有空格');
    $("#password1Tip").show();
    password1TipReg = 0;
  } else {
    if ($("#password2").val()!="" && $("#password2").val() != $("#password1").val()) {
      $("#password1Tip").html('两次密码不一样');
      $("#password1Tip").show();
      password2TipReg = 0;
    } else {
      $("#password1Tip").hide();
      password1TipReg = 1;
      if($("#password2").val()!=""){
        $("#password2Tip").hide();
        password2TipReg = 1;
      }
    }
  }
});

$('#realnameReg').blur(function() {
  if ($(this).val().trim() == '') {
    $("#realnameRegTip").show();
    realNameRegTip = 0;
  } else {
    $("#realnameRegTip").hide();
    realNameRegTip = 1;
  }
});

$('#password2').blur(function() {
  var reg = /\s/;
  if (reg.exec($(this).val()) != null || $(this).val() == "") {
    $("#password2Tip").html('确认密码不能为空');
    $("#password2Tip").show();
    password2TipReg = 0;
  } else {
    if ($("#password2").val() != $("#password1").val()) {
      $("#password2Tip").html('两次密码不一样');
      $("#password2Tip").show();
      password2TipReg = 0;
    } else {
      $("#password1Tip").hide();
      $("#password2Tip").hide();
      password1TipReg = 1;
      password2TipReg = 1;
    }
  }
});

$('#email').blur(function() {
  var reg = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
  if(reg.test($("#email").val())){
    $("#emailRegTip").hide();
    emailRegTip = 1;
  }else{
    $("#emailRegTip").show();
    emailRegTip = 0;
  }
});

$('#telphone').blur(function() {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($(this).val())) || $(this).val().length!=11) {
    $("#telphoneTip").show();
    telphoneTipReg = 0;
  } else {
    $("#telphoneTip").hide();
    telphoneTipReg = 1;
  }
});


function Listening(value,ids){
  if(ids == "telphone" && value != $("#sessionTelphone").val()){
    document.getElementById("reset").style.background = "#f96c3e";
  }else
  if(ids == "email" && value != $("#sessionEmile").val()){
    document.getElementById("reset").style.background = "#f96c3e";		
  }else
  if((ids == "password2" || ids == "password1") && value != "123456"){
    document.getElementById("reset").style.background = "#f96c3e";
  }else
  if(ids == "realnameReg" && value != $("#sessionRealName").val()){
    document.getElementById("reset").style.background = "#f96c3e";
  }else
  if(ids == "verCodeReg" && value!=""){
    document.getElementById("reset").style.background = "#f96c3e";
  }else{
    document.getElementById("reset").style.background = "#aaa";
  }
}

/*重置为初始值*/
$("#reset").click(function(){
  reset()
})
function reset() {
  $("#password1,#password2").val("123456");
  $("#telphone").val($("#sessionTelphone").val());
  $("#email").val($("#sessionEmile").val());
  $("#realnameReg").val($("#sessionRealName").val());
  $("#verCodeV").val("");
  $("#emailRegTip").hide();
  $("#telphoneTip").hide();
  $("#password1Tip").hide();
  $("#password2Tip").hide();
  $("#realnameRegTip").hide();
  $("#yanTip").hide();
  document.getElementById("reset").style.background = "#aaa";
  yanTip=0;
  password1TipReg=1;
  password2TipReg=1;
  telphoneTipReg=1;
  emailRegTip=1;
  realNameRegTip=1;
}
var yanTip=0;
var password1TipReg=1;
var password2TipReg=1;
var telphoneTipReg=1;
var emailRegTip=1;
var realNameRegTip=1;
/*修改资料*/
$("#btncheckForms").click(function(){
  checkForms()
})
function checkForms() {
  if(flagDisabled==0){
    alertFunction("未修改内容");
    return;
  }
  if ($("#password1").val() == "" || $("#password2").val() == "" || $("#email").val() == ""
    || $("#telphone").val() == ""
    || $("#realnameReg").val() == "") {
      alertFunction("请输入完整信息！");
    return;
  }
  if (password1TipReg == 0 || password2TipReg == 0 || telphoneTipReg == 0 || emailRegTip == 0 || realNameRegTip== 0) {
    alertFunction("请填写正确信息！");
    return;
  }
  // if(yanTip==0 || $("#verCodeV").val()==""){
  //   alert("请输入正确验证码！");
  //   return;
  // }
  var password = $("#password1").val().trim();
  var telphone = $("#telphone").val();
  var email = $("#email").val();
  var realName = $("#realnameReg").val();
  $("#loading").show()
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/user/modifyUserInfo",
    data : {
      // "id" : $("#userId").val(),
      "userName":accountName,
      "password" : password,
      "phoneNumber" : telphone,
      "email" : email,
      "realName" : realName,
      "token":token
    },
    dataType : "json",
    success : function(res) {
      $("#loading").hide()
      if (res.code == "200") {
        $("#password1").attr("disabled","disabled");
        $("#password2").attr("disabled","disabled");
        $("#email").attr("disabled","disabled");
        $("#telphone").attr("disabled","disabled");
        $("#realnameReg").attr("disabled","disabled");
        $("#verCodeV").attr("disabled","disabled");
        flagDisabled=0;
        alertFunction(res.Status);
        window.location.reload();
      } else {
        
      }
    }
  });
}
function initRightList(curr) {
  var pageSize = 10;
  $.ajax({
        type : "get",
        url : "http://safety.kahntang.com/user/getUserInfo?token="+token,
        // data : {
        //   "username" : 'jinhuizhen',
        //   "pageNum" : curr,
        //   "pageSize" : pageSize
        // },
        dataType : "json",
        success : function(res) {
          //token过期 请求重新登录
          if(res.code=="9002"||res.code=="9003"){
            alertFunction("请先登录")
            $(".overlay").show()
          }
          var result=res.data;
          var feedbackHtml = '';
          for (var i = 0; i < result.length; i++) {

            feedbackHtml += '<div class="comment_list">';
            feedbackHtml += '<p class="question">'
                + result[i].user_problem + '</p>';
            feedbackHtml += '<p class="answer">'
                + (result[i].admin_answer != undefined ? result[i].admin_answer
                    : "") + '</p>';
            feedbackHtml += '</div>';

            /* feedbackHtml += '<li>'+result[i].user_problem+'';
            feedbackHtml += '<span>'+(result[i].admin_answer!=undefined?"已回复:":"未回复") +'</span>';
            feedbackHtml += (result[i].admin_answer!=undefined?result[i].admin_answer : "");
            feedbackHtml += '</li>'; */
          }
          $("#feedback").html('');
          $("#feedback").append(feedbackHtml);
          /*加载分页*/
          var totalRow = res.count;
          var pages;
          var groups;
          if (totalRow % pageSize == 0) {
            pages = totalRow / pageSize;
          } else {
            pages = Math.ceil(totalRow / pageSize); //四舍五入取大值
          }
          if (pages >= 6) {
            groups = 6;
          } else {
            groups = pages + 1;
          }
          laypage({
            cont : 'page', // 容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
            pages : pages, // 通过后台拿到的总页数
            curr : curr, // 当前页
            skip : true, // 是否开启跳页
            groups : groups, // 连续显示分页数
            first : '首页', // 若不显示，设置false即可
            last : '尾页', // 若不显示，设置false即可
            prev : ' ', // 若不显示，设置false即可
            next : ' ', // 若不显示，设置false即可
            jump : function(obj, first) { // 触发分页后的回调
              if (!first) { // 点击跳页触发函数自身，并传递当前页：obj.curr
                curr = obj.curr;
                initRightList(curr);
                $('html, body').animate({scrollTop:0}, 'slow');
              }
            }
          });
          /*加载分页结束*/
        }
      });
}

//全部分类界面的搜索 进入普通搜索界面
$("#gotoSearchList").click(function(){
  //判断哪里点击的，进行不同的搜索页面跳转
    var searchText=$("#searchText").val()
    location.href="/searchList.html?text="+searchText
})
$("#searchText").keydown(function(event){
  if(event.keyCode ==13){
    //判断哪里点击的，进行不同的搜索页面跳转
    var searchText=$("#searchText").val()
    location.href="/searchList.html?text="+searchText
  }
})