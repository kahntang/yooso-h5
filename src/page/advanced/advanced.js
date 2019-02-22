// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./advanced.less')
//弹出层方法
function alertFunction(msg){
  $("body #aleertText").html(msg)
  $("body .alert-positon").show()
  setTimeout(function(){
      $("body .alert-positon").hide()
  },2500)
}
$(function() {
  var height = $(window).height()-132-($(".logo_wrap").height()+$(".header_wrap").height()+$(".footer_wrap").height());
  $(".SearchPage_wrap").css("min-height",height);
});
$("#btn_clear").click(function(){
  emptyText()
})
function emptyText(){
  $("[class='info3'] input").val("");
}
//点击检索
$("#btn_search").click(function(){
  onclickSearch()
})
function onclickSearch(){
  var canSearch=false;//关键词必填写
  var divNodes=$("#dynamicDiv").find(".conTool");
  queryString="";//接口的参数拼接
  divNodes.each(function(){
    var one_str='';
    //先查询下面有几个div
    var childDiv=$(this).find('div[name="'+$(this).attr('id')+'_condition_div"]');//获取div个数
    var $that=$(this)
    childDiv.each(function(){
      var boolValue =$(this).find("div .info1 select").val(); //是否有多个
      var selField =$(this).find("div .info2 select").val();//选中的值
      var inputText =$(this).find("div .info3 input").val();//关键词
      var selectType =$(this).find("div .info4 select").val();//模糊字段
      var exact=true
      var operator=1 //与非字段
      if(selectType=="模糊")exact=false
      if(boolValue=='与')operator=1
      if(boolValue=='或')operator=2
      if(boolValue=='非')operator=3
      var menuId=$that.attr("menuId")
      if(inputText){
        canSearch=true
        one_str+="menuId="+menuId+"&keyword="+inputText+"&exact="+exact+"&attrId="+selField+"&operator="+operator+"&"
      }
    })
    queryString+=one_str

  });
  if(!canSearch){
    return alertFunction('请填写关键词')
  }
  getAdvancedSearch(1,queryString);
}
var curr=1;
var queryString = ""; //检索拼接
var classType = ""; //检索库
/**右侧信息*/
function getAdvancedSearch(curr,queryString) {
  if(queryString==""){
    alertFunction("请输入检索词");
    return;
  }
  var pageSize = 10;
  $("#loading").show()
  var _labelId=localStorage.getItem('canvasKey')
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/search/adv?"+queryString+"style=SUMMARY&highlight=true&pageNo="+curr+"&pageSize=10&labelId="+_labelId,
    dataType : "json",
    success : function(res) {
      $("#loading").hide()
      $("#searchPage").show();
      $("#countNum").html(res.data.totalElements);
      var str=''
      var resultData=res.data.values
      for(var ii=0;ii<resultData.length;ii++){
        str+='<div class="SearchPage_Three"><div class="ToolUse_Right_List"><h1><a href="/detail.html?repoId='+resultData[ii].id
        +'">'+resultData[ii].title+'</a><u>&nbsp;&nbsp;[工具的安全使用]</u></h1><p>'+resultData[ii].content+'</p></div></div>'
      }
      // if(res.data!=null && res.noClassType!=""){
      //   $("#noClassType").html(res.noClassType);
      // }
      $("#rightList").html(str);
      // 显示分页
      var totalRow = res.data.totalElements;
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
            getAdvancedSearch(curr,queryString);
            $('html, body').scrollTop(531);
            //$('html, body').animate({scrollTop:531}, '0');
          }
        }
      }); 
    }
  });
}


//加减号
$("#dynamicDiv").on("click",'.addSearchCondition',function(){
  var _typename=this.getAttribute('typename')
  addSearchCondition(_typename)
})
$("#dynamicDiv").on("click",'.removeSearchCondtition',function(){
  var _typename=this.getAttribute('typename')
  removeSearchCondtition(_typename)
})

function addSearchCondition(nameType){
  var selHtml="";
  selHtml=$("#"+nameType+" .info2").html();
  var html='<div class="condition" name="'+nameType+'_condition_div">'
                                        +'<div class="condition_info info">'
                                        +'<div class="info1">'
                                        +'<select name="bool_value" id="bool_value" style="width:72px;">'
                                        +'<option>与</option>'
                                        +'<option>或</option>'
                                        +'<option>非</option>'
                                        +'</select>'
                                        +'</div>'
                                        +'<div class="info2">';
                                        html+=selHtml;
                                        html+='</div>'
                                        +'<div class="info3"><input placeholder="" type="text"></div>'
                                        +'<div class="info4">'
                                        +'<select name="selectType">'
                                        +'<option>模糊</option>'
                                        +'<option>精确</option>'
                                        +'</select>'
                                        +'</div>'
                                        +'</div>'
                                        +'</div>';
  var div_node = $('div[name="'+nameType+'_condition_div"]');//获取div个数
  if(div_node.length<5){
    $("#"+nameType+"").append(html);
  }	
}
function removeSearchCondtition(nameType){
  var div_node = $('div[name="'+nameType+'_condition_div"]');//获取div个数
  var i = 0;
  $('div[name="'+nameType+'_condition_div"]').each(function(){
    i++;
    if(div_node.length==i && i>1){
      $(this).remove();
    }
  })
}
//点击搜索
//获取搜索配置
getConfig()
function getConfig(){
  $("#loading").show()
  $.ajax({
    type : "post",
    url : "http://safety.kahntang.com/info/getAdvConfig",
    data : {},
    dataType : "json",
    success : function(res) {
      $("#loading").hide()
      var configValue=res.data
      var contentHtml=''
      for(var i=0;i<configValue.length;i++){
        var conChildsHtml=''
        var confChilds=configValue[i].childs
        for(var j=0;j<confChilds.length;j++){
          if(confChilds[j].menuName=='标题'){
            conChildsHtml+='<option value="1">'+confChilds[j].menuName+'</option>'
          }else{
            if(confChilds[j].isIndex && confChilds[j].isIndex==1){
                conChildsHtml+='<option value="'+confChilds[j].id+'">'+confChilds[j].menuName+'</option>'
            }
          }
          
        }
        contentHtml+='<div class="conTool" menuId="'+configValue[i].id+'" id="config'+i+'"><div class="title">'+configValue[i].menuName+'</div><div class="condition" name="config'+i+'_condition_div">'+
                      '<div class="condition_info info"><div class="info1"><span><a href="javascript:void(0);" class="addSearchCondition"  typename="config'+i+'"><i class="info_icon"></i></a>'+
                      '<a href="javascript:void(0);" class="removeSearchCondtition" typename="config'+i+'"><i class="info_icon icon_reduce"></i></a></span></div>'+
                      '<div class="info2"><select name="selField" id="selField">'+conChildsHtml+'</select>'+
                      '</div><div class="info3"><input placeholder="" type="text"></div><div class="info4"><select name="selectType"><option>模糊</option>'+
                      '<option>精确</option></select></div></div></div></div></div>'
      }
      $("#dynamicDiv").html(contentHtml)
    }

  })
}
$("#gotoSearchList").click(function(){
  location.href="/searchList.html?text="+$("#searchText").val()
})