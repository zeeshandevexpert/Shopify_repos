$(document).ready(function () {
  // Initialize the main image slider
  // $('.main-slider').slick({
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: false,
  //   fade: true,
  //   asNavFor: '.thumbnail-slider' // Sync with thumbnail slider
  // });

  // // Initialize the thumbnail slider
  // $('.thumbnail-slider').slick({
  //   slidesToShow: 6,
  //   slidesToScroll: 1,
  //   asNavFor: '.main-slider', // Sync with main slider
  //   dots: false,
  //   focusOnSelect: true
  // });


  // Add 'active' class to the currently active thumbnail
  $('.thumbnail-slider img').on('click', function () {
    $('.thumbnail-slider img').removeClass('active');
    $(this).addClass('active');
  });

  // Set the first thumbnail as active by default
  $('.thumbnail-slider img').first().addClass('active');


  $('.slider-container').slick({
    slidesToShow: 1.5,  // Show 1.5 slides (1 full slide + part of the next)
    slidesToScroll: 1,  // Scroll 1 slide at a time
    arrows: true,
    prevArrow: "<button type='button' class='slick-prev'><img src='https://cdn.shopify.com/s/files/1/0702/7775/9225/files/previous-arrow.svg?v=1728593729'/></button>",
    nextArrow: "<button type='button' class='slick-next'><img src='https://cdn.shopify.com/s/files/1/0702/7775/9225/files/next-arrow.svg?v=1728593611' alt='Next'></button>", // Custom next arrow image
    infinite: true,      // Make sure the slider scrolls infinitely
    autoplay: false,
    // centerMode: true,
    autoplaySpeed: 3000, // Adjust the speed
    responsive: [
      {
        breakpoint: 1600,  // For mobile devices
        settings: {
          slidesToShow: 1,   // Show only 1 slide on small screens
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 991,  // For mobile devices
        settings: {
          slidesToShow: 2,   // Show only 1 slide on small screens
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,  // For mobile devices
        settings: {
          slidesToShow: 1,   // Show only 1 slide on small screens
          slidesToScroll: 1
        }
      }
    ]
  });

  $('.slider-container-r').slick({
    slidesToShow: 1,  // Show 1.5 slides (1 full slide + part of the next)
    slidesToScroll: 1,  // Scroll 1 slide at a time
    arrows: true,
    prevArrow: "<button type='button' class='slick-prev'><img src='https://cdn.shopify.com/s/files/1/0702/7775/9225/files/previous-arrow.svg?v=1728593729'/></button>",
    nextArrow: "<button type='button' class='slick-next'><img src='https://cdn.shopify.com/s/files/1/0702/7775/9225/files/next-arrow.svg?v=1728593611' alt='Next'></button>", // Custom next arrow image
    infinite: true,      // Make sure the slider scrolls infinitely
    autoplay: false,
    centerMode: true,
    autoplaySpeed: 3000, // Adjust the speed
    responsive: [
      {
        breakpoint: 1600,  // For mobile devices
        settings: {
          slidesToShow: 1,   // Show only 1 slide on small screens
          slidesToScroll: 1,
          centerMode: true
        }
      },
      {
        breakpoint: 991,  // For mobile devices
        settings: {
          slidesToShow: 2,   // Show only 1 slide on small screens
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,  // For mobile devices
        settings: {
          slidesToShow: 1,   // Show only 1 slide on small screens
          slidesToScroll: 1
        }
      }
    ]
  });

  $('.logo-slider').slick({
    infinite: true, // Infinite looping
    slidesToShow: 5, // Number of logos visible at once
    slidesToScroll: 1, // Scroll one logo at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 0, // Set to 0 for smooth, continuous scrolling
    speed: 2000, // Adjust speed for continuous scrolling (higher = slower)
    cssEase: 'linear', // Linear animation for smooth scrolling
    arrows: false, // Hide navigation arrows
    dots: false, // Hide pagination dots
    variableWidth: true, // Allow logos to have different widths
    pauseOnHover: false, // Don't stop when hovered
  });


  $(".accordion-box .accordion-head").click(function() {
    if ($(this).hasClass("active")) {
        $(this).parent().find($('.accordion-body')).slideUp();
        $(this).removeClass("active");
    } else {
        $('.accordion-body').slideUp();
        $(".accordion-head").removeClass("active");
        $(this).parent().find($('.accordion-body')).slideDown();
        $(this).addClass("active");
    }
})

});