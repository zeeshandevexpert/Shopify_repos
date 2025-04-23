var mySwiper = new Swiper(".materials-page-slider", {
    slidesPerView: "auto",
    spaceBetween: 30,
    centeredSlides: true,
    observeParents: true,
    observer: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    loop: true,
    speed: 600,
    autoplay: {
        disableOnInteraction: true,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,

    },
    on: {
        slideChange: function() {
            $('.materials-page-menu ul li').eq(this.realIndex).addClass('active').siblings().removeClass('active');
        },
        init: function() {
            $('.materials-page-menu ul li').eq(this.realIndex).addClass('active').siblings().removeClass('active');
        }
    },
    breakpoints: {
        // when window width is >= 992px
        992: {
            slidesPerView: 1,
            centeredSlides: false,
            spaceBetween: 0,
            effect: "fade",
            fadeEffect:{
                crossFade: true
            },
            loop: false,
            showsPagination: false,
        },
    }
});


$( ".materials-page-menu ul li span" ).on( "click", function() {
    $(this).parent().addClass('active').siblings().removeClass('active');
    var slidernr = $(this).parent().attr('data-slide');
    mySwiper.slideTo( slidernr,600,false );
});

$(window).on("load resize", function () {
    if ($(window).width() < 992) {
        var newposition = $(".materials-page-slider .materials-page-slider-left img").outerHeight();
        $(".swiper-pagination").css({"top":newposition+50, "bottom":"auto"});
    } else {
        $(".swiper-pagination").removeAttr("style");
    }
});