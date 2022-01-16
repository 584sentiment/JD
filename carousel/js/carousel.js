/* 
    思考：如何给 jQuery 扩展内容或者说方法？
    扩展提问：$.extend 和 $.fn.extend 区别？

    $.extend		给 jQuery 类本身扩展方法（构造函数.xxx）
    $.fn.extend		给 jQuery 实例对象扩展方法（构造函数.prototype.xxx）

    我们这个组件是要给实例用的，所以要使用$.fn.extend
 */


$.fn.extend({
    carousel: function (options) {
        /* 
            写到这先把两个东西打印出来瞧一瞧
            console.log(options);	//options为配置对象，由使用插件的用户传递过来的
            console.log(this);		// this对应的是轮播图容器节点（.carousel）。谁调用this指向谁，注意它是个jquery对象
         */

        var obj = new Carousel(options, this); // 实例化一个轮播图的组件，并把配置参数与容器传到构造函数里
        obj.init();	//初始化
    }
})

//封装Carousel构造函数，并对配置参数进行处理
function Carousel(options, wrap) {
    //根据面向对象的写法，在构造函数里一般要做的工作是，把所有的数据都挂载到this身上，并给一些初始值，这里也不例外
    this.wrap = wrap; 	//轮播图外层容器
    this.width = options.width || wrap.width(); // 轮播图容器的宽度
    this.height = options.height || wrap.height(); // 轮播图容器的高度
    this.list = options.list || []; // 轮播的内容列表（赋初始值用的是运算符或，表示如果用户没给内容列表，那就给它赋一个空数组）
    this.duration = options.duration || 5000; // 自动播放时间
    this.type = options.type || 'fade'; // 播放的方式
    this.autoPlay = options.autoPlay === undefined ? true : !!options.autoPlay;// 是否自动轮播（用户没有传，走默认true，传的话强制转成布尔值，即使它不小心传了一个字符串false，也会给它转成真正的布尔值，严谨一些）

    this.changeBtn = options.changeBtn || 'always';	// 箭头状态，always一支显示		hide隐藏	hover移入显示
    this.navShow = options.navShow == undefined ? true : !!options.navShow;	//是否显示小圆点
    this.navSize = options.navSize || 5;	//小圆点大小
    this.navPosition = options.navPosition || 'center';	//小圆点位置 left center right
    this.navColor = options.navColor || "rgba(255,255,255,.4)";	//小圆点的背景颜色
    this.navActiveColor = options.navActiveColor || "red";	 //小圆点激活的颜色


    // 以上的属性都是用户传递过来的，都已经保存在了 Carousel 实例对象上啦。但还有一些属性不要忘记啦，这些属性并不是用户传过来的，也不需要用户传，但是依然在存储到实例对象上
    this.len = this.list.length; // 轮播图内容的长度
    this.cn = 0; // 当前的索引值
    //this.ln = 0; // 上一个选中的索引
    this.timer = null; // 定时器
    this.canClick = true; // 是否执行切换动画
}

//初始化
Carousel.prototype.init = function () {
    // 1、创建轮播图结构
    this.createDom();

    // 2、添加样式
    this.addStyle();

    // 3、添加事件
    this.bindEvent();

    // 4、自动轮播
    this.autoPlay && this.autoChange();
};

//生成结构
Carousel.prototype.createDom = function () {
    // 整个轮播图的包裹层
    var This = this;

    //首先打开昨天的demo.html，根据那里的结构去创建结构
    this.carouselWrap = $('<div class="myCarousel"></div>');
    this.ul = $('<ul class="list"></ul>');  //内容父级
    this.prev = $('<div class="btn prev"><i class="iconfont icon-prev"></i></div>'); //右按钮
    this.next = $('<div class="btn next"><i class="iconfont icon-next"></i></div>'); //右按钮
    this.nav = $('<div class="nav"></div>');//小圆点

    //根据用户传递进来的配置参数添加轮播图的内容与圆点
    for (var i = 0; i < this.len; i++) {
        // 往轮播图的内容区添加 li
        $("<li></li>").html(this.list[i]).appendTo(this.ul);
        // 添加对应的小圆点
        $("<span></span>").appendTo(this.nav);
    }


    //（再根据布尔值类型的配置创建对应结构）
    //处理轮播图形式
    /* if (this.type === 'animate') {    //轮播图的形式为无缝滚动（需要在复制一个li到最后） 
        this.ul.append($("<li></li>").html($(this.list[0]).clone(true)));
    } */
    //this.type === 'animate' && this.ul.append($("<li></li>").html($(this.list[0]).clone(true)));    //此时DOM并没有添加到页面里，所以只能复制内容
    this.type === 'animate' && this.ul.append($("<li></li>").html($(this.list[0]).clone(true)));


    //处理按钮
    switch (this.changeBtn) {
        case 'hide':
            this.prev.hide();
            this.next.hide();
            break;

        case 'hover':
            // 先把添加的按钮隐藏掉，
            this.prev.hide();
            this.next.hide();

            //再设置 hover 方法
            this.carouselWrap.hover(function () {
                //鼠标进入
                This.prev.show();
                This.next.show();
            }, function () {
                //鼠标离开
                This.prev.hide();
                This.next.hide();
            });
            break;

        /* default: {
            // 默认 always
            break;
        } */
    }


    //处理圆点
    /* if (!this.navShow) {  //条件成立说明用户不要小圆点
        this.nav.hide();
    } */
    !this.navShow && this.nav.hide();

    //添加DOM
    this.carouselWrap
        .append(this.ul)
        .append(this.prev)
        .append(this.next)
        .append(this.nav)
        .addClass('carousel_' + this.type)    //不同的轮播类型添加一个不同的标识class
        .appendTo(this.wrap);   //把轮播图的父级添加到用户传的DOM里

    //存储一下别的dom
    this.lis = this.ul.children();
    this.spans = this.nav.children();
}

