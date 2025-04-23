// masonry layout
$(window).on("load resize", function () {
	if ($(window).width() > 991) {
		$('.press-approved-col-right').colcade({
			columns: '.col-divider',
			items: '.press-approved-info'
		});
	} else {
		$('.press-approved-col-right').colcade('destroy')
	}	
});

$(document).ready(function() {
	console.log(1111);
	$('#load-all-photo').on('click', function(){
		$('.photo-section').fadeIn(800);
		$(this).fadeOut(800);
	});
});
