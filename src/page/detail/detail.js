// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./detail.less')
// var StaticUrl="http://safety.yooso.com.cn/resources/"
var StaticUrl="http://safety.kahntang.com/"

//弹出层方法
function alertFunction(msg){
  $("body #aleertText").html(msg)
  $("body .alert-positon").show()
  setTimeout(function(){
      $("body .alert-positon").hide()
  },2500)
}
//获取url Id 进行数据请求
var repoId=getQueryVariable('repoId');
 var levelShows = new Array(); //右侧导航的id数组
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
        getOtherData()//请求其他库相关资源
        var fenleidata=res.data
        var oneConternHtml='<div class="ShareDetailsBlock ShareDetailsBlockAnother"><div class="left"><a><img style="width: 347px;height: 260px;" src="'+StaticUrl+fenleidata.url+'">'+'</a></div><div class="right">'+
                      '<h1><a>'+fenleidata.title+'</a></h1><dl>'+fenleidata.whpDesc+'</dl></div></div>'
        var tableHtml='',ulNavListHtml=''
        var otherAttrs=res.data.attrs
        //更改title
        $('title').html(res.data.title)
        var _idsType=res.data.menu.id
        var _attrI=0
        //判断是否是危化品，危化品
        if(_idsType==10){
          _attrI=4
          var _titleBody='<div class="ShareDetailsBlock ShareDetailsBlockAnother"><div class="left"><a>'+
                        '<img style="width: 347px;height: 260px;" src="'+StaticUrl+res.data.url+'"></a>'+
                        '</div><div class="right"><h1><a>'+res.data.title+'</a></h1>'+'<dl><dt>别名</dt><dd>'+res.data.attrs[0].attrValue+'</dd></dl><dl><dt>英文名称</dt><dd>'+res.data.attrs[1].attrValue+'</dd></dl><dl>'+
                        '<dt>其他英文名</dt><dd>'+res.data.attrs[2].attrValue+'</dd></dl><dl><dt>CAS</dt><dd>'+res.data.attrs[3].attrValue+'</dd></dl></div></div>'			
        }else{
          var  _titleImg='' //工具的 还有图片
          if(res.data.url){
            _titleImg= '<div class="Video"><img style="height: 228px;" src="'+StaticUrl+res.data.url+'" /></div>' //工具的 还有图片
          }
          var _titleBody='<div class="ShareDetailsBlock MediaBlockAnother"><div class="title">'+res.data.title+'</div>'+_titleImg+'</div>'
        }
        for(var attrI=_attrI;attrI<otherAttrs.length;attrI++){
          var attrValueNull=otherAttrs[attrI].attrValue
          if(!attrValueNull || attrValueNull=='null' || attrValueNull=='NULL'){
            attrValueNull=''
            ulNavListHtml+='<li disabled="disabled" class="li-disabled" name="level'+attrI+'" level='+attrI+'><a style="color:#909090;"><span>'+otherAttrs[attrI].prop.attrName+'</span></a></li>'
          }
          else{
              tableHtml+='<div class="ShareDetailsBlock ShareDetailsBlockOther" id="level'+attrI+'"><div class="title">'+otherAttrs[attrI].prop.attrName+
                  '</div>'+attrValueNull+'</div>'
              ulNavListHtml+='<li name="level'+attrI+'" level='+attrI+'><a style="color:#909090;"><span>'+otherAttrs[attrI].prop.attrName+'</span></a></li>'
          }
        }
        $(".ShareDetailsBlockAnother").append(oneConternHtml)
        if(!_titleBody){
          _titleBody=''
        }
        $(".ShareDetailsCon").append(_titleBody+tableHtml)
        $("#ulNavList").append(ulNavListHtml)
        //右侧导航的li计算
        var elTop = ($(window).height() - $("#elevator").height()) / 2 - 5;
        $('.elevator').css('top', elTop + 'px');
        var liLength = $("#elevator ul li").length+4;
        for (var i = 4; i < liLength; i++) {
          if ($("#level" + i).html() == null) {
            $("[name=level" + i + "] a").attr("style","color:#909090;");
            $("[name=level" + i + "] a").removeAttr("href");
          } else {
            levelShows[levelShows.length] = i;
          }
        }
      }
      //token过期 请求重新登录
      if(res.code=="9002"||res.code=="9003"){
        alertFunction("请先登录")
        $(".overlay").show()
      }
    }
  });
}
//请求其他库资源文件
function getOtherData(){
  var token=localStorage.getItem('token')
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/search/getReltRepo?token="+token+"&entityId="+repoId,
    data : {},
    dataType : "json",
    success : function(res) {
      if (res.code == "200") {
        var otherShareData=res.data
        var otherShareHtml=''
        //遍历数据
        for(var oi=0;oi<otherShareData.length;oi++){
          var _otherSmallData=''
          if(oi==0){
            for(var ii=0;ii<otherShareData[oi].data.length;ii++){
              var _iscontNull=otherShareData[oi].data[ii].content
              //判断是否是危化品
              if(otherShareData[oi].data[ii].menu.id==10){
                _iscontNull=otherShareData[oi].data[ii].whpDesc
              }
              if(!_iscontNull){
                _iscontNull=''
              }
              _otherSmallData+='<div class="ClassicCaseCon"><a href="/detail.html?repoId='+otherShareData[oi].data[ii].id+'" target="_blank">'+otherShareData[oi].data[ii].title+'</a><p>'+_iscontNull+'</p></div>'
            }
            otherShareHtml+='<div class="ClassicCase" style=""><div class="big-title"><span>其他库相关资源</span></div><div class="title">'+
                              otherShareData[oi].data[0].menu.menuName+'</div><div class="ClassicCaseBlock">'+_otherSmallData+'</div></div>'
          }else{
            for(var ii=0;ii<otherShareData[oi].data.length;ii++){
              var _iscontNull=otherShareData[oi].data[ii].content
              //判断是否是危化品
              if(otherShareData[oi].data[ii].menu.id==10){
                _iscontNull=otherShareData[oi].data[ii].whpDesc
              }
              if(!_iscontNull){
                _iscontNull=''
              }
              if(!_iscontNull){
                _iscontNull=''
              }
              _otherSmallData+='<div class="ClassicCaseCon"><a href="/detail.html?repoId='+otherShareData[oi].data[ii].id+'" target="_blank">'+otherShareData[oi].data[ii].title+'</a><p>'+_iscontNull+'</p></div>'
            }
            otherShareHtml+='<div class="ClassicCase" style=""><div class="title">'+otherShareData[oi].data[0].menu.menuName+'</div><div class="ClassicCaseBlock">'+_otherSmallData+'</div></div>'
          }
          
        }
        otherShareHtml=otherShareHtml
        $("#containerOtherShare").html(otherShareHtml)
      }
    }
  })
}

