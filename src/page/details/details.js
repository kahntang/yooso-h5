// //js只有两行代码，在body中加一句话
require('./../../../static/css/style.css')
require('./details.less')
// var StaticUrl="http://safety.yooso.com.cn/resources/"
var StaticUrl = "http://safety.kahntang.com/"

//弹出层方法
function alertFunction(msg) {
    $("body #aleertText").html(msg)
    $("body .alert-positon").show()
    setTimeout(function () {
        $("body .alert-positon").hide()
    }, 2500)
}

//获取url Id 进行数据请求
var repoId = getQueryVariable('repoId');
var levelShows = new Array(); //右侧导航的id数组
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

getDetail()
var detailTitle = ''

//请求详情信息
function getDetail() {
    var token = localStorage.getItem('token')
    $("#loading").show()
    $.ajax({
        type: "post",
        url: "http://safety.kahntang.com/info/getRepoDetail?repoId=" + repoId + "&token=" + token,
        data: {},
        dataType: "json",
        success: function (res) {
            $("#loading").hide()
            if (res.code == "200") {
                getOtherData()//请求其他库相关资源
                var fenleidata = res.data
                var oneConternHtml = '<div class="ShareDetailsBlock ShareDetailsBlockAnother"><div class="left"><a><img style="width: 347px;height: 260px;" src="' + StaticUrl + fenleidata.url + '">' + '</a></div><div class="right">' +
                    '<h1><a>' + fenleidata.title + '</a></h1><dl>' + fenleidata.whpDesc + '</dl></div></div>'
                var tableHtml = '', ulNavListHtml = ''
                var otherAttrs = res.data.attrs
                //更改title
                $('title').html(res.data.title)
                detailTitle = res.data.title
                var _idsType = res.data.menu.id
                var _attrI = 0
                //判断是否是危化品，危化品
                if (_idsType == 10) {
                    _attrI = 4
                    var _titleBody = '<div class="ShareDetailsBlock ShareDetailsBlockAnother"><div class="left"><a>' +
                        '<img style="width: 347px;height: 260px;" src="' + StaticUrl + res.data.url + '"></a>' +
                        '</div><div class="right"><h1><a>' + res.data.title + '</a></h1>' + '<dl><dt>别名</dt><dd>' + res.data.attrs[0].attrValue + '</dd></dl><dl><dt>英文名称</dt><dd>' + res.data.attrs[1].attrValue + '</dd></dl><dl>' +
                        '<dt>其他英文名</dt><dd>' + res.data.attrs[2].attrValue + '</dd></dl><dl><dt>CAS</dt><dd>' + res.data.attrs[3].attrValue + '</dd></dl></div></div>'
                } else {
                    var _titleImg = '' //工具的 还有图片
                    if (res.data.url) {
                        _titleImg = '<div class="Video"><img style="height: 228px;" src="' + StaticUrl + res.data.url + '" /></div>' //工具的 还有图片
                    }
                    var _titleBody = '<div class="ShareDetailsBlock MediaBlockAnother"><div class="title">' + res.data.title + '</div>' + _titleImg + '</div>'
                }
                for (var attrI = _attrI; attrI < otherAttrs.length; attrI++) {
                    //判断是否显示
                    if (otherAttrs[attrI].prop.isShow) {
                        var attrValueNull = otherAttrs[attrI].attrValue
                        if (!attrValueNull || attrValueNull == 'null' || attrValueNull == 'NULL') {
                            attrValueNull = ''
                            ulNavListHtml += '<li disabled="disabled" class="li-disabled" name="level' + attrI + '" level=' + attrI + '><a style="color:#909090;"><span>' + otherAttrs[attrI].prop.attrName + '</span></a></li>'
                        }
                        else {
                            tableHtml += '<div class="ShareDetailsBlock ShareDetailsBlockOther" id="level' + attrI + '"><div class="title">' + otherAttrs[attrI].prop.attrName +
                                '</div>' + attrValueNull + '</div>'
                            ulNavListHtml += '<li name="level' + attrI + '" level=' + attrI + '><a style="color:#000000;"><span>' + otherAttrs[attrI].prop.attrName + '</span></a></li>'
                        }
                    }
                }
                $(".ShareDetailsBlockAnother").append(oneConternHtml)
                if (!_titleBody) {
                    _titleBody = ''
                }
                $(".ShareDetailsCon").append(_titleBody + tableHtml)
                $("#ulNavList").append(ulNavListHtml)
                //右侧导航的li计算
                var elTop = $(window).height() - 600;
                $('.elevator').css('top', elTop + 'px');
                var liLength = $("#elevator ul li").length + 4;
                for (var i = 4; i < liLength; i++) {
                    if ($("#level" + i).html() == null) {
                        $("[name=level" + i + "] a").attr("style", "color:#909090;");
                        $("[name=level" + i + "] a").removeAttr("href");
                    } else {
                        levelShows[levelShows.length] = i;
                    }
                }
            }
            //token过期 请求重新登录
            if (res.code == "9002" || res.code == "9003") {
                alertFunction("请先登录")
                $(".overlay").show()
            }
        }
    });
}

