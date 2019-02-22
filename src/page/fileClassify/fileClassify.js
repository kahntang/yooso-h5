// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./fileClassify.less')
require('./../../../static/js/common.js')
// var StaticUrl="http://safety.yooso.com.cn/resources/"
var StaticUrl="http://safety.kahntang.com"
//获取url Id 进行数据请求
var menuId=getQueryVariable('menuId');
var menuLiId=getQueryVariable('menuLiId');
//弹出层方法
function alertFunction(msg){
    $("body #aleertText").html(msg)
    $("body .alert-positon").show()
    setTimeout(function(){
        $("body .alert-positon").hide()
    },2500)
  }
function getQueryVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}
getData(1)
var curr=1,page=1;
var isLoadLeftMenu=false
function getData(page){
  if(!page){
    page=1
  }
  $("#searchText").val('')
  $("#loading").show()
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/info/getRepo?menuId="+menuId+"&pageSize=10&pageNo="+page,
    data : {},
    dataType : "json",
    success : function(res) {
       $("#loading").hide()
      if (res.code == "200") {
        // var LeftMenuHtml = '<div style="margin: 0 15px;" id="searchLeft" class="search">'
        //     + '<input id="inputLeft" type="text"  placeholder="输入关键词" /><a href=javascript:leftMenuSearch("true")><i class="icon icon_Search"></i></a>'
        //     + '</div>';
        var contentResult=res.data.values
        var LeftMenuHtml='',RightContentHtml=''
        for (var j = 0; j < contentResult.length; j++) {
            RightContentHtml+='<div class="ToolUse_Right_List" style="padding:12px 0;">'+
                            '<h1 class="gotoDetail" repoId='+contentResult[j].id+'><a style="line-height: 18px;font-weight:normal;font-size: 18px;background: url(http://safety.yooso.com.cn/resources/images/title_icon.png) no-repeat left center;padding-left: 20px;" target="_blank" detailid="'+contentResult[j].id+
                            '" href="'+StaticUrl+contentResult[j].content+'"'+'>'+contentResult[j].title+'</a></h1>'+'</div>'
        }
        //已经请求过了，那么左边数据不再更新，只更新右边数据
        if(!isLoadLeftMenu){
            if(res.data.values.length==0){
                return
            }
            var result=res.data.values[0].menu.childs //左侧菜单
            for (var i = 0; i < result.length; i++) {
            if (result[i].dictItemId == null || result[i].dictItemId == 0) {
                    var ul_MenusHtml=''
                    for(var ulJ=0;ulJ<result[i].childs.length;ulJ++){
                        ul_MenusHtml+='<li><a class="erjimenuli" menuid='+result[i].childs[ulJ].id+' title='+result[i].childs[ulJ].menuName+'id='+result[i].childs[ulJ].id+'>'+result[i].childs[ulJ].menuName+'</a></li>'
                    }
                    LeftMenuHtml+='<li class="btn_showUl" id="menu'+result[i].id+'" menuid='+result[i].id+'>'+
                                '<a class="u_title_btn" title='+result[i].menuName+'id='+result[i].id+'>'+result[i].menuName+'</a>'+
                                '<ul id="ulList'+result[i].id+'" class="TabTwo" style="display:none;">'+ul_MenusHtml+'</ul></li>'
                }
            }
            $("#leftMenuUl").html('');
            $("#leftMenuUl").append(LeftMenuHtml);
            if(menuLiId){
                //判断长度是否有
                var ullilength= $("#menu"+menuLiId+"").find('.TabTwo').find('li').length;
                if(ullilength>0){
                    $("#menu"+menuLiId+"").find('.TabTwo').show()
                }
                $("#menu"+menuLiId+"").find('.u_title_btn').addClass('cur')
            }
            isLoadLeftMenu=true
        }
        if(res.data.values.length>0){
            $(".ToolUse_Title").html(res.data.values[0].menu.menuName+"（"+res.data.totalElements+"）条")
        }else{
            $(".ToolUse_Title").html('法律法规（0）条')
        }
        
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
      }else{
        alertFunction(res.msg)
      }
    }
  });
}

var leftTop;
$(function(){
    leftTop=$(".ToolUse_Left").offset().top;
})
$(document).scroll(function() {
    var scrollTop = $(document).scrollTop();
    var min=leftTop;
    var winHe = $(window).height();   //第一屏高度
    var leftHe = $('.ToolUse_Left').height(); //左侧内容高度
    var rightHe =$('.ToolUse_Right').height();  //右测内容高度
    if(scrollTop>min && winHe>leftHe && leftHe<rightHe) {
        $('.ToolUse_Left').attr("style","position: fixed;z-index: 1000;top: 0px;  margin-top: 0px;");
    }else{
        $('.ToolUse_Left').attr("style","");
    }
});
//点击展开二级菜单
$("#leftMenuUl").on("click",".btn_showUl",function(){
    $("#leftMenuUl").find('.TabTwo').hide()
    $("#leftMenuUl").find('.cur').removeClass('cur')
    $(this).addClass('cur')
    //判断长度是否有
    var ullilength=$(this).find('ul').find('li').length;
    if(ullilength>0){
      $(this).find('ul').show()
    }
    //顺便进行数据请求
    menuId=$(this).attr('menuid')
    getData(1)
})
//点击二级菜单搜索
$("#leftMenuUl").on("click",".erjimenuli",function(event){
    event.stopPropagation();
    $("#leftMenuUl").find('.cur').removeClass('cur')
    $(this).addClass('cur')
    $(this).parents('.btn_showUl').addClass('cur')
    menuId=$(this).attr('menuid')
    getData(1)
})
$("#rightList").on("click",".gotoDetail",function(){
    // var openUrl='/detail.html?repoId='+$(this).attr('repoId')
    // window.open(openUrl)
})
//分类 进入普通搜索界面
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
  $("#loading").show()
  var searchText=$("#searchText").val()
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/search/adv?menuId="+getQueryVariable('menuId')+"&pageSize=10&pageNo="+page+"&keyword="+searchText+"&style=SUMMARY&highlight=true",
    data : {},
    dataType : "json",
    success : function(res) {
        $("#loading").hide()
        if (res.code == "200") {
            var contentResult=res.data.values
            var RightContentHtml=''
            for (var j = 0; j < contentResult.length; j++) {
                RightContentHtml+='<div class="ToolUse_Right_List" style="padding:12px 0;">'+
                                '<h1 class="gotoDetail" repoId='+contentResult[j].id+'><a style="line-height: 18px;font-weight:normal;font-size: 18px;background: url(http://safety.yooso.com.cn/resources/images/title_icon.png) no-repeat left center;padding-left: 20px;" target="_blank" detailid='+contentResult[j].id+
                                +'href="'+contentResult[j].url+'"'+'>'+contentResult[j].title+'</a></h1>'+contentResult[j].content+'</div>'
            }
            //右侧内容拼接
            $("#rightList").html('');
            $("#page").html('');
            $("#rightList").append(RightContentHtml);
            if(res.data.values.length>0){
                $(".ToolUse_Title").html(res.data.values[0].menu.menuName+"（"+res.data.totalElements+"）条")
            }else{
                $(".ToolUse_Title").html('法律法规（0）条')
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
        }else{
            alert(res.errorMsg)
        }
    }
  });
}