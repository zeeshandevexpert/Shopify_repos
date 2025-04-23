$(document).ready(function(){
  $('form .cart-product-part').each(function(){
    var variant_id = $(this).data("variant-cart-id");
    console.log(variant_id);
    if(variant_id == 39502223540389){
      $("body .dbtfy-cart_goal").find('.cg-free-shipping-text span').text('You are eligible for FREE shipping!');
      $("body .cg-free-shipping-bar").find('.cg-progress-bar').css('width', '100%');
    }
  })
});

 var swiper = new Swiper(".mySwiper", {
      slidesPerView: "auto",
      spaceBetween: 30,
    autoplay: {
    delay: 3000, // Auto slide every 3 seconds
    disableOnInteraction: false, // Keep autoplay running even after user interacts
  },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });


  // document.addEventListener('DOMContentLoaded', () => {
    
  //   const conditionalElement = document.querySelector('[data-rid="4c009e4b-f854-44f7-9041-2a6cf30943a9"] div span');

  //     if (conditionalElement) {
  //         // Get the numeric value from the span
  //         const countNumber = parseInt(conditionalElement.textContent.trim(), 10);

  //         console.log("Count Number:", countNumber);

  //         // Check the condition
  //         if (countNumber < 5 || countNumber > 11) {
  //             const targetElement = document.querySelector('e');
  //             if (targetElement) {
  //                 targetElement.style.display = 'none';
  //             }
  //         }
  //     }

  // });