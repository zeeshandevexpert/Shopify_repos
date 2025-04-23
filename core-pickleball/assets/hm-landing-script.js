 // document.addEventListener("DOMContentLoaded", function () {
 //        const body = document.body;

 //        // Check if the body has the specified ID
 //        if (body.id === "hm-landing-page") {
 //            // Add overflow-x: hidden to the <html> element
 //            document.documentElement.style.overflowX = "hidden";
 //        }
 //    });

$(document).ready(function () {
    // Initialize Slick Slider with mh-testimonial namespace and responsive settings
    $('.mh-testimonial-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        pauseOnHover: false,
        pauseOnFocus: false,
        infinite: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    });

    // Play button click event
    $('.mh-testimonial-play-button').on('click', function () {
        const video = $(this).siblings('.mh-testimonial-video')[0];
        const playButton = $(this);

        // Play the video and hide the play button
        video.play();
        playButton.fadeOut();

        // Pause the slider autoplay when video starts playing
        $('.mh-testimonial-slider').slick('slickPause');

        // Resume slider autoplay when video ends
        video.onended = function () {
            playButton.fadeIn();
            $('.mh-testimonial-slider').slick('slickPlay');
        };
    });

    // Video hover event to play the video
    $('.mh-testimonial-video').hover(
        function () {
            const video = this;
            const playButton = $(this).siblings('.mh-testimonial-play-button');

            // Hide play button and play video
            playButton.fadeOut();
            video.play();

            // Pause the slider autoplay when video starts playing
            $('.mh-testimonial-slider').slick('slickPause');
        },
        function () {
            const video = this;
            const playButton = $(this).siblings('.mh-testimonial-play-button');

            // Pause the video and show play button
            video.pause();
            playButton.fadeIn();

            // Resume slider autoplay when video is paused
            $('.mh-testimonial-slider').slick('slickPlay');
        }
    );

    // Stop previous video on dot click below 768px
    $(window).on('resize', function () {
        const windowWidth = $(window).width();

        if (windowWidth < 768) {
            $('.mh-testimonial-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                // Pause any currently playing video
                const currentVideo = $(slick.$slides[currentSlide]).find('.mh-testimonial-video')[0];
                if (currentVideo && !currentVideo.paused) {
                    currentVideo.pause();
                    $(currentVideo).siblings('.mh-testimonial-play-button').fadeIn();
                }
            });
        }
    }).trigger('resize');
});


$(document).ready(function () {
    $('.mh-testimonial-video').each(function () {
        this.load();
    });
});
