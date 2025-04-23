var swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,   // Show 2 slides by default
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    // When the window width is less than 768px (for mobile screens)
   
    200: {
      slidesPerView: 1,  // Show 1 slide on mobile
    },
    991: {
      slidesPerView: 2,  // Show 1 slide on mobile
    },
  },
});
