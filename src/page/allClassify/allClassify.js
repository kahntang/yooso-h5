// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./allClassify.less')
require('./../../../static/js/common.js')
//弹出层方法
function alertFunction(msg){
  $("body #aleertText").html(msg)
  $("body .alert-positon").show()
  setTimeout(function(){
      $("body .alert-positon").hide()
  },2500)
}
//请求列表信息 拼接加入内容
$("#loading").show()
$.ajax({
  type : "post",
  url : "http://safety.kahntang.com/info/getMenu",
  data : {},
  dataType : "json",
  success : function(res) {
    $("#loading").hide()
    if (res.code == "200") {
      var fenleidata=res.data
      var oneConternHtml=''
      for(var conI=0;conI<fenleidata.length;conI++){
        var childHtml=''
        for(var childI=0;childI<fenleidata[conI].childs.length;childI++){
          if(childI<3){
            childHtml+=' <li class="gotoClassify" menuLiId='+fenleidata[conI].childs[childI].id+' menuId='+fenleidata[conI].id+' menutype='+fenleidata[conI].menuType+'><a>'+fenleidata[conI].childs[childI].menuName+'</a></li>'
          }
        }
        oneConternHtml+=' <div class="one-content left"><div class="content-title gotoClassify" menuId='+fenleidata[conI].id+' menutype='+fenleidata[conI].menuType+'>'+fenleidata[conI].menuName+
                        '<div class="title_dian"></div><span class="dian_dian">...</span></div><div class="content-body">'+
                        '<ul>'+childHtml+'</ul></div></div>' 
      }
      $(".index-content").append(oneConternHtml)
    }
  }
});
//跳转到分类页面
$(".index-content").on('click','.gotoClassify',function(){
  //获取分类的type，进行跳转的判断
  var urlMenuType=$(this).attr('menutype')
  var urlmenuId=$(this).attr('menuId')
  var menuLiId=$(this).attr('menuLiId')
  //menuType 为1是这个危化品 2是图文 3是文件 4是多媒体 null为标准
  if(urlMenuType==1){
    location.href="/whpClassify.html?urlmenuId="+urlmenuId+"&menuLiId="+menuLiId
  }else if(urlMenuType==2){
    location.href="/imgTextClassify.html?urlmenuId="+urlmenuId+"&menuLiId="+menuLiId
  }else if(urlMenuType==3){
    location.href="/fileClassify.html?urlmenuId="+urlmenuId+"&menuLiId="+menuLiId
  }else if(urlMenuType==4){
    location.href="/mediaClassify.html?urlmenuId="+urlmenuId+"&menuLiId="+menuLiId
  }else{
    location.href="/classify.html?urlmenuId="+urlmenuId+"&menuLiId="+menuLiId
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
    var searchText=$("#searchText").val()
    location.href="/searchList.html?text="+searchText
  }
})