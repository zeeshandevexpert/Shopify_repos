  // Swiper Initialization
  const swiper = new Swiper('.mySwiper', {
    loop: true, // Infinite loop
    spaceBetween: 30, // Space between slides
    autoplay: {
      delay: 1000, // Delay between slides (in milliseconds)
      disableOnInteraction: false, // Continue autoplay even after user interaction
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2, // Two slides for medium screens
      },
      1024: {
        slidesPerView: 4, // Three slides for large screens
      },
    },
  });

  $(".accordion-box .accordion-head").click(function(){
  if($(this).hasClass("active")){
      $(this).parent().find($('.accordion-body')).slideUp();
      $(this).removeClass("active");
  }else{
      $('.accordion-body').slideUp();
     $(".accordion-head").removeClass("active");
      $(this).parent().find($('.accordion-body')).slideDown();
      $(this).addClass("active");
  }
  })
