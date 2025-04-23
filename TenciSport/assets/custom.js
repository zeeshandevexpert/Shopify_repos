$('.collection-wrap .inner').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    dots: true,
    infinite:false,
    arrows: false,
    autoWidth:false,
    responsive: [
        {
            breakpoint:1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint:567,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
});

$('.banner-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    dots: true,
    infinite:false,
    arrows: false,
    autoWidth:false,
    responsive: [
        {
            breakpoint:1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint:567,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
});

$('.testimonials-container .testimonial').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: false,
    arrows: true,
    nextArrow:"<button type='button' class='slick-next prod pull-right'><img src='https://cdn.shopify.com/s/files/1/0576/0057/3476/files/Arrow_1.png?v=1719950357'></button>",
    prevArrow:"<button type='button' class='slick-prev prod pull-left'><img src='https://cdn.shopify.com/s/files/1/0576/0057/3476/files/Arrow_2.png?v=1719950356'></button>",
});


// document.addEventListener('DOMContentLoaded', function() {
//     const header = document.getElementById('fixedHeader');
    
//         window.addEventListener('scroll', function() {
//             if (window.scrollY > 0) {
//             header.classList.add('scrolled');
//             } else {
//             header.classList.remove('scrolled');
//             }
//         });
//     });


    window.onscroll = function() {
        myFunction();
    };

    function myFunction() {
        var header = document.getElementById("fixedHeader");
        var blacklogo = document.querySelector(".header__heading-logo-wrapper.black-logo");
        var whitelogo = document.querySelector(".header__heading-logo-wrapper.white-logo");
        if (window.pageYOffset > header.offsetTop) {
            header.classList.add("scrolled");
            blacklogo.classList.remove("active")
            whitelogo.classList.remove("in-active")
            whitelogo.classList.add("active")

        } else {
            header.classList.remove("scrolled");
            blacklogo.classList.add("active")
            whitelogo.classList.add("in-active")
            whitelogo.classList.remove("active")
        }
    }