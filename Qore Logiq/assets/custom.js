$('.slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    // adaptiveHeight: true,
    draggable: false,
    responsive: [
        {
          breakpoint: 768,
          settings: {
            draggable: true,
            swipe: false,
            arrows: true,
            dots:true
          }
        },
        {
          breakpoint: 480,
          settings: {
            draggable: true,
            swipe: false,
            arrows: true,
            dots:true
          }
        }
      ]
  });