$(function() {
  var level = 0; //当前层级
  $('#elevator').on('click','li',function() {
    var name = $(this).attr("name");
    var _disabled = $(this).attr("disabled");
    if(_disabled=='disabled'){
      return
    }
    level=$(this).attr("level")-4
    var top = $("#" + name).offset().top;
    $('html, body').scrollTop($("#" + name).offset().top);
    $('#elevator').find('.ui-elevator-select').removeClass('ui-elevator-select')
    $(this).addClass('ui-elevator-select');
  });
  $(window).scroll(function() {
      if(levelShows.length<1){
        return
      }
      var startTop = $("#level" + levelShows[level]).offset().top; //当前等级开始位置
      var endTop = startTop+ $("#level" + levelShows[level]).height(); //当前等级结束位置
      var scrollTops = $(window).scrollTop(); //目前滑动位置
      if (scrollTops >= startTop&& scrollTops <= endTop) { //当前刷新时
        $('#elevator').find('.ui-elevator-select').removeClass('ui-elevator-select')
        $("[name=level" + levelShows[level] + "]").addClass('ui-elevator-select')
      } else if (scrollTops > endTop) {
        if (level + 1 < levelShows.length) { //下滑时
          level = level + 1;
          $('#elevator').find('.ui-elevator-select').removeClass('ui-elevator-select')
          $("[name=level"+ levelShows[level]+ "]").addClass('ui-elevator-select')
        } else {
          $("[name=level"+ levelShows[level]+ "]").removeClass('ui-elevator-select');
        }
      } else if (scrollTops < startTop) { //上滑时
        if (level > 0) {
          level = level - 1;
          $('#elevator').find('.ui-elevator-select').removeClass('ui-elevator-select')
          $("[name=level"+ levelShows[level]+ "]").addClass('ui-elevator-select')
        } else {
          $("[name=level"+ levelShows[level]+ "]").removeClass('ui-elevator-select');
        }
      }
    });
});

$(function() {
  var width = $(window).width();
  var RightWidth = (width - $(".container").width()-48-66) / 2;
  if (width > 1442) {
    $('.elevator').css('right',+RightWidth - 90 + 38 + 'px')
  } else {
    $('.elevator').css('right', '0px')
  }
})

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