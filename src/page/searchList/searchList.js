// //js只有两行代码，在body中加一句话 普通搜索结果的列表
require('./../../../static/css/style.css')
require('./searchList.less')
var commonConfig=require('./../../../static/js/common.js').commonConfig
var StaticUrl=commonConfig.StaticUrl
var searchText=getQueryVariable('text');
function getQueryVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return '';
}
if(!searchText){
    alertFunction('搜索内容不可为空')
}
//弹出层方法
function alertFunction(msg){
    $("body #aleertText").html(msg)
    $("body .alert-positon").show()
    setTimeout(function(){
        $("body .alert-positon").hide()
    },2500)
}

$("#searchText").val(decodeURI(searchText));
// /search/adv 搜索
// 请求参数：
// menuId：大分类ID
// keyword:关键字

// 普通搜索的时候 http://safety.kahntang.com/info/search/adv?keyword=安全&menuId=0
// style的值： TITLE 返回标题   SUMMARY 返回标题和摘要
// highlight： true 返回高亮 高亮词 <em>hello</em>,前端对em标签做样式控制， false 不高亮
// pageNo： 页码
// pageSize： 分页大小
var curr=1,page=1;
getData()
function getData(page){
  if(!page){
    page=1
  }
  $("#loading").show()
  var token=localStorage.getItem('token')
  var _labelId=localStorage.getItem('canvasKey')
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/search/adv?keyword="+searchText+"&pageNo="+page+"&style=SUMMARY&highlight=true&menuId=0&pageSize=10",
    data : {},
    dataType : "json",
    success : function(res) {
        $("#loading").hide()
        //处理数据
        if(res.code=='200'){
          $("#searchNum").html(res.data.totalElements);
          $("#searchPage_title").html(decodeURI(searchText));
          var resResult=res.data.values
          var rightHtml=''
          for(var i=0;i<resResult.length;i++){
            var ahtml='<a href="/detail.html?repoId='+resResult[i].id+'" target="_blank">'+resResult[i].title+'</a>'
            var aContent=resResult[i].content
            if(!aContent){
                aContent=''
            }
            rightHtml+='<div class="ToolUse_Right_List"><h1>'+ahtml+'<u>&nbsp;&nbsp;['+resResult[i].menu.menuName+']</u></h1><p>'+aContent+'</p></div>'
          }
          $("#rightList").html(rightHtml)
        }else{
            alertFunction(res.errorMsg)
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
                    getData(curr)
                    $('html, body').scrollTop(0);
                }
            }
        });
    }
  })
}
//全部分类界面的搜索 进入普通搜索界面
$("#gotoSearchList").click(function(){
    //判断哪里点击的，进行不同的搜索页面跳转
        searchText=$("#searchText").val();
        curr=1;page=1;
        getData()
    //   location.href="/searchList.html?text="+searchText
})
$("#searchText").keydown(function(event){
    if(event.keyCode ==13){
        searchText=$("#searchText").val()
        curr=1;page=1;
        getData()
    //   location.href="/searchList.html?text="+searchText
    }
})
