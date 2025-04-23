$(document).ready(function() {
	var swiper1 = new Swiper(".slider-processes", {
		slidesPerView: "auto",
		centeredSlides: false,
		spaceBetween: 30,
		observer: true,
		observeParents: true,
		scrollbar: {
				el: ".swiper-scrollbar",
				hide: false,
			},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		breakpoints: {
			992: {
				spaceBetween: 60,
			},
		},
	});

	$("#scroll_to_process").click(function() {
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#section_process").offset().top
		}, 1500);
	});
});

$(window).on("load resize", function () {
	if ($(window).width() < 992) {
		var newposition = $(".slider-processes .swiper-slider-col-left img").outerHeight();
		$(".swiper-scrollbar").css({"top":newposition+90, "bottom":"auto"});
		$(".swiper-button-next, .swiper-button-prev").css({"top":(newposition/2)+70});

	} else {
		$(".swiper-scrollbar, .swiper-button-next, .swiper-button-prev").removeAttr("style");
	}
});