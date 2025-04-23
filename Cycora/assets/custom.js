$(document).ready(function () {

    
    $(".cycle-slider").slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrow: false,
        dots: false,
        autoplay:true,
        autoplaySpeed:2000,
        nextArrow:"<button type='button' class='slick-next prod pull-right'><img src='https://cdn.shopify.com/s/files/1/0646/7790/4638/files/Arrow_2_1.png?v=1721171188'></button>",
        // prevArrow:"<button type='button' class='slick-prev prod pull-left'><img src='https://cdn.shopify.com/s/files/1/0646/7790/4638/files/Arrow_3.png?v=1721171209'></button>",
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    });
});