//添加样式
Carousel.prototype.addStyle = function () {
    this.lis.css('width', this.width);  //不管哪种形式下li标签需要给一个与wrap一样的宽度，高度已通过样式设置为100%

    // 设置小圆点
    this.nav.css('text-align', this.navPosition);
    this.spans.css({
        width: this.navSize,
        height: this.navSize,
        backgroundColor: this.navColor
    })
        .eq(this.cn % this.len).css('background-color', this.navActiveColor); // 当前激活的样式，这边取余是为了到最后一张的时候立马回到第一张
};

//添加功能
Carousel.prototype.bindEvent = function () {
    var This = this;
    // 1、左右按钮功能
    //上一张
    this.prev.click(function () {
        if (!This.canClick) {
            return;
        }
        This.canClick = false;

        switch (This.type) {
            case 'fade':
                // 淡入淡出
                if (This.cn === 0) {
                    // 跳到最后一张
                    This.cn = This.len - 1;
                } else {
                    This.cn--;
                }
                This.change();

                break;
            case 'animate':
                // 从左到右
                if (This.cn === 0) {
                    // 当前已经是第一张，要跳转最后一张
                    This.ul.css('left', -This.len * This.width);
                    This.cn = This.len - 1;
                } else {
                    This.cn--;
                }
                This.change();
                break;
        }

        //This.play();
    });

    //下一张
    this.next.click(function () {
        if (!This.canClick) {
            return;
        }
        This.canClick = false;

        switch (This.type) {
            case 'fade':
                // 淡入淡出
                if (This.cn === This.len - 1) { //这种形式没有复制
                    // 跳到最后一张
                    This.cn = 0;
                } else {
                    This.cn++;
                }
                This.change();

                break;
            case 'animate':
                // 从左到右
                if (This.cn === This.len) {
                    // 当前已经是第一张，要跳转最后一张
                    This.ul.css('left', 0);
                    This.cn = 1;
                } else {
                    This.cn++;
                }

                This.change();
                break;
        }
    });

    // 2、小圆点功能
    // 需要做的事儿：鼠标点击对应小圆点的时候，更新 cn，然后调用 change 方法即可
    this.nav.on('click', 'span', function () {// 这里是事件委托
        if (!This.canClick) {
            return;
        }
        This.canClick = false;

        //console.log(this,'this');
        This.cn = $(this).index();
        This.change();
    });


    // 3、鼠标移入移出功能
    this.carouselWrap.mouseenter(function () {
        clearInterval(This.timer);
    }).mouseleave(function () {
        This.autoPlay && This.autoChange();
    });
};

Carousel.prototype.change = function () {
    var This = this;

    switch (this.type) {
        case 'fade':
            // 淡入淡出
            // 先把所有的图片都 fadeOut
            // 然后将当前的图片 fadeIn
            this.lis.fadeOut().eq(this.cn).fadeIn(function () {
                This.canClick = true; // 淡入淡出效果已经完成，关闭锁
            });
            break;
        case 'animate':
            // 从左到右
            this.ul.animate({
                left: -this.cn * this.width,
            }, function () {
                This.canClick = true; // 淡入淡出效果已经完成，关闭锁
            })
            break;
    }

    // 2. 更新小圆点
    this.spans.css('background-color', this.navColor)
        .eq(this.cn % this.len)
        .css('background-color', this.navActiveColor)
};

// 自动播放
Carousel.prototype.autoChange = function () {
    var This = this;
    clearInterval(this.timer);

    this.timer = setInterval(function () {
        This.next.trigger('click');
    }, this.duration);
}