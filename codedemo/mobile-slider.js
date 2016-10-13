var Slider={
    isScrolling:false,
    newClass:function(obj){
        obj=obj||{};
        if(this.isScrolling==false){
            this.init.prototype=Slider;
            this.isScrolling=true;
        }
        return new this.init(obj);
    },
    init:function(ele){
        this.slide=ele.slide;//最外层的div
        this.slideBox=ele.slideBox;//需要移动位置的div
        this.sMain=ele.sMain;//滑动图片的总数--nodeList
        this.sItem=ele.sItem;//li
        this.item=ele.item;//当前的索引
        this.winWidth=window.innerWidth;
        this.slideBox.style.width=this.winWidth*this.sMain.length+"px";
        for(var i=0;i<this.sMain.length;i++){
            this.sMain[i].style.width=this.winWidth+"px";
        }
        this.bindTouch();//绑定触摸事件
    },
    bindTouch:function(){
        var _this=this;
        var startPos=null;
        this.slide.addEventListener("touchstart",function(e){
            _this.isScrolling=true;
            var startTouch= e.changedTouches[0];
            startPos={
                x:startTouch.pageX,
                y:startTouch.pageY,
                time:+new Date()
            }
        },false);
        this.slide.addEventListener("touchmove",function(e){
            if(!_this.isScrolling){
                return;
            }else{
                e.preventDefault();
                var moveTouch= e.changedTouches[0];
                var movePos={
                    x:moveTouch.pageX-startPos.x,
                    y:moveTouch.pageY-startPos.y
                }
                _this.isScrolling=Math.abs(movePos.x)>Math.abs(movePos.y) ? true:false
                if(_this.isScrolling){
                    var moveOffset=movePos.x-_this.item*_this.winWidth;
                    _this.slideBox.style.webkitTransform="translate3d("+moveOffset+"px,0,0)";
                    _this.slideBox.style.webkitTransform="all .6s ease-out";
                }
                // console.log(movePos);
            }

        },false)
        this.slide.addEventListener("touchend",function(e){
            if(!_this.isScrolling){
                return;
            }
            var duration=+new Date()-startPos.time;
            var endTouch= e.changedTouches[0];
            var endPos={x:endTouch.pageX-startPos.x,
                y:endTouch.pageY-startPos.y
            }
            //console.log(endPos);
            if(duration>100){
                if(Math.abs(endPos.x)>10){
                    if(endPos.x>0){
                        if(_this.item==0){
                            _this.isScrolling=false;
                            _this.objAnimation();//回弹到第一张
                        }else{
                            _this.prevPage();//滑到下一张
                        }

                    }else if(endPos.x<0){
                        if(_this.item==_this.sMain.length-1){
                            _this.objAnimation();
                        }else{
                            _this.nextPage();//滑到上一张
                        }

                    }else{
                        _this.isScrolling=false;
                    }
                }
            }
        },false)
    },
    nextPage: function () {
        if(this.item==this.sMain.length-1){
            return;
        }
        this.item++;
        this.objAnimation();//处理动画
        this.curItem();//显示当前索引值
    },
    prevPage:function(){
        if(this.item==0){
            return;
        }
        this.item--;
        this.objAnimation(this.item);
        this.curItem(this.item);
    },
    curItem:function(){
        for(var i=0;i<this.sItem.length;i++){
            this.sItem[i].className="";
        }
        this.sItem[this.item].className="cur";
    },
    objAnimation:function(){
        var setEq=-(this.item*this.winWidth)+"px";
        this.slideBox.style.webkitTransition="all .6s ease-out";
        this.slideBox.style.webkitTransform="translate3d("+setEq+",0,0)";
    }
};
var obj={
    slide:document.querySelector(".slide"),
    slideBox:document.querySelector(".slide-box"),
    sMain:document.querySelectorAll(".sMain"),
    sItem:document.querySelector(".slide-item").getElementsByTagName("li"),
    item:0
};
Slider.newClass(obj);