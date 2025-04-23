$('.multiple-items').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    prevArrow: $('.slick-prev'),  // Custom previous arrow
    nextArrow: $('.slick-next'),  // Custom next arrow
    
  });

$('.testi-slider').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows:false,
    
  });

$('.products-slider').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: false,
    prevArrow: $('.slick-prev'),  // Custom previous arrow
    nextArrow: $('.slick-next'),  // Custom next arrow 
  });