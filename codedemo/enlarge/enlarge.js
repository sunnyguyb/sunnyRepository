var oImgLength=0;
var oImgIndex=0;
//定义命名空间
var rxued;
if (!rxued) rxued = {};
//页面布局
rxued.mainlayout = {
    uLower: function (a, b) {
        var allheight = $("body").eq(0).height();
        var ominHeight = allheight - a.height();
        b.css("height", ominHeight);
    }
};
rxued.scrolls={
    doScroll:function (obj,ulclass,li,prev,next,scrollsl) {
        //var cimgLength = imglength;
        var oUllist = obj.find(ulclass);
        var oLi = obj.find(li);
        //var theLength = cimgLength || oLi.length;
        var theLength =oLi.length;
        var oWidth = parseInt(oLi.eq(0).outerWidth()) +parseInt(oLi.eq(0).css("margin-left"))+parseInt(oLi.eq(0).css("margin-right"));
        oUllist.width(oWidth * theLength)
        var iNum = 0;
        var iNum = 0;
        obj.find(prev).unbind('click');
        obj.find(prev).click(function () {
            if (!oUllist.is(":animated")) {
                if (iNum == 0) {
                }
                else {
                    iNum -= scrollsl;
                    oUllist.animate({ "marginLeft": -oWidth * iNum + 'px' }, 500);
                }
            };
        });
        obj.find(next).unbind('click');
        obj.find(next).click(function () {
            if (!oUllist.is(":animated")) {
                iNum += scrollsl;
                if (iNum >= theLength) {
                    oUllist.animate({ "marginLeft": 0 + 'px' }, 500);
                    iNum = 0;
                }
                if (theLength - iNum < scrollsl) {
                    oUllist.animate({ "marginLeft": -oWidth * (theLength - scrollsl) + 'px' }, 500);
                }
                else {
                    oUllist.animate({ "marginLeft": -oWidth * iNum + 'px' }, 500);
                }
            }
        });
    }
};
//tab选项卡   oNav:tab头的对象，aCon：tab内容，sEvent是事件类型
//调用例子：rxued.tab.fnTab( $('.tabNav1'), $('.tabCon1'),'cur', 'click' );    包含tab头的div， class均为tabCon1的并列tab内容
rxued.areaSwitch= {
    Tab: function (oNav, cur, aCon, sEvent, fn) {
        var aElem = oNav.children();
        aCon.hide().eq(0).show();
        aElem.each(function (index) {
            $(this).on(sEvent, function () {
                aElem.removeClass(cur);
                $(this).addClass(cur);
                aCon.hide().eq(index).show();
                if (typeof (fn) == "function") {
                    fn();
                }
            });
        });
    },
    step: function (mainstepid, initStep, speed, animate, scrollTop, istab) {
        //mainstepid:步骤块的id，initStep：第几步，speed:速度，animate：是否动画，scrollTop：是否存在向上滚动，istab是否可以选项卡似的点击li
        //调用例子：rxued.areaSwitch.step("step1",curstep,500,true,true,true);
        var size = mainstepid.find(".step-header li").length;
        mainstepid.find(".step-header li").width(100 / size + "%");
        var curPage = parseInt(initStep);
        var barWidth = curPage < size ? 100 / (2 * size) + 100 * (curPage - 1) / size : 100;
        mainstepid.find(".stepCon").hide().eq(curPage - 1).show();
        $(".step-active").removeClass("step-active");
        if (size < curPage) {
            curPage = size;
        }
        if (animate == false) {
            speed = 0;
        }
        mainstepid.find(".step-header li").each(function (i) {
            if (i < curPage) {
                for (var j = 0; j <= i; j++) {
                    mainstepid.find(".step-header li").eq(j).addClass("step-active");
                }
                if (scrollTop) {
                    $('html,body').animate({ scrollTop: 0 }, 'slow');
                }
            }
            if (istab == true) {
                $(this).click(function () {
                    $(".step-active").removeClass("step-active");
                    for (var j = 0; j <= i; j++) {
                        mainstepid.find(".step-header li").eq(j).addClass("step-active");
                    }
                    curPage = parseInt(i) + 1;
                    mainstepid.find(".stepCon").hide().eq(curPage - 1).show();
                    barWidth = curPage < size ? 100 / (2 * size) + 100 * (curPage - 1) / size : 100;
                    mainstepid.find(".step-bar-active").animate({
                        "width": barWidth + "%"
                    }, speed);
                });
            }
        });
        mainstepid.find(".step-bar-active").animate({
            "width": barWidth + "%"
        }, speed);
    }
}