//请求其他库资源文件
function getOtherData() {
    var token = localStorage.getItem('token')
    $.ajax({
        type: "post",
        url: "http://safety.kahntang.com/search/getReltRepo2?token=" + token + "&entityId=" + repoId,
        data: {},
        dataType: "json",
        success: function (res) {
            if (res.code == "200") {
                var otherShareData = res.data
                //渲染canvas charts
                chartsRender(otherShareData)
            }
        }
    })
}

//渲染canvas
function chartsRender(data) {
    var myChart = echarts.init(document.getElementById('charts'));
    var graph = {
        links: [],
        nodes: []
    }
    //首先默认文章的title为第一个圆圈
    var first_obj = {
        id: "0",
        category: 0,
        draggable: true,
        attributes: {modularity_class: 0},
        itemStyle: null,
        name: detailTitle,
        symbolSize: 10,
        value: 10,
    }
    graph.nodes.push(first_obj)
    //创建1级关系
    for (var p = 0; p < data.length; p++) {
        //关键词的循环
        //创建关键词的层级和链接
        if (data[p].repos.length > 0) {
            //当关键词下有相关的数据时，才创建
            var _node1 = {
                id: String(p + 1),
                category: 0,
                draggable: true,
                attributes: {modularity_class: 1},
                itemStyle: null,
                name: data[p].keyword,
                symbolSize: 10,
                value: 10,
            }
            graph.nodes.push(_node1)
            var _link1 = {
                id: String(p + 1),
                lineStyle: {normal: {}},
                name: '',
                source: String(p + 1),
                target: "0"
            }
            graph.links.push(_link1)
        }
    }
    //创建2级关系 库
    for (var t = 0; t < data.length; t++) {
        if (data[t].repos.length > 0) {
            for (var u = 0; u < data[t].repos.length; u++) {
                //假设这个库 没有对应的文章 那么不显示
                if (data[t].repos[u].data.length > 0) {
                    var _length = graph.nodes.length
                    var _linkLength = graph.links.length
                    var _node2 = {
                        id: String(_length),
                        category: 0,
                        draggable: true,
                        attributes: {modularity_class: 2},
                        itemStyle: null,
                        name: data[t].repos[u].menu.menuName,
                        symbolSize: 10,
                        value: 10,
                    }
                    graph.nodes.push(_node2)
                    var _link2 = {
                        id: String(_linkLength),
                        lineStyle: {normal: {}},
                        name: '',
                        source: String(_length),
                        target: String(t + 1)
                    }
                    graph.links.push(_link2)
                }

            }
        }
    }
    //最后的链接层级改造
    var _target3 = 2
    for (var r = 0; r < data.length; r++) {
        if (data[r].repos.length > 0) {
            for (var q = 0; q < data[r].repos.length; q++) {
                //假设这个库 没有对应的文章 那么库不显示
                //记录库的id是多少
                if (data[r].repos[q].data.length > 0) {
                    var _linkIntitle = data[r].repos[q].data
                    _target3++
                    for (var l = 0; l < _linkIntitle.length; l++) {
                        var _length3 = graph.nodes.length
                        var _linkLength3 = graph.links.length
                        var _node3 = {
                            id: String(_length3),
                            category: 0,
                            draggable: true,
                            attributes: {modularity_class: 3},
                            itemStyle: null,
                            name: _linkIntitle[l].title,
                            symbolSize: 10,
                            value: 10,
                            repodId: _linkIntitle[l].id
                        }
                        graph.nodes.push(_node3)
                        var _link3 = {
                            id: String(_linkLength3),
                            lineStyle: {normal: {}},
                            name: '',
                            source: String(_length3),
                            target: String(_target3)
                        }
                        graph.links.push(_link3)
                    }
                }

            }
        }
    }
    graph.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.symbolSize = 10;
        node.value = node.symbolSize;
        node.category = node.attributes.modularity_class;
        node.x = node.y = null;
        node.draggable = true;
        node.label = {
            show: true,
            color: "#ce1820",
            position: 'bottom',
            fontSize: 12
        }
        if (node.attributes.modularity_class == 0) {
            //顶级的
            node.symbolSize = 20;
            node.symbol = 'circle'
            node.itemStyle = {
                color: '#ce1820',
            }
        }
        if (node.attributes.modularity_class == 1) {
            //关键词的
            var _len = node.name.length
            node.symbolSize = [_len * 20, 25];
            node.symbol = 'rect'
            node.itemStyle = {
                color: '#ce1820',
            }
            node.label = {
                position: 'inside',
                color: "#fff",
                show: true,
                fontSize: 12
            }
        }
        if (node.attributes.modularity_class == 2) {
            //库
            var _len1 = node.name.length
            node.symbolSize = [_len1 * 20, 20];
            node.symbol = 'rect'
            node.itemStyle = {
                color: '#f9843e',
            }
            node.label = {
                position: 'inside',
                color: "#fff",
                show: true,
                fontSize: 12
            }
        }
        if (node.attributes.modularity_class == 3) {
            //关键词的
            var _len2 = node.name.length
            node.symbolSize = [_len2 * 15, 18];
            // node.symbolSize = 15;
            node.symbol = 'rect'
            node.itemStyle = {
                color: '#f2f2f2',
            }
            node.label = {
                position: 'inside',
                color: "#000",
                // fontWeight:'bold',
                show: true,
                fontSize: 12
            }
        }
    });
    var option = {
        title: {
            text: '',
            subtext: '',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        itemStyle: {
            background: '#fff',
        },
        animation: false,
        series: [
            {
                name: '相关资源',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                roam: true,
                cursor: 'pointer',
                label: {
                    normal: {
                        position: 'right'
                    }
                },
                force: {
                    repulsion: 1000
                }
            }
        ]
    }
    myChart.setOption(option);
    myChart.on('click', function (param) {
        console.log(param, 'param')
        if (param.data.attributes.modularity_class == 3) {
            //进行详情跳转
            window.open("/details.html?repoId=" + param.data.repodId);
        }
    });
}

