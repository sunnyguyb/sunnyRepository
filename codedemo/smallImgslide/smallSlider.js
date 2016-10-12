; $(function ($, window, document, undefined) {

    /*一张大图轮播*/
    Slider = function (container, options) {
        /*
         options = {
         auto: true,
         time: 3000,
         event: 'hover' | 'click',
         mode: 'slide | fade',
         controller: $(),
         activeControllerCls: 'className',
         exchangeEnd: $.noop
         }
         */

        "use strict"; //stirct mode not support by IE9-

        if (!container) return;

        var options = options || {},
            currentIndex = 0,
            cls = options.activeControllerCls,
            delay = options.delay,
            isAuto = options.auto,
            controller = options.controller,
            event = options.event,
            interval,
            slidesWrapper = container.children().first(),
            slides = slidesWrapper.children(),
            length = slides.length,
            childWidth = container.width(),
            totalWidth = childWidth * slides.length;

        function init() {
            var controlItem = controller.children();

            mode();

            event == 'hover' ? controlItem.mouseover(function () {
                stop();
                var index = $(this).index();

                play(index, options.mode);
            }).mouseout(function () {
                isAuto && autoPlay();
            }) : controlItem.click(function () {
                stop();
                var index = $(this).index();

                play(index, options.mode);
                isAuto && autoPlay();
            });

            isAuto && autoPlay();
        }

        //animate mode
        function mode() {
            var wrapper = container.children().first();

            options.mode == 'slide' ? wrapper.width(totalWidth) : wrapper.children().css({
                'position': 'absolute',
                'left': 0,
                'top': 0
            })
                .first().siblings().hide();
        }

        //auto play
        function autoPlay() {
            interval = setInterval(function () {
                triggerPlay(currentIndex);
            }, options.time);
        }

        //trigger play
        function triggerPlay(cIndex) {
            var index;
            (cIndex == length - 1) ? index = 0 : index = cIndex + 1;
            play(index, options.mode);
        }

        //play
        function play(index, mode) {
            slidesWrapper.stop(true, true);
            slides.stop(true, true);

            mode == 'slide' ? (function () {
                if (index > currentIndex) {
                    slidesWrapper.animate({
                        left: '-=' + Math.abs(index - currentIndex) * childWidth + 'px'
                    }, delay);
                } else if (index < currentIndex) {
                    slidesWrapper.animate({
                        left: '+=' + Math.abs(index - currentIndex) * childWidth + 'px'
                    }, delay);
                } else {
                    return;
                }
            })() : (function () {
                if (slidesWrapper.children(':visible').index() == index) return;
                slidesWrapper.children().fadeOut(delay).eq(index).fadeIn(delay);
            })();

            try {
                controller.children('.' + cls).removeClass(cls);
                controller.children().eq(index).addClass(cls);
            } catch (e) { }

            currentIndex = index;

            options.exchangeEnd && typeof options.exchangeEnd == 'function' && options.exchangeEnd.call(this, currentIndex);
        }

        //stop
        function stop() {
            clearInterval(interval);
        }

        //prev frame
        function prev() {
            stop();

            currentIndex == 0 ? triggerPlay(length - 2) : triggerPlay(currentIndex - 2);

            isAuto && autoPlay();
        }

        //next frame
        function next() {
            stop();

            currentIndex == length - 1 ? triggerPlay(-1) : triggerPlay(currentIndex);

            isAuto && autoPlay();
        }

        //init
        init();

        //expose the Slider API
        return {
            prev: function () {
                prev();
            },
            next: function () {
                next();
            }
        }
    };

    /*选项卡*/
    tab=function(options){
        var defaults={
            liCur:"liCur",
            liClass:"li",
            boxClass:"select"
        };
        var opts=$.extend(defaults,options);
        $(opts.liClass).each(function(index){
            var _this=this;
            $(_this).click(function(){
                $(_this).addClass(opts.liCur).siblings().removeClass(opts.liCur);
                $(opts.boxClass).eq(index).show();
                $(opts.boxClass).eq(index).siblings().hide();
            })
        });
    };
    /*内容翻页*/
    turnPage= function (container,options) {
        var defaults={
            //nextPage:"nextPage",
            //lastPage:"lastPage",
            //ulBox:"listInfo",//高度为288的div
            //ulH:"listBox"//包含li，用margin-top来控制显示的div
        };
        if (!container) return;
        var options = options || {},
            step=0,
            event = options.event,
            ulBox=container.children().first(),
            ulH=ulBox.children(),
            boxH=ulBox.height(),//外面显示区域的高度
            contentH=ulH.height();//内容的总高度
        cont=Math.floor(contentH/boxH);
        function next(){
            var _that=container;
            cont=Math.floor(contentH/boxH);
            if(cont>1){
                step++;
                _that.find(ulH).stop().animate({"margin-top":-boxH*step},300);
                var lastH=contentH-boxH;//最后一步上移的高度
                var olastH="-"+lastH;
                //console.log(olastH);
                if(contentH<boxH*(step+1)){
                    step=cont;
                    _that.find(ulH).stop().animate({"margin-top":olastH},300);
                }
            }else if(cont<=1){
                _that.find(ulH).css({"margin-top":0});
            }
        }
        var i=0;
        function last(){
            var _that=container;
            cont--;
            i++;
            if (cont < 1) {
                step = 0;
                i = 0;
                cont=0;
                _that.find(ulH).css({ "margin-top": 0 });
            }else{
                _that.find(ulH).stop().animate({"margin-top":-contentH + (i + 1) * boxH},300);
            }
        }
        return {
            next:function(){
                next();
            },
            last:function(){
                last();
            }
        }
    };

    /*选项卡里的轮播图*/
    tabSlider=function(container,options){
        "use strict";
        if(!container) return;
        var options=options||{},
            cls = options.activeControllerCls,//选项卡选中的样式
            controller = options.controller,//选项卡的div
            event = options.event,
            sliderTab = container.prev().children(),
            tabLis = sliderTab.children(),//选项卡的切换按钮
            wrapper = container.children(),//需要移动的div
            slidesWrapper = wrapper.children(),//每一块的ul
            slides=slidesWrapper.children().children(),
            length = slides.length,
            childWidth = container.width(),
            step= 0,
            totalWidth = childWidth * slides.length;
        wrapper.css({width:totalWidth});
        //  console.log(childWidth);
        smallImg(); //点击缩略图，对应相应的图片
        function smallImg(){
            slidesWrapper.each(function(aIndex){
                var oLiLen=$(this).children().children().length;
                $(this).css({width:oLiLen*childWidth});
                tabLis.eq(aIndex).click(function(){
                    step=0;
                    for(var i=0;i<aIndex;i++){
                        step += slidesWrapper.eq(aIndex-1).children().children().length;
                    }
                    //console.log(aIndex);
                    wrapper.stop().animate({"margin-left":-childWidth*step});
                    $(this).addClass(cls).siblings().removeClass(cls);
                });

                $(this).children().children().addClass("aliCur");
            });
        }
        //点击左右按钮切到相应的选项
        function aStyle(){
            var curCollect=wrapper.find(".aliCur").eq(step).parent().attr("data-count");
            $(tabLis).each(function(){
                var aIndex=$(this).attr("data-index");
                if(aIndex==curCollect){
                    $(this).addClass(cls).siblings().removeClass(cls);
                }
            })
        }
        //下一张
        function next(){
            smallImg();
            step++;
            $(wrapper).stop().animate({"margin-left":-childWidth*step});
            aStyle();
            if(step>=length-1){
                $(wrapper).stop().animate({"margin-left":-childWidth*(length-1)},300);
                step=length-1;
            }
        }
        //上一张
        function prev(){
            smallImg();
            step--;
            $(wrapper).stop().animate({"margin-left":-childWidth*step});
            if(step<=0){
                $(wrapper).stop().animate({"margin-left":0},300);
                step=0;
            }
            aStyle();
        }
        return {
            prev: function () {
                prev();
            },
            next: function () {
                next();
            }
        }
    };
    slide=function(container,options){
        "use strict";
        if (!container) return;
        var options = options || {},
            step = 0,
            event = options.event,
            slidesWrapper = container.children().first(),//需要移动位置的ul
            slides = slidesWrapper.children(),//所有的li
            length = slides.length,
            childWidth = container.width(),
            totalWidth = childWidth * slides.length;
        slidesWrapper.css({width:totalWidth});
        function next(){
            step++;
            $(slidesWrapper).stop().animate({"margin-left":-childWidth*step});
            if(step>=length-1){
                $(slidesWrapper).stop().animate({"margin-left":-childWidth*(length-1)},300);
                step=length-1;
            }
        }
        //上一张
        function prev(){
            step--;
            $(slidesWrapper).stop().animate({"margin-left":-childWidth*step});
            if(step<=0){
                $(slidesWrapper).stop().animate({"margin-left":0},300);
                step=0;
            }
        }
        return {
            prev: function () {
                prev();
            },
            next: function () {
                next();
            }
        }
    };
    /*小图多张轮播*/
    smallSlide=function(container,options){
        /*options={
         imgcount:4,
         omargin:"10px",
         speed:300,
         prevClass:"prevBtn",
         nextClass:"nextBtn"，
         countAll:"4",
         direction:"left"，
         slideImgCont:"2"
         };*/
        "use strict";
        if (!container) return;

        var options = options || {},
            currentIndex = 0,
            event = options.event,
            omargin=options.omargin,//小图之间的距离
            imgCont=options.imgcount,//移动小图的数量
            countAll=options.countAll,//当前显示图片的总数量
            slideImgCont=options.slideImgCont,//每一组图片的数量
            countGroup=countAll/slideImgCont,//一共显示多少组
            speed=options.speed,
            step=0,
            i= 0,
            direction=options.direction,
            prevBtn=options.prevClass,
            nextBtn=options.nextClass,
            slidesWrapper = container.children().first().children(),//需要移动位置的ul
            slides = slidesWrapper.children(),//ul里的li
            length = slides.length,
            childWidth = container.width(),
            childHeight = container.height(),
            cont=Math.ceil(length /imgCont),
            slideWidth=imgCont*slides.width()+omargin*imgCont,//每次移动的距离
            slideHeight=imgCont*slides.height()+omargin*imgCont,//每次移动的距
            totalWidth = slides.width()*length+omargin*length,
            totalHeight = slides.height()*Math.ceil(length/slideImgCont)+omargin*Math.ceil(length/slideImgCont);
        //slidesWrapper.css({width:totalWidth});
        //var slidecontAll=length-countAll;//需要移动图片的总数量
        //var slideAll=step*imgCont;//每次移动的图片的数量
        if(direction=="left"){
            slidesWrapper.css({width:totalWidth});
            var slidecontAll=length-countAll;//需要移动图片的总数量
            container.find(nextBtn).click(function(){
                step++;

                if(step*imgCont<=slidecontAll){
                    //console.log(step);
                    slidesWrapper.stop().animate({marginLeft:-step*slideWidth},speed);
                    i=step;
                }else if((step-1)*imgCont<slidecontAll&&slidecontAll<step*imgCont){
                    var lastMove=((step+1)*imgCont-slidecontAll)-countAll;
                    var lastMargin="-"+(lastMove*slides.width()+lastMove*omargin+(step-1)*slideWidth);
                    slidesWrapper.stop().animate({marginLeft:lastMargin},speed);
                    i=step;
                }
            });
            container.find(prevBtn).click(function(){
                if(i>0){
                    console.log(i);
                    i--;
                    step=0;
                    slidesWrapper.stop().animate({marginLeft:-i*slideWidth},speed);
                }
            });
        }else if(direction=="top"){
            var slidecontAll=Math.ceil(length/slideImgCont)-countAll;//需要移动图片的总数量
            container.find(nextBtn).click(function(){
                step++;
                if(step*imgCont<=slidecontAll){
                    slidesWrapper.stop().animate({marginTop:-step*slideHeight},speed);
                    i=step;
                }else if((step-1)*imgCont<slidecontAll&&slidecontAll<step*imgCont){
                    var lastMove=((step+1)*imgCont-slidecontAll)-countAll;
                    var lastMargin="-"+(lastMove*slides.height()+lastMove*omargin+(step-1)*slideHeight);
                    slidesWrapper.stop().animate({marginTop:lastMargin},speed);
                    i=step;
                }
            });
            container.find(prevBtn).click(function(){
                if(i>0){
                    i--;
                    step=0;
                    slidesWrapper.stop().animate({marginTop:-i*slideHeight},speed);
                }
            });
        }
    }
}(jQuery, window, document));















