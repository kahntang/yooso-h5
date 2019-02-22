require('./../../../static/css/style.css')
require('./mediaDetail.less')
var commonConfig=require('./../../../static/js/common.js').commonConfig
var StaticUrl=commonConfig.StaticUrl
//弹出层方法
function alertFunction(msg){
  $("body #aleertText").html(msg)
  $("body .alert-positon").show()
  setTimeout(function(){
      $("body .alert-positon").hide()
  },2500)
}
//获取url Id 进行数据请求
var repoId=getQueryVariable('id');
function getQueryVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}
getDetail()
//请求详情信息
function getDetail(){
  var token=localStorage.getItem('token')
  $("#loading").show()
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/info/getRepoDetail?repoId="+repoId+"&token="+token,
    data : {},
    dataType : "json",
    success : function(res) {
      $("#loading").hide()
      if (res.code == "200") {
        var fenleidata=res.data
        $(".ToolUse_Title").append(fenleidata.title)
        $('title').html(res.data.title)
        $(".Video").append(fenleidata.content)
        var height = $(window).height() - 104;
        $(".Video p video").attr("width", "100%");
        $(".Video p video").attr("height",height + "px");
      }
      //token过期 请求重新登录
      if(res.code=="9002"||res.code=="9003"){
        alertFunction("请先登录")
        $(".overlay").show()
      }
    }
  });
}
