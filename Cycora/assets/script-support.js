$(document).ready(function() {
	// Accordion FAQ
	$('.accordion-row h4').on('click', function(){
		$(this).parent().parent().toggleClass("accordion-row-active").siblings().removeClass('accordion-row-active');
	});

	$('#search_support').on('input', function(){
		var search_value = $('#search_support').val().toLowerCase();
		if(search_value.length > 2){
			var question = '';
			var position = 0;
			$('.accordion-title').each(function(){
				question = $(this).data('search-text');
				position = question.search(search_value);
				if(position == -1){
					$(this).hide();
				}else{
					$(this).show();
				}
			});
		}else{
			$('.accordion-title').show();
		}
	});
});