//拖拽效果
//curid需要拖拽元素的id eg：CurImg
rxued.drag = {
    fnDrag: function (curid) {
        var odiv = document.getElementById(curid);
        odiv.onmousedown = function (ev) {
            var ev = ev || event;
            var disX = ev.clientX - odiv.offsetLeft;
            var disY = ev.clientY - odiv.offsetTop;
            document.onmousemove = function (ev) {
                var ev = ev || event;
                odiv.style.left = ev.clientX - disX + 'px';
                odiv.style.top = ev.clientY - disY + 'px';
                return false;
            }
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            }
            return false;
        }
    }
};
//图片旋转
// alertdivid为弹出层id,curid为当前展示图片的id
rxued.rotate = {
    fnRotate: function (alertdivid, curid) {
        //记录图片拖拽后移动的left和top值
        var oleft = $("#" + alertdivid + " #" + curid).css("left");
        var otop = $("#" + alertdivid + " #" + curid).css("top");
        //给#img7加一个旋转角度，度数的class
        var value2 = parseInt($("#" + alertdivid + " #" + curid).attr("class").split(" ")[1].split("_")[1]);
        $("#" + alertdivid + " #" + curid).removeClass("a_" + value2);
        //每次旋转90度
        value2 += 90;
        $("#" + alertdivid + " #" + curid).addClass("a_" + value2);
        $("#" + alertdivid + " #" + curid).rotate({ animateTo: value2 });
        //ie8下图片旋转过后，赋上拖拽后的left和top值
        $("#" + alertdivid + " #" + curid).css({ "left": oleft, "top": otop });
    }
};
//滚轮滚动缩放图片
// alertdivid为弹出层id,curid为当前展示图片的id
rxued.zoom = {
    fnZoom: function (alertdivid, curid) {
        var count = 0;
        var newheight=0;
        $("#" + alertdivid).unbind("mousewheel").bind("mousewheel",function (event, delta, deltaX, deltaY) {
            count++;
            var height = $("#" + alertdivid + " #" + curid).height();   //get initial height
            var width = $("#" + alertdivid + " #" + curid).width();     // get initial width
            //get the percentange of height / width
            var stepex = height / width;
            // min height
            var minHeight = 150;
            var tempStep = 80;    // evey step for scroll down or upx
            if (delta == 1) {  //up
                if(newheight!=0&&parseFloat(newheight-height)>5)
                {
                    count=1;
                }
                $("#" + alertdivid + " #" + curid).css("height", parseInt(height) + count * tempStep);
                $("#" + alertdivid + " #" + curid).css("width", parseInt(width) + count * tempStep / stepex);
                $("#" + alertdivid + " #" + curid).find(".rvml").css("height", parseInt(height) + count * tempStep);
                $("#" + alertdivid + " #" + curid).find(".rvml").css("width", parseInt(width) + count * tempStep / stepex);
                //console.log(height)
            }
            else if (delta == -1) { //down
                if (height > minHeight) {
                    $("#" + alertdivid + " #" + curid).css("height", height - count * tempStep);
                    $("#" + alertdivid + " #" + curid).find(".rvml").css("height", height - count * tempStep);
                }
                else {
                    $("#" + alertdivid + " #" + curid).css("height", minHeight);
                    $("#" + alertdivid + " #" + curid).find(".rvml").css("height", minHeight);
                }
                if (width > minHeight / stepex) {
                    $("#" + alertdivid + " #" + curid).css("width", width - count * tempStep / stepex);
                    $("#" + alertdivid + " #" + curid).find(".rvml").css("width", width - count * tempStep / stepex);
                }
                else {
                    $("#" + alertdivid + " #" + curid).css("width", minHeight / stepex);
                    $("#" + alertdivid + " #" + curid).find(".rvml").css("width", minHeight / stepex);
                }
            }
            height = $("#" + alertdivid + " #" + curid).height();
            width = $("#" + alertdivid + " #" + curid).width();
            // alert("缩放后的宽高"+width+"~"+height)
            var hafwidth = width / 2;
            var hafheight = height / 2;
            $("#" + alertdivid + " .preview-picBox").css({ "left": "50%", "top": "50%", "margin-left": "-" + hafwidth + "px", "margin-top": "-" + hafheight + "px" });
            event.preventDefault();
            count = 0;
            newheight=height;
            newwidth=width;
        })
    }
}