$(function () {
    var level = 0; //当前层级
    $('#elevator').on('click', 'li', function () {
        var name = $(this).attr("name");
        var _disabled = $(this).attr("disabled");
        if (_disabled == 'disabled') {
            return
        }
        level = $(this).attr("level") - 4
        var top = $("#" + name).offset().top;
        $('html, body').scrollTop($("#" + name).offset().top);
        $('#elevator').find('.ui-elevator-select').removeClass('ui-elevator-select')
        $(this).addClass('ui-elevator-select');
    });
    $(window).scroll(function () {
        if (levelShows.length < 1) {
            return
        }
        var startTop = $("#level" + levelShows[level]).offset().top; //当前等级开始位置
        var endTop = startTop + $("#level" + levelShows[level]).height(); //当前等级结束位置
        var scrollTops = $(window).scrollTop(); //目前滑动位置
        if (scrollTops >= startTop && scrollTops <= endTop) { //当前刷新时
            $('#elevator').find('.ui-elevator-select').removeClass('ui-elevator-select')
            $("[name=level" + levelShows[level] + "]").addClass('ui-elevator-select')
        } else if (scrollTops > endTop) {
            if (level + 1 < levelShows.length) { //下滑时
                level = level + 1;
                $('#elevator').find('.ui-elevator-select').removeClass('ui-elevator-select')
                $("[name=level" + levelShows[level] + "]").addClass('ui-elevator-select')
            } else {
                $("[name=level" + levelShows[level] + "]").removeClass('ui-elevator-select');
            }
        } else if (scrollTops < startTop) { //上滑时
            if (level > 0) {
                level = level - 1;
                $('#elevator').find('.ui-elevator-select').removeClass('ui-elevator-select')
                $("[name=level" + levelShows[level] + "]").addClass('ui-elevator-select')
            } else {
                $("[name=level" + levelShows[level] + "]").removeClass('ui-elevator-select');
            }
        }
    });
});

$(function () {
    var width = $(window).width();
    var RightWidth = (width - $(".container").width() - 48 - 66) / 2;
    if (width > 1442) {
        $('.elevator').css('right', +RightWidth - 90 + 38 + 'px')
    } else {
        $('.elevator').css('right', '0px')
    }
})

//全部分类界面的搜索 进入普通搜索界面
$("#gotoSearchList").click(function () {
    //判断哪里点击的，进行不同的搜索页面跳转
    var searchText = $("#searchText").val()
    location.href = "/searchList.html?text=" + searchText
})
$("#searchText").keydown(function (event) {
    if (event.keyCode == 13) {
        //判断哪里点击的，进行不同的搜索页面跳转
        var searchText = $("#searchText").val()
        location.href = "/searchList.html?text=" + searchText
    }
})