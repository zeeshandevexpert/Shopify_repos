$(document).ready(function () {

	// Main Menu Mobile
	$('.menu-mobile').on('click', function() {
		$(this).toggleClass('menu-mobile-active');
		if ($('header').hasClass("header-light-skin")) {
			$('header').toggleClass('header-dark-skin');
		}
		$('.header-menu').toggleClass('header-menu-active');
		$('.header-col-left').toggleClass('header-col-left-mobile');
		$('html, body').toggleClass('body-overflow');
	});

	// Drophover on text
	var documentWidth = $(document).width();
	var activeState = 'mouseover';

	if( documentWidth > 768 ){
		$('.linked-drophover').on('mouseover', function() {
			$(this).addClass('linked-drophover-active');
		});

		$('.linked-drophover').on('mouseout', function() {
			$(this).removeClass('linked-drophover-active');
		});

	} else {
		$('.linked-drophover').on('click', function() {
			if( documentWidth < 500 ){
				var leftPosition = $(this).position().left;
				leftPosition = (documentWidth - leftPosition) - 220;
				$('i', this).css('left', leftPosition);
			}

			$('.linked-drophover').not(this).removeClass('linked-drophover-active');
			$(this).toggleClass('linked-drophover-active');
		});
	}

	// Drophover on text category
	$('.linked-drophover-product').on('click', function() {
		$('.linked-drophover-product').not(this).removeClass('linked-drophover-product-active');
		$(this).toggleClass('linked-drophover-product-active');
	});

	// Close drophover on click outside
	$('body').on("click", function(e) {
		if ($('.linked-drophover-active')[0]) {
			if ($(e.target).is(".linked-drophover") === false) {
				$('.linked-drophover').removeClass('linked-drophover-active');
			}
		}
		if ($('.linked-drophover-product-active')[0]) {
			if ($(e.target).is(".linked-drophover-product") === false) {
				$('.linked-drophover-product').removeClass('linked-drophover-product-active');
			}
		}
	});

	// Video full container
	$('.general-play-button').on('click', function() {
		$(this).parent().parent().addClass('general-video-section-active');
		var youtubeid = $('.general-video-section-active .general-video-iframe iframe').attr('youtube-id');
		$('.general-video-section-active .general-video-iframe iframe').attr('src', "https://www.youtube.com/embed/"+youtubeid+"?rel=0&wmode=transparent&iv_load_policy=3&modestbranding=1&showinfo=0&rel=0&color=white&controls=1&disablekb=1&autoplay=1");
	});

	// Active Shop Filter General Section
	$('.general-more-products-top-style2 ul li').on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');
		console.log('call on backend for listing the filtered products');
	});

	// Scrollable element
	$('.scrollable-element').on('click', function() {
		var getScrollDiv = $(this).attr('data-scroll');
		if ($(getScrollDiv).length != 0) {
			$('html, body').animate({scrollTop: $(getScrollDiv).offset().top}, 1200);
		}
	});

	// cart menu on click
	$('.header-menu').on('click', '.cart-menu', function() {
		if ($(window).width() > 991) {
			closecarthovermenu();
		}
		$(this).toggleClass('cart-menu-active');
		$('.cart-menu-modal').toggleClass('cart-menu-modal-active');
		if ($('.cart-menu-modal-active')[0]) {
			$('.cart-menu-modal').slideDown(400);
		} else {
			$('.cart-menu-modal').slideUp(400);
		}
	});

	$('.cart-menu-modal-close').on('click', function() {
		$('.header-menu').removeClass('cart-menu-active');
		$('.cart-menu-modal').toggleClass('cart-menu-modal-active');
		if ($('.cart-menu-modal-active')[0]) {
			$('.cart-menu-modal').slideDown(400);
		} else {
			$('.cart-menu-modal').slideUp(400);
		}
	});

	// cart menu on click - Remove when select value is 0
	$('.cart-menu-modal .select-style1 select').on('change', function() {
		var selectValue = $(this).val();
		if (selectValue == 0) {
			console.log('remove from database query');
			$(this).parent().parent().parent().remove();
		}
	});

	// cart menu on click - Remove button only in mobile
	$('.cart-menu-modal').on('click', '.cart-menu-modal-col span u', function() {
		console.log('remove from database query');
		$(this).parent().parent().parent().remove();
	});

	// Cart menu hover on desktop
	if ($(window).width() > 991) {

		$(".cart-menu").on({
			mouseover: function(e) {
				if (!$('.cart-menu-modal-active')[0]) {
					$('.cart-menu-hover').addClass('cart-menu-hover-active');
					$('.cart-menu-hover').stop().animate({opacity: 1}, 400);
				}
			},
		});
		$(".cart-menu-hover").on({
			mouseleave: function(e) {
				$('.cart-menu-hover').stop().animate({opacity: 0}, 400).promise().done(function(){
					$('.cart-menu-hover').removeClass('cart-menu-hover-active');
				});
			}
		});

	}

	function closecarthovermenu() {
		$('.cart-menu-hover').stop().animate({opacity: 0}, 400).promise().done(function(){
			$('.cart-menu-hover').removeClass('cart-menu-hover-active');
		});
	}

	// Search modal
	$('.search-element').on('click', function(e) {
		e.preventDefault();
		$(this).addClass('search-element-active');
		$('.search-modal').addClass('search-modal-active');
		$('html, body').addClass('body-overflow');
	});

	$('.search-modal-close').on('click', function(e) {
		$('.search-modal').removeClass('search-modal-active');
		if (!$('.header-menu-active')[0]) {
			$('html, body').removeClass('body-overflow');
		}
	});

	$(".search-modal-input input").on("keyup change", function(e) {
		if ($(this).val().length == 0) {
			$('.search-modal-button').removeClass('search-modal-button-active');
		} else {
			$('.search-modal-button').addClass('search-modal-button-active');
		}
	});

	// Scroll to top
	$(".scroll-to-top").on( "click", function(){
		$("body,html").animate({ scrollTop: "0" }, 750);
	});

	$(window).scroll(function(){
		if ($(window).width() > 991) {
			if($(window).scrollTop() > 155) {
				$(".scroll-to-top").show();
			} else {
				$(".scroll-to-top").hide();
			}
		}
	});

	// Backend codes start here
	$('#button_create_customer').on('click', function(e) {

		if ($('#create_password').val() === $('#password_confirm').val()) {
			$('form#create_customer').submit();
		} else {
			$('.error-form').html('<ul><li>Passwords do not match</li></ul>');
			return false;
		}
	});



});
