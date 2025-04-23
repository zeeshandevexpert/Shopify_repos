window.addEventListener('DOMContentLoaded', function() {
    const featuredRowItems = document.querySelectorAll('.featured-row__item');
    featuredRowItems.forEach(function(item) {
        const video = item.querySelector('video');
        const playButton = item.querySelector('.media--play-pause');
        playButton.addEventListener('click',(event) => {
            event.preventDefault();
            if (video.paused) {
                video.play();
                item.classList.add('video-playing');
                playButton.classList.add('is-playing');
            } else {
                video.pause();
                item.classList.remove('video-playing');
                playButton.classList.remove('is-playing');
            }
        });
    });
});