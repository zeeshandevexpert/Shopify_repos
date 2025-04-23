$(document).ready(function() {
	$('.video-home-cover').on("click", function(e) {
		var youtubeid = $(this).attr('youtube-id');
		$('.home-circularity-middle').append('<iframe src="https://www.youtube.com/embed/'+youtubeid+'?start=0&mute=0&autoplay=1&loop=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&color=white&controls=0&disablekb=1&playlist='+youtubeid+'" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%" scrolling="false" allowfullscreen="" frameborder="0" allow="autoplay; fullscreen"></iframe>');
	});
});


// Jquery if is Visible
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){function i(){var b,c,d={height:f.innerHeight,width:f.innerWidth};return d.height||(b=e.compatMode,(b||!a.support.boxModel)&&(c="CSS1Compat"===b?g:e.body,d={height:c.clientHeight,width:c.clientWidth})),d}function j(){return{top:f.pageYOffset||g.scrollTop||e.body.scrollTop,left:f.pageXOffset||g.scrollLeft||e.body.scrollLeft}}function k(){if(b.length){var e=0,f=a.map(b,function(a){var b=a.data.selector,c=a.$element;return b?c.find(b):c});for(c=c||i(),d=d||j();e<b.length;e++)if(a.contains(g,f[e][0])){var h=a(f[e]),k={height:h[0].offsetHeight,width:h[0].offsetWidth},l=h.offset(),m=h.data("inview");if(!d||!c)return;l.top+k.height>d.top&&l.top<d.top+c.height&&l.left+k.width>d.left&&l.left<d.left+c.width?m||h.data("inview",!0).trigger("inview",[!0]):m&&h.data("inview",!1).trigger("inview",[!1])}}}var c,d,h,b=[],e=document,f=window,g=e.documentElement;a.event.special.inview={add:function(c){b.push({data:c,$element:a(this),element:this}),!h&&b.length&&(h=setInterval(k,250))},remove:function(a){for(var c=0;c<b.length;c++){var d=b[c];if(d.element===this&&d.data.guid===a.guid){b.splice(c,1);break}}b.length||(clearInterval(h),h=null)}},a(f).on("scroll resize scrollstop",function(){c=d=null}),!g.addEventListener&&g.attachEvent&&g.attachEvent("onfocusin",function(){d=null})});


$('.home-circularity-top').on('inview', function(event, isInView) {
	if (isInView) {
		if($('.home-circularity-desktop .standard-video-iframe:visible')) {

			$('.home-circularity-desktop .standard-video-iframe video').prop('autoplay', true );
			$('.home-circularity-desktop .standard-video-iframe video').trigger('play');
		} else if ($('.home-circularity-desktop .standard-youtube-iframe:visible')) {
			var videoUrl = $('.home-circularity-desktop .standard-youtube-iframe').attr('src');
			$('.home-circularity-desktop .standard-youtube-iframe').attr('src', videoUrl + "&autoplay=1");

		} else if ($('.home-circularity-desktop .standard-vimeo-iframe:visible')) {

		}
	} else {
		if($('.home-circularity-desktop .standard-video-iframe:visible')) {

			//$('.home-circularity-desktop .standard-video-iframe video').currentTime = 0;
			//$('.home-circularity-desktop .standard-video-iframe video').removeAttr("autoplay");
			//$('.home-circularity-desktop .standard-video-iframe video').trigger('pause');

		} else if ($('.home-circularity-desktop .standard-youtube-iframe:visible')) {

			var videoUrl = $('.home-circularity-desktop .standard-youtube-iframe').attr('src');
			$('.home-circularity-desktop .standard-youtube-iframe').attr('src', videoUrl + "&autoplay=1");

		} else if ($('.home-circularity-desktop .standard-vimeo-iframe:visible')) {

		}

	}
});