var winW = $(window).width() + "px";
var winH = $(window).height() + "px";
//图片放大
rxued.images = {
    //图片水平、垂直居中显示
    // alertdivid为弹出层id,curid为当前展示图片的id
    HorVertiCenter: function (alertdivid, curid) {

        var winH = $(window).height();
        var winW = $(window).width();
        var naturalWidth = $("#" + alertdivid + " #" + curid).width();

        var naturalHeight = $("#" + alertdivid + " #" + curid).height();

        $("#" + alertdivid + " .preview-picBox").css({
            left: "50%",
            top: "50%",
            marginLeft: -1 / 2 * naturalWidth + "px",
            marginTop: -1 / 2 * naturalHeight + "px"
        });
        if (winH <= naturalHeight) {
            //var _naturalHeight = naturalHeight * .3;
            var _naturalHeight = winH;
            var _naturalWidth = naturalWidth / (naturalHeight / winH);
            console.log(naturalHeight);
            console.log(_naturalHeight);
            $("#" + alertdivid + " .preview-picBox").css({
                left: "50%",
                top: "50%",
                marginLeft: -1 / 2 * _naturalWidth + "px",
                marginTop: -1 / 2 * _naturalHeight + "px"
            });

            $("#" + alertdivid + " .preview-picBox img").css({
                height: _naturalHeight,
                width:"auto"
            })
        }
        //if (winW <= naturalWidth) {
        //    //var _naturalWidth = naturalWidth * .3;
        //    var _naturalWidth = winW;
        //    var _naturalHeight = naturalHeight / (naturalWidth / winW);
        //    $("#" + alertdivid + " .preview-picBox").css({
        //        left: "50%",
        //        top: "50%",
        //        marginLeft: -1 / 2 * _naturalWidth + "px",
        //        marginTop: -1 / 2 * _naturalHeight + "px"
        //    });

        //    $("#" + alertdivid + " .preview-picBox img").css({
        //        width: _naturalWidth,
        //        height: "auto"
        //    })
        //}
    },
    //1:1点击
    oneToone: function (alertdivid, curid) {
        $("#" + alertdivid + " .previewOrigin").unbind("click").bind("click", function () {

            //获取当前显示图片初始宽高
            var width = $("#" + curid).attr("data-curimg-width");
            var height = $("#" + curid).attr("data-curimg-height");
            $("#" + curid).css({ "width": width, "height": height });
            //ie8里面旋转过后id为#img7的img转换为#img7的span标签，并且span里面包含class=“rvml”的标签(ie8下给.rvml赋值不成功)
            $("#" + curid).find(".rvml").css({ "width": width + "px", "height": height });
            $("#" + alertdivid + " .preview-picBox").css({
                left: "50%",
                top: "50%",
                marginLeft: -1 / 2 * width + "px",
                marginTop: -1 / 2 * height + "px"
            });
            $("#" + alertdivid + " #" + curid).css({ "left": 0, "top": 0 });
        });
    },
    //点击旋转按钮事件
    // alertdivid为弹出层id,curid为当前展示图片的id
    rotateBtnClick: function (alertdivid, curid) {
        //点击旋转按钮，旋转图片
        $("#" + alertdivid + " .previewRotate").unbind("click").bind("click",function(){
            //获取旋转前当前显示图片初始宽高，旋转后ie8中标签发生变化，所以需要在旋转前提前获取图片初始宽高
            var width = $("#" + curid).attr("data-curimg-width");
            var height = $("#" + curid).attr("data-curimg-height");
            rxued.rotate.fnRotate(alertdivid, curid);
            //rxued.images.HorVertiCenter(alertdivid,curid);
            //给ie8中旋转后的当前显示的标签赋值
            $("#" + curid).attr("data-curimg-width", width);
            $("#" + curid).attr("data-curimg-height", height);
            rxued.drag.fnDrag(curid);
            rxued.zoom.fnZoom(alertdivid, curid);
        });
    },
    closeImgAlert: function (alertdivid) {
        //点击关闭按钮，关闭弹出层
        // alertdivid为弹出层id,curid为当前展示图片的id
        $(document).on("click", "#" + alertdivid + " .preview-close", function () {
            $("#" + alertdivid).hide(0, function () {
                $(this).remove();
            });
            //一组图片中会用到以下两个参数
            oImgIndex = 0;
            oImgLength = 0;
        });
    },
    //enSingleLarge单个图片放大
    //clickelement：要点击放大的小图
    // alertdivid为弹出层id,curid为当前展示图片的id
    enSingleLarge: function (thisclass,alertdivid, curid) {
        //点击小图弹出大图（单个图片显示） a_0记录旋转角度
        //  clickelement.click(function () {
        $("#" + alertdivid).remove();
        $("body").append('<div class="preview" id="' + alertdivid + '" style="display: none;">' +
            '<div class="preview-mask" id="previewMask"></div>' +
            '<div  id="previewDiv" class="preview-cursor-move">' +
            '<div class="preview-picBox">' +
            '</div>' +
            '</div>' +
            '<a class="preview-close" data-func="close" hidefocus="true" href="javascript:void(0);" title="关闭(esc)">' +
            '<b class="preview-icon preview-icon-close"></b>' +
            '</a>' +
            '<div class="preview-toolbar-wrapper">' +
            '<div class="preview-toolbar preview-toolbar-trans" id="previewToolbar" style="width: 270px;">' +
            '<div class="preview-toolbar-bg"></div>' +
            '<p class="preview-toolbar-picName previewName" id="previewName" style="width: 246px;"></p>' +
            '<div class="preview-toolbar-tools"  id="previewToolbarTools">' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item preview-toolbar-tools-item-dis previewPrev" id="previewPrev">' +
            '<b class="preview-icon preview-icon-pre"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item previewNext" id="previewNext">' +
            '<b class="preview-icon preview-icon-next"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" style="display: block;" class="preview-toolbar-tools-item previewOrigin" id="previewOrigin">' +
            '<b class="preview-icon preview-icon-origin"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item previewRotate" id="previewRotate">' +
            '<b class="preview-icon preview-icon-refresh"></b>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        var obigImgSrc = $(thisclass).attr("data-src");
        var obigImgName = $(thisclass).attr("data-imgname");
        $("#" + alertdivid + " .preview-picBox").append("<img src='" + obigImgSrc + "'  class='preview-picBox-pic a_0' id='" + curid + "'>");
        $("#" + alertdivid + " .previewName").text(obigImgName);
        $("#" + alertdivid + " .previewPrev," + "#" + alertdivid + " .previewNext").hide();
        $("#" + alertdivid).show(0, function () {
            if (typeof ($(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width")) == "undefined") {
                $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width", $(".preview-picBox-pic").eq(oImgIndex).width());
                $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-height", $(".preview-picBox-pic").eq(oImgIndex).height());
            }
//          	$(".preview-picBox-pic").attr("data-curimg-width", $(".preview-picBox-pic").width());
//              $(".preview-picBox-pic").attr("data-curimg-height", $(".preview-picBox-pic").height());
            rxued.images.HorVertiCenter(alertdivid, curid);
            rxued.drag.fnDrag(curid);
            rxued.zoom.fnZoom(alertdivid, curid);

            //记录第一张初始宽高，1:1时使用
            //判断当前显示图片是否含有自定义属性，目的是获取图片原始宽高
//              if (typeof ($(".preview-picBox-pic").attr("data-curimg-width")) == "undefined") {
//
//              }
        });
        // });
    },
    //enGroupLarge 一组图片放大
    // alertdivid为弹出层id,curid为当前展示图片的id
    enGroupLarge: function (clickelement, alertdivid, curid) {
        //点击小图弹出大图（一组图片显示） a_0记录旋转角度
        var oImgLength = 0;
        var oImgIndex = 0;
        var obigImgName;
        // clickelement.click(function () {
        $("#" + alertdivid).remove();
        $("body").append('<div class="preview" id="' + alertdivid + '" style="display: none;">' +
            '<div class="preview-mask" id="previewMask"></div>' +
            '<div  id="previewDiv" class="preview-cursor-move">' +
            '<div class="preview-picBox">' +
            '</div>' +
            '</div>' +
            '<a class="preview-close" data-func="close" hidefocus="true" href="javascript:void(0);" title="关闭(esc)">' +
            '<b class="preview-icon preview-icon-close"></b>' +
            '</a>' +
            '<div class="preview-toolbar-wrapper">' +
            '<div class="preview-toolbar preview-toolbar-trans" id="previewToolbar" style="width: 270px;">' +
            '<div class="preview-toolbar-bg"></div>' +
            '<p class="preview-toolbar-picName previewName" id="previewName" style="width: 246px;"></p>' +
            '<div class="preview-toolbar-tools"  id="previewToolbarTools">' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item preview-toolbar-tools-item-dis previewPrev" id="previewPrev">' +
            '<b class="preview-icon preview-icon-pre"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item previewNext" id="previewNext">' +
            '<b class="preview-icon preview-icon-next"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" style="display: block;" class="preview-toolbar-tools-item previewOrigin" id="previewOrigin">' +
            '<b class="preview-icon preview-icon-origin"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item previewRotate" id="previewRotate">' +
            '<b class="preview-icon preview-icon-refresh"></b>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        var obigImgSrc = $(clickelement).attr("data-src").split(";");
        obigImgName = $(clickelement).attr("data-imgname").split(";");
        oImgLength = obigImgSrc.length;
        for (var i = 0; i < oImgLength; i++) {
            $("#" + alertdivid + " .preview-picBox").append("<img src='" + obigImgSrc[i] + "'  class='preview-picBox-pic a_0' style='display:none'>");
            $("#" + alertdivid + " .preview-picBox-pic").eq(i).attr("data-name", obigImgName[i]);
        }

        $("#" + alertdivid + " .previewName").text(obigImgName[0]);
        $("#" + alertdivid + " .previewPrev," + "#" + alertdivid + " .previewNext").show();
        $("#" + alertdivid).show(0, function () {
            $("#" + alertdivid + " .preview-picBox").find("img:eq(0)").attr("id", curid).show();
            $(".preview-picBox-pic:eq(0)").load(function(){
                $(".preview-picBox-pic:eq(0)").attr("data-curimg-width", $(".preview-picBox-pic:eq(0)").width());
                $(".preview-picBox-pic:eq(0)").attr("data-curimg-height", $(".preview-picBox-pic:eq(0)").height());
                rxued.images.HorVertiCenter(alertdivid, curid);
                rxued.drag.fnDrag(curid);
                rxued.zoom.fnZoom(alertdivid, curid);
            });
        });
        // });
        //点击下一张按钮
        $(document).on("click", "#" + alertdivid + " .previewNext", function () {
            if (oImgIndex < oImgLength - 1) {
                oImgIndex++;
                $("#" + alertdivid + " .previewPrev").removeClass("preview-toolbar-tools-item-dis");
                $("#" + alertdivid + " .preview-picBox").find(".preview-picBox-pic").removeAttr("id", curid).hide();
                $("#" + alertdivid + " .preview-picBox").find(".preview-picBox-pic").eq(oImgIndex).attr("id", curid).show(0, function () {
                    if (typeof ($(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width")) == "undefined") {
                        $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width", $(".preview-picBox-pic").eq(oImgIndex).width());
                        $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-height", $(".preview-picBox-pic").eq(oImgIndex).height());
                    }
                    rxued.images.HorVertiCenter(alertdivid, curid);
                    rxued.drag.fnDrag(curid);
                    rxued.zoom.fnZoom(alertdivid, curid);

                });
                $("#" + alertdivid + " .previewName").text(obigImgName[oImgIndex]);
                if (oImgIndex == oImgLength - 1) {
                    $(this).addClass("preview-toolbar-tools-item-dis");
                    return false;
                }
            }
        });
        //点击上一张按钮
        $(document).on("click", "#" + alertdivid + " .previewPrev", function () {
            if (oImgIndex > 0) {
                oImgIndex--;
                $("#" + alertdivid + " .previewNext").removeClass("preview-toolbar-tools-item-dis");
                $("#" + alertdivid + " .preview-picBox").find(".preview-picBox-pic").removeAttr("id", curid).hide();
                $("#" + alertdivid + " .preview-picBox").find(".preview-picBox-pic").eq(oImgIndex).attr("id", curid).show(0, function () {
                    if (typeof ($(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width")) == "undefined") {
                        $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width", $(".preview-picBox-pic").eq(oImgIndex).width());
                        $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-height", $(".preview-picBox-pic").eq(oImgIndex).height());
                    }
                    rxued.images.HorVertiCenter(alertdivid, curid);
                    rxued.drag.fnDrag(curid);
                    rxued.zoom.fnZoom(alertdivid, curid);
                });
                $("#" + alertdivid + " .previewName").text(obigImgName[oImgIndex]);
                if (oImgIndex == 0) {
                    $(this).addClass("preview-toolbar-tools-item-dis");
                    return false;
                }
            }
        });

    },
    //clickelement:按钮，alertdivid：图片放大弹出层div的id，curid：当前放大图片的id,thisindex:当前点击元素的索引值，msgvalue：含有自定义属性data-msg的值，elem:含有自定义属性data-msg的标签
    morePicLarge: function (clickelement, alertdivid, curid,thisindex,msgvalue,elem) {
        var thisIndex = 0;
        var picLength = 0;
        // clickelement.click(function () {
        thisIndex = thisindex;
        $("#"+alertdivid).remove();
        $("body").append('<div class="preview" id="' + alertdivid + '" style="display: none;">' +
            '<div class="preview-mask" id="previewMask"></div>' +
            '<div  id="previewDiv" class="preview-cursor-move">' +
            '<div class="preview-picBox">' +
            '</div>' +
            '</div>' +
            '<a class="preview-close" data-func="close" hidefocus="true" href="javascript:void(0);" title="关闭(esc)">' +
            '<b class="preview-icon preview-icon-close"></b>' +
            '</a>' +
            '<div class="preview-toolbar-wrapper">' +
            '<div class="preview-toolbar preview-toolbar-trans" id="previewToolbar" style="width: 270px;">' +
            '<div class="preview-toolbar-bg"></div>' +
            '<p class="preview-toolbar-picName previewName" id="previewName" style="width: 246px;"></p>' +
            '<div class="preview-toolbar-tools"  id="previewToolbarTools">' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item preview-toolbar-tools-item-dis previewPrev" id="previewPrev">' +
            '<b class="preview-icon preview-icon-pre"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item previewNext" id="previewNext">' +
            '<b class="preview-icon preview-icon-next"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" style="display: block;" class="preview-toolbar-tools-item previewOrigin" id="previewOrigin">' +
            '<b class="preview-icon preview-icon-origin"></b>' +
            '</a>' +
            '<a href="javascript:void(0);" class="preview-toolbar-tools-item previewRotate" id="previewRotate">' +
            '<b class="preview-icon preview-icon-refresh"></b>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        $(elem+'[data-msg='+msgvalue+']').each(function (i) {
            $("#"+alertdivid+" .preview-picBox").append("<img src='"+$(this).attr("data-src")+"'  class='preview-picBox-pic a_0' data-name='"+$(this).attr("data-imgname")+"' style='display:none'>");
        });
        picLength = $("#" + alertdivid).find(".preview-picBox-pic").length;
        $("#" + alertdivid + " .preview-picBox").find("img").eq(thisIndex).attr("id", curid).show();
        $("#" + alertdivid + " .previewName").text($(clickelement).attr("data-imgname"));
        $("#" + alertdivid + " .previewPrev," + "#" + alertdivid + " .previewNext").show();
        $("#" + alertdivid).show(0, function () {
            if (thisIndex != 0) {
                if (thisIndex == picLength - 1) {
                    $("#" + alertdivid + " .previewPrev").removeClass("preview-toolbar-tools-item-dis");
                    $("#" + alertdivid + " .previewNext").addClass("preview-toolbar-tools-item-dis");
                }
                else {
                    $("#" + alertdivid + " .previewPrev").removeClass("preview-toolbar-tools-item-dis");
                }
            }
            $(".preview-picBox-pic").eq(thisIndex).attr("data-curimg-width", $(".preview-picBox-pic").eq(thisIndex).width());
            $(".preview-picBox-pic").eq(thisIndex).attr("data-curimg-height", $(".preview-picBox-pic").eq(thisIndex).height());
            rxued.images.HorVertiCenter(alertdivid, curid);
            rxued.drag.fnDrag(curid);
            rxued.zoom.fnZoom(alertdivid, curid);
        });
        // });
        //点击下一张按钮
        $(document).on("click", "#" + alertdivid + " .previewNext", function () {
            if (thisIndex < picLength - 1) {
                thisIndex++;
                $("#" + alertdivid + " .previewPrev").removeClass("preview-toolbar-tools-item-dis");
                $("#" + alertdivid + " .preview-picBox").find(".preview-picBox-pic").removeAttr("id", curid).hide();
                $("#" + alertdivid + " .preview-picBox").find(".preview-picBox-pic").eq(thisIndex).attr("id", curid).show(0, function () {
                    if (typeof ($(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width")) == "undefined") {
                        $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width", $(".preview-picBox-pic").eq(oImgIndex).width());
                        $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-height", $(".preview-picBox-pic").eq(oImgIndex).height());
                    }
                    rxued.images.HorVertiCenter(alertdivid, curid);
                    rxued.drag.fnDrag(curid);
                    rxued.zoom.fnZoom(alertdivid, curid);
                });
                $("#" + alertdivid + " .previewName").text($("#" + curid).attr("data-name"));
                if (thisIndex == picLength - 1) {
                    $(this).addClass("preview-toolbar-tools-item-dis");
                    return false;
                }
            }
        });
        //点击上一张按钮
        $(document).on("click", "#" + alertdivid + " .previewPrev", function () {
            if (thisIndex > 0) {
                thisIndex--;
                $("#" + alertdivid + " .previewNext").removeClass("preview-toolbar-tools-item-dis");
                $("#" + alertdivid + " .preview-picBox").find(".preview-picBox-pic").removeAttr("id", curid).hide();
                $("#" + alertdivid + " .preview-picBox").find(".preview-picBox-pic").eq(thisIndex).attr("id", curid).show(0, function () {
                    if (typeof ($(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width")) == "undefined") {
                        $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-width", $(".preview-picBox-pic").eq(oImgIndex).width());
                        $(".preview-picBox-pic").eq(oImgIndex).attr("data-curimg-height", $(".preview-picBox-pic").eq(oImgIndex).height());
                    }
                    rxued.images.HorVertiCenter(alertdivid, curid);
                    rxued.drag.fnDrag(curid);
                    rxued.zoom.fnZoom(alertdivid, curid);
                });
                $("#" + alertdivid + " .previewName").text($("#" + curid).attr("data-name"));
                if (thisIndex == 0) {
                    $(this).addClass("preview-toolbar-tools-item-dis");
                    return false;
                }
            }
        });


    }

};

//弹出框
rxued.alert={
    judgeH: function (maindiv,chaClass,resultObj, maxH) {
        var aHeight = 0;
        var ReductionBox = chaClass; //所有需要减去高度的元素加上CLASS："j_alertHeight"
        for (var i = 0; i < ReductionBox.length; i++) {
            aHeight += ReductionBox.eq(i).outerHeight();
        }
        var ResultHeight = maindiv.eq(0).outerHeight() - parseInt(aHeight);

        var maxHs = maxH;
        ResultHeight = (ResultHeight > maxHs) ? maxHs : ResultHeight;


        resultObj.css('max-height', ResultHeight);
    },
    // 插入页面里的弹出层
    //obj：弹出层class或id，width:弹出层宽度
    //rxued.alert.jAlert(".alertBox",800);
    jAlert:function(obj,width,fn){
        $(obj).show(0, function () {
            $(this).css({
                marginLeft: -width / 2,
                marginTop: -parseInt($(this).outerHeight()) / 2,
                width: width,
                height: "auto"
            });
            if (typeof (fn) == "function") {
                fn();
            }
        });
        $(".alertMask").show();
        $(".alertBox").find(".close").click(function () {
            $(".alertBox").hide();
            $(".alertMask").hide();
        });
    },
    tips:function(obj,options){
        //tips提示信息  obj:点击或者鼠标放上class
        // content：提示内容
        var opts=options||{};
        $(obj).on(opts.oEvent,function(){
            var _this=$(this).index();
            var dataPos=$(this).attr("data-pos");
            var popover='<div class="popover">'+opts.content+'<em class="pop_icon">'+'</em>'+'</div>';
            var thisData=$(this).attr('data-pos');
            var ht='popover'+thisData.substring(0,1);
            $('.popover').remove();
            $("body").append(popover);
            switch(dataPos){
                case 'left':
                    if(popover){
                        $(".popover").css({
                            top:$(obj).offset().top,
                            left:-($(".popover").outerWidth()-$(obj).offset().left)-12
                        }).addClass(ht);
                        $(".popover em.pop_icon").addClass("pop_icon_l");
                        var arrowl=($(".popover").height()-$(obj).find(".pop_icon_l").outerHeight())/2;
                        $("em.pop_icon_l").css({top:arrowl});
                    }
                    break;
                case 'right':
                    if(popover){
                        $(".popover").css({
                            top:-($(".popover").outerHeight()-$(this).outerHeight())/2+$(this).offset().top,
                            left:(Math.abs($(this).offset().left+$(this).outerWidth()))+12
                        }).addClass(ht);
                        $(".popover em.pop_icon").addClass("pop_icon_r");
                        var arrowr=($(".popover").outerHeight()-$(".pop_icon_r").outerHeight())/2;
                        $("em.pop_icon_r").css({ top:arrowr });
                    }
                    break;
                case 'top':
                    if(popover){
                        $(".popover").css({
                            top:-($(".popover").outerHeight()+12-$(this).offset().top),
                            left:$(this).offset().left+($(this).outerWidth()-$(".popover").outerWidth())/2
                        }).addClass(ht);
                        $(".popover em.pop_icon").addClass("pop_icon_t");
                        var arrowtt=$(".popover").outerHeight()-2;
                        var arrowtl=(Math.abs($(".popover").outerWidth()-$(".pop_icon_t").outerWidth())/2);
                        $("em.pop_icon_t").css({top:arrowtt,left:arrowtl});
                    }
                    break;
                case 'bottom':
                    if(popover){
                        $(".popover").css({
                            top:($(this).outerHeight()+12+$(this).position().top), left:$(this).position().left+($(this).outerWidth()-$(".popover").outerWidth())/2
                        }).addClass(ht);
                        $(".popover em.pop_icon").addClass("pop_icon_b");
                        var arrowbt=-$(".pop_icon_b").outerHeight();
                        var arrowbl=(Math.abs($(".popover").outerWidth()-$(".pop_icon_b").outerWidth())/2);
                        $("em.pop_icon_b").css({ top:arrowbt, left:arrowbl });
                    }
                    break;
            }
        });
        //鼠标离开 1秒钟后隐藏
        function hidetTips(){
            $(obj).mouseout(function(){
                var thisData=$(this).attr('data-pos');
                var ht='.popover'+thisData.substring(0,1);
                $(ht).stop(true,true).delay(1000).animate({opacity:'0'},300,function(){
                    $(this).remove();
                });
            });
        }
        hidetTips();
        if(opts.oEvent=="mouseover"){
            hidetTips();
        }
    }

};
//阻止事件冒泡
function stopEventBubble(event){
    var e=event || window.event;
    if (e && e.stopPropagation){
        e.stopPropagation();
    }
    else{
        e.cancelBubble=true;
    }
}
rxued.check = {
    //全选功能：obj1-全选的复选框，objs-被操作的所有复选框，isRever-是否有反选功能，obj3-反选按钮
    allCheck: function (obj1, objs, isRever, obj3) {
        obj1.click(function () {
            $(this).prop("checked") == true ? objs.prop("checked", true) : objs.prop("checked", false);
        });
        objs.click(function (e) {
            objs.length == objs.filter(":checked").length ? obj1.prop("checked", true) : obj1.prop("checked", false);
            e.stopPropagation();
        });
        if (isRever == true) {
            rxued.check.ReverseCheck(obj3, objs, obj1);
        }
    },
    //反选功能
    ReverseCheck: function (obj3, objs, obj1) {
        obj3.click(function () {
            objs.length == objs.not(":checked").length ? obj1.prop("checked", true) : obj1.prop("checked", false);
            objs.each(function () {
                $(this).prop("checked", !$(this).prop("checked"))
            })
        })
    }
};


//遮罩层
rxued.layer = {
    maskShow2: function (obj1, obj2) {
        obj1.show();
        if (obj2 != null) {
            obj2.show();
        }
    },
    maskShow3: function (obj1, obj2, obj3) {
        obj1.show();
        obj2.show();
        if (obj3 != null) {
            obj3.show();
        }
    },
    maskHide2: function (obj1, obj2) {
        obj1.hide();
        if (obj2 != null) {
            obj2.hide();
        }
    },
    maskHide3: function (obj1, obj2, obj3) {
        obj1.hide();
        obj2.hide();
        if (obj3 != null) {
            obj3.hide();
        }
    },
    //遮罩层的宽度跟某元素的宽度相同
    tolayerWidth: function (obj, baseObj) {
        obj.css("width", baseObj.width());
    },
    tolayerWH: function (obj, baseObjW, baseObjH) {
        obj.css({ "width": baseObjW.width(), "height": baseObjH.scrollHeight });
    }
}

//cookie
rxued.cookie = {
    getCookie: function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]); return null;
    },
    setCookie: function (name, value, expires, path, domain, secure) {
        document.cookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + expires.toGMTString() : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
    },
    deleteCookie: function (name) {
        var delexpdate = new Date();
        delexpdate.setTime(delexpdate.getTime() - 1);
        setCookie(name, "", delexpdate);
    }

};

//判断浏览器
rxued.Browser = {
    getBrowserInfo: function () {
        var agent = navigator.userAgent.toLowerCase();
        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi;
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        //IE
        if (agent.indexOf("msie") > 0) {
            return agent.match(regStr_ie);
        }
        //firefox
        if (agent.indexOf("firefox") > 0) {
            return agent.match(regStr_ff);
        }
        //Chrome
        if (agent.indexOf("chrome") > 0) {
            return agent.match(regStr_chrome);
        }
        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            return agent.match(regStr_saf);
        }
    }

}










