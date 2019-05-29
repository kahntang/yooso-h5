// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./whpClassify.less')
var commonConfig=require('./../../../static/js/common.js').commonConfig
var StaticUrl=commonConfig.StaticUrl
var leftTop;
var leftABC='A' //ABC选项
var LeftwhpName=''//危化品中文
$(function(){
  leftTop=$(".WHPQuery_Left").offset().top;
})
//弹出层方法
function alertFunction(msg){
  $("body #aleertText").html(msg)
  $("body .alert-positon").show()
  setTimeout(function(){
      $("body .alert-positon").hide()
  },2500)
}
$(document).scroll(function() {
  var scrollTop = $(document).scrollTop();
  var min=leftTop;
  var winHe = $(window).height();   //第一屏高度
  var whpLeftHe = $('.WHPQuery_Left').height(); //左侧内容高度
  var whpRightHe =$('#rightList').height();  //右测内容高度
  if(scrollTop>min && winHe>whpLeftHe && whpLeftHe<whpRightHe) {
    $('.WHPQuery_Left').attr("style","position: fixed;z-index: 1000;top: 0px; margin-top: 0px;");
  }else{
    $('.WHPQuery_Left').attr("style","");
  }
});
//获取url Id 进行数据请求
var menuId=getQueryVariable('menuId');
var menuLiId=getQueryVariable('menuLiId');
function getQueryVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}
//请求危化品初始化数据
getData(1)
var curr=1;
var page=1;
var isLoadLeftMenu=false
//这里获取的是右侧内容分页展示的html
function getData(page){
  if(!page){
    page=1
  }
  $("#loading").show()
  $("#searchText").val('')
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/info/getRepo?menuId="+menuId+"&pageSize=10&pageNo="+page+"&whpPy="+leftABC+"&whpName="+LeftwhpName,
    data : {},
    dataType : "json",
    success : function(res) {
      $("#loading").hide()
      if (res.code == "200") {
        var contentResult=res.data.values
        var LeftMenuHtml='',RightContentHtml=''
        for (var j = 0; j < contentResult.length; j++) {
            RightContentHtml+='<div class="WHPQuery_Right_List"><div class="WHPQuery_Right_Main"><a target="_blank" class="gotoDetail" style="background:url('+contentResult[j].url+' no-repeat) "'+'title="'+contentResult[j].title+'"'+'repoId='+contentResult[j].id+'>'+
                              '<strong>'+contentResult[j].title+'</strong></a></div><div class="WHPQuery_Right_Details"><dl style="text-align:left;line-height:30px;">'+contentResult[j].whpDesc+
                              '</dl><dl style="text-align:left;">危险性概述:</dl><dl>'+contentResult[j].content+'</dl></div></div>'
        }
        //已经请求过了，那么左边数据不再更新，只更新右边数据
        if(!isLoadLeftMenu){
            isLoadLeftMenu=true
            // $("#WHPQuery_Title").html(res.data.values[0].menu.menuName)
            
        }
        $("#WHPQuery_Title").html(res.data.values[0].menu.menuName+"（"+res.data.totalElements+"）条")
        //右侧内容拼接
        $("#rightList").html('');
        $("#page").html('');
        $("#rightList").append(RightContentHtml);
        //分页页数
        // 显示分页
        var totalRow = res.data.totalElements;
        var pages;
        var groups;
        if (totalRow % 10 == 0) {
            pages = totalRow / 10;
        } else {
            pages = Math.ceil(totalRow / 10); //四舍五入取大值
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
                    curr=obj.curr;
                    // 进行数据请求
                    // (curr);
                    getData(curr)
                    $('html, body').scrollTop(0);
                }
            }
        }); 
      }
    }
  });
}
//获取危化品知识分类
getWHPData()
function getWHPData(){
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/info/getMenu?menuId="+menuId+"&whpPy="+leftABC,
    data : {},
    dataType : "json",
    success : function(res) {
      if(res.code=='200'){
        var getLileftHtml=''
        for(var resi=0;resi<res.data.length;resi++){
          getLileftHtml+='<li><a class="aclickmenu" title='+res.data[resi].menuName+' >'+res.data[resi].menuName+'</a></li>'
        }
        $("#leftInList").html(getLileftHtml)
      }
    }
  })
}
//点击切换左边分类
$(".leftABCBTN").click(function(){
  leftABC=$(this).attr('leftname')
  LeftwhpName=''
  $("#leftnavText").html(leftABC)
  $(this).parent().find('.cur').removeClass('cur')
  $(this).addClass('cur')
  getWHPData()
  //获取右边数据
  page=1
  curr=1//当前页
  getData()
})
//点击文字的二级分类
$("#leftInList").on('click','.aclickmenu',function(){
  LeftwhpName=$(this).attr('title')
  $(this).parent().find('.cur').removeClass('cur')
  $(this).addClass('cur')
  page=1
  curr=1//当前页
  getData()
})

