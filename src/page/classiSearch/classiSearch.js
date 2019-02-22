// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./classiSearch.less')
require('./../../../static/js/common.js')

//弹出层方法
function alertFunction(msg) {
    $("body #aleertText").html(msg)
    $("body .alert-positon").show()
    setTimeout(function () {
        $("body .alert-positon").hide()
    }, 2500)
}

//请求分类信息 拼接赋值
$("#loading").show()
$.ajax({
    type: "post",
    url: "http://safety.kahntang.com/info/getLabel",
    data: {},
    dataType: "json",
    success: function (res) {
        $("#loading").hide()
        if (res.code == "200") {
            //拼接
            var resultData = res.data
            var rediaHtml = ''
            // //轮播图区域
            for (var redai = 0; redai < resultData.length; redai++) {
                rediaHtml += ' <div class="one-content left" labelId=' + resultData[redai].id + ' labelName=' + resultData[redai].name + '><div class="content-title gotoClassify" menuId=' + resultData[redai].id + ' menutype=' + resultData[redai].menuType + '>' + resultData[redai].name +
                    '</div><div class="content-body">' +
                    '<ul><li>' + resultData[redai].actionContent + '</li></ul></div></div>'
            }
            $(".index-content").append(rediaHtml)
        }
    }
});

//全部分类界面的搜索 进入普通搜索界面
$("#gotoSearchList").click(function () {
    //判断哪里点击的，进行不同的搜索页面跳转
    var searchText = $("#searchText").val()
    location.href = "/searchList.html?text=" + searchText
})
$("#searchText").keydown(function (event) {
    if (event.keyCode == 13) {
        var searchText = $("#searchText").val()
        location.href = "/searchList.html?text=" + searchText
    }
})
//点击内容打开对应标签的菜单分类界面
$(".index-content").on('click', '.one-content', function () {
    var _labelId = $(this).attr('labelId');
    var _labelName = $(this).attr('labelName')
    localStorage.setItem('canvasKey', _labelId)
    localStorage.setItem('canvasKeyText', _labelName)
    $("#myModalLabel").html(_labelName)
    //请求接口
    //请求列表信息 拼接加入内容
    getMenuList(_labelId)
})

function getMenuList(labelId) {
    $("#loading").show()
    var _url = "http://safety.kahntang.com/info/v1/getMenu"
    if (labelId) {
        _url = _url + "?labelId=" + labelId
    }
    $.ajax({
        type: "post",
        url: _url,
        data: {},
        dataType: "json",
        success: function (res) {
            $('#myModal').modal('show')
            $("#loading").hide()
            if (res.code == "200") {
                var fenleidata = res.data
                var oneConternHtml = ''
                var forLength = fenleidata.length;
                //循环数据
                for (var conI = 0; conI < forLength; conI++) {
                    var childHtml = ''
                    for (var childI = 0; childI < fenleidata[conI].childs.length; childI++) {
                        if (childI < 3) {
                            childHtml += ' <li class="" menuLiId=' + fenleidata[conI].childs[childI].id + ' menuId=' + fenleidata[conI].id + ' menutype=' + fenleidata[conI].menuType + '><a class="gotoDetail" menuurl=' + fenleidata[conI].menuUrl + ' repoid="' + fenleidata[conI].childs[childI].id + '" menutype=' + fenleidata[conI].menuType + '>' + fenleidata[conI].childs[childI].menuName + '</a></li>'
                        }
                    }
                    oneConternHtml += ' <div class="one-content left"><div class="content-title gotoClassify" menuId=' + fenleidata[conI].id + ' menutype=' + fenleidata[conI].menuType + '>' + fenleidata[conI].menuName +
                        '<div class="title_dian"></div><span class="dian_dian">...</span></div><div class="content-body">' +
                        '<ul>' + childHtml + '</ul></div></div>'

                }
                $(".modal-body").html('')
                $(".modal-body").append(oneConternHtml)
            }
        }
    });
}

//跳转到分类页面
$(".classiSeach").on('click', '.gotoClassify', function () {
    //获取分类的type，进行跳转的判断
    var urlMenuType = $(this).attr('menutype')
    var urlmenuId = $(this).attr('menuId')
    var menuLiId = $(this).attr('menuLiId')
    if (!menuLiId) {
        menuLiId = ''
    }
    var openUrl1 = ''
    //menuType 为1是这个危化品 2是图文 3是文件 4是多媒体 null为标准
    if (urlMenuType == 1) {
        // "&menuLiId="+menuLiId
        openUrl1 = "/whpClassify.html?menuId=" + urlmenuId
    } else if (urlMenuType == 2) {
        openUrl1 = "/imgTextClassify.html?menuId=" + urlmenuId
    } else if (urlMenuType == 3) {
        openUrl1 = "/fileClassify.html?menuId=" + urlmenuId
    } else if (urlMenuType == 4) {
        openUrl1 = "/mediaClassify.html?menuId=" + urlmenuId
    } else {
        openUrl1 = "/classify.html?menuId=" + urlmenuId
    }
    window.open(openUrl1)
})
//跳转详情页
$("#myModal").on('click', '.gotoDetail', function () {
    var openUrl = ''
    //获取分类的type，进行跳转的判断
    var urlMenuType = $(this).attr('menutype')
    if (urlMenuType == 3) {
        //文件
        var _menuurl = $(this).attr('menuurl')
        if (_menuurl) {
            openUrl = _menuurl
        }
    } else if (urlMenuType == 4) {
        //多媒体
        openUrl = '/mediaDetail.html?id=' + $(this).attr('repoid')
    } else {
        if (document.createElement('canvas').getContext) {
            openUrl = '/details.html?repoId=' + $(this).attr('repoid')
        } else {
            openUrl = '/detail.html?repoId=' + $(this).attr('repoid')
        }
    }
    window.open(openUrl)
})