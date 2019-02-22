// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./index.less')
var commonConfig=require('./../../../static/js/common.js').commonConfig
var mySwiper = ''
//弹出层方法
function alertFunction(msg){
  $("body #aleertText").html(msg)
  $("body .alert-positon").show()
  setTimeout(function(){
      $("body .alert-positon").hide()
  },2500)
}
//请求列表信息 拼接加入内容
// getMenuList()
//左右切换
//存储分类的额数据
var classifyData=[]
$('#iconLeft').click(function(){
  var _classifyData=classifyData.length
  var _selActive=mySwiper.realIndex
  if(_selActive==0){
    _selActive=8
  }else{
    _selActive=_selActive-1
  }
  //确定是哪个，进行样式赋值并且重新请求
  var _typId=classifyData[_selActive].id;
  var _domStr='one-canvas'+_selActive
  $("."+_domStr).parent().find('.canvasFocus').removeClass('canvasFocus');
  $("."+_domStr).addClass('canvasFocus');
  getMenuList(_typId)
  mySwiper.slidePrev();
})
$('#iconRight').click(function(){
  var _classifyData=classifyData.length
  var _selActive=mySwiper.realIndex
  if(_selActive==8){
    _selActive=0
  }else{
    _selActive=_selActive+1
  }
  //确定是哪个，进行样式赋值并且重新请求
  var _typId=classifyData[_selActive].id;
  var _domStr='one-canvas'+_selActive
  $("."+_domStr).parent().find('.canvasFocus').removeClass('canvasFocus');
  $("."+_domStr).addClass('canvasFocus');
  getMenuList(_typId)
  mySwiper.slideNext();
})
//请求分类信息 拼接赋值
$.ajax({
  type : "post",
  url : commonConfig.APIUrl+"/info/getLabel",
  data : {},
  dataType : "json",
  success : function(res) {
    if (res.code == "200") {
      //拼接
      var resultData=res.data
      classifyData=resultData
      var swiperhtml='',iconhtml=''
      //轮播图区域
      var _canvasKeyId=localStorage.getItem('canvasKey')
      for(var redai=0;redai<resultData.length;redai++){
        swiperhtml+='<div class="swiper-slide">'+
                    '<div class="swiper-name">'+resultData[redai].name+'</div>'+
                    '<div class="swiper-text">'+resultData[redai].actionContent+'</div>'+
                    '</div>'
        if(_canvasKeyId&&_canvasKeyId==resultData[redai].id||(!_canvasKeyId&&redai==0)){
          iconhtml+='<div class="one-canvas canvasFocus one-canvas'+redai+'" ids="'+resultData[redai].id+'" indexs="'+redai+'">'+
                  '<img src="'+resultData[redai].icon+'" /><p>'+resultData[redai].name+'</p></div>'
        }else{
          iconhtml+='<div class="one-canvas one-canvas'+redai+'" ids="'+resultData[redai].id+'" indexs="'+redai+'">'+
                  '<img src="'+resultData[redai].icon+'" /><p>'+resultData[redai].name+'</p></div>'
        }      
      }
      $(".new-swiper-warp").append(swiperhtml)
      iconhtml+="<div class='moreCanvas'>+ 更多工种</div>"
      $(".title-canvas").append(iconhtml)
      //初始化轮播图
      mySwiper = new Swiper('.swiper-container', {
        // autoplay: {
        //   disableOnInteraction:false,
        //   delay:2500
        // },//可选选项，自动滑动
        loop:true,
        pagination: {
          el: '.swiper-pagination',
          type:'custom'
        },
      })
      if(_canvasKeyId){
        var _swiperIndex=localStorage.getItem('_swiperIndex')
        mySwiper.slideTo(Number(_swiperIndex)+1)
        getMenuList(_canvasKeyId)
      }else{
        localStorage.setItem('canvasKey',resultData[0].id)
        localStorage.setItem('canvasKeyText',resultData[0].name)
        getMenuList(resultData[0].id)
      }
    }
  }
});
function getMenuList(labelId){
  $("#loading").show()
  var _url=commonConfig.APIUrl+"/info/v1/getMenu"
  if(labelId){
    _url=_url+"?labelId="+labelId
  }
  $.ajax({
    type : "post",
    url : _url,
    data : {},
    dataType : "json",
    success : function(res) {
      $("#loading").hide()
      if (res.code == "200") {
        var fenleidata=res.data
        var oneConternHtml=''
        var forLength=fenleidata.length;
        //循环数据
        for(var conI=0;conI<forLength;conI++){
          var childHtml=''
          for(var childI=0;childI<fenleidata[conI].childs.length;childI++){
            if(childI<3){
              childHtml+=' <li class="" menuLiId='+fenleidata[conI].childs[childI].id+' menuId='+fenleidata[conI].id+' menutype='+fenleidata[conI].menuType+'><a class="gotoDetail" menuurl='+fenleidata[conI].menuUrl+' repoid="'+fenleidata[conI].childs[childI].id+'" menutype='+fenleidata[conI].menuType+'>'+fenleidata[conI].childs[childI].menuName+'</a></li>'
            }
          }
          oneConternHtml+=' <div class="one-content left"><div class="content-title gotoClassify" menuId='+fenleidata[conI].id+' menutype='+fenleidata[conI].menuType+'>'+fenleidata[conI].menuName+
                          '<div class="title_dian"></div><span class="dian_dian">...</span></div><div class="content-body">'+
                          '<ul>'+childHtml+'</ul></div></div>' 
          
        }
        $(".index-content").html('')
        $(".index-content").append(oneConternHtml)
      }
    }
  });
}
//跳转到分类页面
$(".index-content").on('click','.gotoClassify',function(){
  //获取分类的type，进行跳转的判断
  var urlMenuType=$(this).attr('menutype')
  var urlmenuId=$(this).attr('menuId')
  var menuLiId=$(this).attr('menuLiId')
  if(!menuLiId){
    menuLiId=''
  }
  //menuType 为1是这个危化品 2是图文 3是文件 4是多媒体 null为标准
  if(urlMenuType==1){
    // +"&menuLiId="+menuLiId
    location.href="/whpClassify.html?menuId="+urlmenuId
  }else if(urlMenuType==2){
    location.href="/imgTextClassify.html?menuId="+urlmenuId
  }else if(urlMenuType==3){
    location.href="/fileClassify.html?menuId="+urlmenuId
  }else if(urlMenuType==4){
    location.href="/mediaClassify.html?menuId="+urlmenuId
  }else{
    location.href="/classify.html?menuId="+urlmenuId
  }
})
//跳转详情页
$(".index-content").on('click','.gotoDetail',function(){
  var openUrl=''
  //获取分类的type，进行跳转的判断
  var urlMenuType=$(this).attr('menutype')
  if(urlMenuType==3){
    //文件
    var _menuurl=$(this).attr('menuurl')
    if(_menuurl){
      openUrl=_menuurl
    }
  }else if(urlMenuType==4){
    //多媒体
    openUrl='/mediaDetail.html?id='+$(this).attr('repoid')
  }else{
    if(document.createElement('canvas').getContext){
        openUrl='/details.html?repoId='+$(this).attr('repoid')
    }else{
        openUrl='/detail.html?repoId='+$(this).attr('repoid')
    }
  }
  window.open(openUrl)
})
//更多分类 跳转到全部分类页面
$(".title-canvas").on('click','.moreCanvas',function(){
  location.href="/classiSearch.html"
})

//首页搜索 进入普通搜索界面
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
//显示全部的分类
var isShowAll=false
$(".see-moreContent").click(function(){
  if(!isShowAll){
    $('.one-hide-content').show()
    isShowAll=true
    $(this).html('点击收起部分')
  }else{
    isShowAll=false
    $('.one-hide-content').hide()
    $(this).html('点击显示全部')
  }
});
//点击分类图表，切换下面数据显示
$(".title-canvas").on('click','.one-canvas',function(){
  var _typId=$(this).attr('ids');
  $(this).parent().find('.canvasFocus').removeClass('canvasFocus');
  $(this).addClass('canvasFocus');
  var _swiperIndex=$(this).attr('indexs');
  //缓存好上一次点击的数据
  localStorage.setItem('canvasKey',_typId)
  localStorage.setItem('canvasKeyText',classifyData[_swiperIndex].name)
  localStorage.setItem('_swiperIndex',_swiperIndex)
  mySwiper.slideTo(Number(_swiperIndex)+1)
  getMenuList(_typId)
})