//点击搜索相应内容
//首页搜索 进入普通搜索界面
$("#gotoSearchList").click(function(){
    //进行接口请求 覆盖右边数据
    page=1
    curr=1//当前页
    getSearchData(page)
});
$("#searchText").keydown(function(event){
  if(event.keyCode ==13){
    //进行接口请求 覆盖右边数据
      page=1
      curr=1//当前页
      getSearchData(page)
  }
})
function getSearchData(page){
  if(!page){
    page=1
  }
  var searchText=$("#searchText").val()
  $("#loading").show();
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/search/adv?menuId="+menuId+"&pageSize=10&pageNo="+page+"&keyword="+searchText+"&style=SUMMARY&highlight=true",
    data : {},
    dataType : "json",
    success : function(res) {
      $("#loading").hide();
      if (res.code == "200") {
        var contentResult=res.data.values
        var RightContentHtml=''
        for (var j = 0; j < contentResult.length; j++) {
            var whpDesc=contentResult[j].whpDesc
            if(!whpDesc){
              whpDesc=''
            }
            RightContentHtml+='<div class="WHPQuery_Right_List"><div class="WHPQuery_Right_Main"><a target="_blank" style="background:url('+contentResult[j].url+' no-repeat) "'+'title="'+contentResult[j].title+'"'+'repoId='+contentResult[j].id+'>'+
                              '<strong>'+contentResult[j].title+'</strong></a></div><div class="WHPQuery_Right_Details"><dl style="text-align:left;line-height:30px;">'+whpDesc+
                              '</dl><dl style="text-align:left;">危险性概述:</dl><dl>'+contentResult[j].content+'</dl></div></div>'
        }
        //右侧内容拼接
        $("#rightList").html('');
        $("#page").html('');
        $("#rightList").append(RightContentHtml);
        if(res.data.values.length>0){
            $(".WHPQuery_Title").html(res.data.values[0].menu.menuName+"（"+res.data.totalElements+"）条")
        }else{
            $(".WHPQuery_Title").html($('title').html()+'（0）条')
        }
        //分页页数
        // 显示分页
        var totalRow = res.data.totalElements;
        var pages;
        var groups;
        if (totalRow % 10 == 0) {
            pages = totalRow / 10;
        } else {
            pages = Math.ceil(totalRow / 10); //四舍五入取大值
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
                    curr=obj.curr;
                    // 进行数据请求
                    // (curr);
                    getSearchData(curr)
                    $('html, body').scrollTop(0);
                }
            }
        }); 
      }
    }
  });
}
//前往详情页
$("#rightList").on("click",".gotoDetail",function(){
  var openUrl
  if(document.createElement('canvas').getContext){
      openUrl='/details.html?repoId='+$(this).attr('repoId')
  }else{
      openUrl='/detail.html?repoId='+$(this).attr('repoId')
  }
  // var openUrl='/detail.html?repoId='+$(this).attr('repoId')
  window.open(openUrl)
})