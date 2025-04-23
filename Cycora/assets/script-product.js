$(document).ready(function() {

	initActiveProductVariant();
	$('.pdp-size-swatcher, .pdp-color-swatcher').on('click', function(){
		selectProductVariant();
	});

	var swiper1 = new Swiper(".product-page-fiber-slider", {
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

	// Show color title
	// $( ".product-buy-color-row" ).on( "click", ".product-buy-color-col", function() {
	// 	$(this).addClass('active').siblings().removeClass('active');
	// });

	$(document).ready(function(){  

		// Show color title  
		$(".product-buy-color-row .product-buy-color-col:eq(0)").addClass("active");   

		// $(".product-buy-color-row .product-buy-color-col").click(function(){   
		// 	$id = $(this).data("id");
		// 	var index = $(this).index();  
		// 	console.log(index)
		// 	if($(this).hasClass("active")){
	
		// 	}else{
		// 		$(".product-buy-color-row .product-buy-color-col").removeClass("active");
		// 		$(this).addClass("active");
		// 		$(".product-buy-col-right .feature_img").addClass("in_active");
		// 		if($id){ 
		// 			// console.log($id) 
		// 			$(".product-buy-col-right .variants").hide();
		// 			for (let i = 0; i < $(".product-buy-col-right .variants.s").length; i++) {					
		// 				if($(".product-buy-col-right .variants").eq(i).hasClass(`${$id}`)){
		// 					$(".product-buy-col-right .variants").eq(i).fadeIn('slow'); 
		// 				}
		// 			}
					
		// 		}
		// 	} 
		// }) 


		// $(".product-buy-color-row .product-buy-color-col").click(function(){   
		// 	$id = $(this).data("id");
		// 	var index = $(this).index(); 
		// 	if($(this).hasClass("active")){

		// 	}else{
		// 		$(".product-buy-color-row .product-buy-color-col").removeClass("active");
		// 		$(this).addClass("active");
		// 		$(".product-buy-col-right .feature_img").addClass("in_active");
		// 		$(".product-buy-col-right .img-wraper .variants").css("display","none");
		// 		$(".product-buy-col-right .img-wraper .variants:eq("+index+")").fadeIn('slow');
		// 		// $(".img-wraper").fadeIn("fast"); 
		// 		$(".variants").css("display","block");
		// 	}
		// });
		 
		
	});

	// Drophover on text category
	$('.product-buy-materials').on('click', '.product-buy-materials-col-with-tooltip', function() {
		$('.product-buy-materials-col-with-tooltip').not(this).removeClass('product-buy-materials-col-with-tooltip-active');
		$(this).toggleClass('product-buy-materials-col-with-tooltip-active');
	});

	// Close drophover on click outside
	$('body').on("click", function(e) {
		if ($('.product-buy-materials-col-with-tooltip-active')[0]) {
			if ($(e.target).is(".product-buy-materials-col-with-tooltip") === false) {
				$('.product-buy-materials-col-with-tooltip').removeClass('product-buy-materials-col-with-tooltip-active');
			}
		}
	});
});

// First section chart slider

$.fn.removeClassStartingWith = function (filter) {
    $(this).removeClass(function (index, className) {
        return (className.match(new RegExp("\\S*" + filter + "\\S*", 'g')) || []).join(' ')
    });
    return this;
};

var mySwiper2 = new Swiper(".chart-slider", {
	slidesPerView: 1,
	spaceBetween: 0,
	centeredSlides: true,
	observeParents: true,
	observer: true,
	watchSlidesVisibility: true,
	effect: "fade",
	fadeEffect:{
		crossFade: true
	},
	slideToClickedSlide: true,
	loop: false,
	showsPagination: false,
	speed: 600,
	autoplay: {
		disableOnInteraction: false,
		pauseOnMouseEnter: true,
	},
	on: {
		slideChange: function() {
			$('.chart-animate').removeClassStartingWith('slide-*').addClass('slide-'+this.realIndex);
		},
		init: function() {
			$('.chart-animate').addClass('slide-'+this.realIndex);
		}
	},
});

$(window).on("load resize", function () {
	var chartwidth = ( $('.chart-animate').outerWidth() / 1.8);
	console.log(chartwidth);
	$('.chart-animate').css('height', chartwidth + "px");
});

$(".chart-animate span" ).on( "click", function() {
	$(this).parent().removeClassStartingWith('slide-*');
	var chartnr = $(this).attr('data-id');
	$(this).parent().addClass('slide-'+chartnr);
	mySwiper2.slideTo( chartnr,600,false );
});


// Middle Slider

$(window).on("load resize", function () {
	if ($(window).width() < 992) {
		var newposition = $(".product-page-fiber-slider .swiper-slider-col-left img").outerHeight();
		$(".product-page-fiber-slider .swiper-scrollbar").css({"top":newposition+70, "bottom":"auto"});
		$(".product-page-fiber-slider .swiper-button-next, .product-page-fiber-slider .swiper-button-prev").css({"top":(newposition/2)+70});

	} else {
		$(".product-page-fiber-slider .swiper-scrollbar, .product-page-fiber-slider .swiper-button-next, .product-page-fiber-slider .swiper-button-prev").removeAttr("style");
	}
});

function initActiveProductVariant() {
	var product_variant_count = $('#product_variant_count').val();
	if(product_variant_count>1){
		var default_product_variant = $('#default_product_variant');
		var option1 = default_product_variant.data('option1');
		var option2 = default_product_variant.data('option2');
		setTimeout(function() {
			$('#size_' + option1).click();
			$('#color_' + option2).click();
		}, 500);
	}
}

function selectProductVariant() {
	var option1 = '';
	var option2 = '';
	$('.pdp-size-swatcher').each(function(){
		if($(this).is(':checked')){
			option1 = $(this).val();
		}
	});
	$('.pdp-color-swatcher').each(function(){
		if($(this).is(':checked')){
			option2 = $(this).val();
		}
	});

	var active_variant_id = 0;
	var available_variant = '';
	if(option1!='' && option2!='') {
		$('.pdp-all-variants').each(function () {
			if ($(this).data('option1') == option1 && $(this).data('option2') == option2) {
				active_variant_id = $(this).data('variant_id');
				available_variant = $(this).data('available');
			}
		});
		$('#active_variant_id').val(active_variant_id);

		if(available_variant==true){
			$('#buy_button').show();
			$('#sold_out_title').hide();
		}else{
			$('#buy_button').hide();
			$('#sold_out_title').show();
		}
	}
}