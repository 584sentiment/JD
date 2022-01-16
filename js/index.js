$('#shortcut .w').load('../components/head/shortcut.html'); //加载顶部导航模块
$('#header .w').load('../components/head/header.html'); //加载头部模块
$('#bannerWrap .menu').load('../components/banner/menu.html'); //加载菜单模块
$('#bannerWrap .banner').load('../components/banner/banner.html', function(){   //加载banner模块
    //组件加载完成后就会触发
    $(this).carousel({
        list:$(this).find('.bannerImg'),
        type:'fade',
        /* width:590,
        height */
        navPosition:'left',
        navSize:10
    });
}); 

$('#bannerWrap .carousel').load('../components/banner/carousel.html', function(){   //加载banner模块
    //组件加载完成后就会触发
    $(this).carousel({
        list:$(this).find('.carouselImg'),
        navShow:false,
        changeBtn:'hover'
    })
}); 
$('.userWrap .user').load('../components/user/user.html')
$('.userWrap .news').load('../components/user/news.html')
$('.userWrap .service').load('../components/user/service.html')

$('#seckill').load('../components/seckill/seckill.html')