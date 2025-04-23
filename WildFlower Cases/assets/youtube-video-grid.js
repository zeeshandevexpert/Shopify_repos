(function () {
    const ytApi = 'AIzaSyASyyJxepjP3KVaN0ABZsKsqrIqz5v_hl0';
    const ytId = 'UCrJEE_jDM6sJCLHsxS679xA';
    const ytUsername = 'WildflowerCasesLA'
    const ytPlayListId = 'PLPjLuyXJdcYGRNVwjh8eIW13Bp2DHDiHu';
    const iframe = document.getElementById('youtube-iframe');
    var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    const closeModal = () => {
        iframe.setAttribute('src', '');
        document.body.classList.remove('show-video-modal', 'noscroll');
    };

    const youtubeModals = () => {

        const triggers = document.querySelectorAll('.js-trigger-video-modal');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                const videoId = this.getAttribute('data-youtube-id');
                const autoplay = `?autoplay=1`;
                const related_no = `&rel=0`;
                const src = `//www.youtube.com/embed/${videoId}${autoplay}${related_no}`;
                document.body.classList.add('show-video-modal', 'noscroll');
                iframe.setAttribute('src', src);
            });
        });


        const closeButtons = document.querySelectorAll('.close-video-modal');
        closeButtons.forEach(closeButton => {
            closeButton.addEventListener('click', function (e) {
                e.preventDefault();
                closeModal();
            });
        });

    };

    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${ytPlayListId}&key=${ytApi}`)
        .then(response => response.json())
        .then(data => {
            const ytVideos = data.items;
            const ytVideoGrid = document.querySelector('.youtube-video-grid');
            ytVideos.forEach(video => {
                var date = new Date(video.snippet.publishedAt);
                var month = months[date.getMonth()];
                var formattedDate = `${month} ${date.getDate()}, ${date.getFullYear()}`;
                const ytVideo = document.createElement('li');
                ytVideo.classList.add('yt-video', 'grid__item');
                ytVideo.innerHTML = `
                    <div class="media media--16-9">
                        <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
                    </div>
                    <a href="https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}" target="_blank" class="link--fill-parent js-trigger-video-modal" data-youtube-id="${video.snippet.resourceId.videoId}">
                        <span class="visually-hidden">${video.snippet.title}</span>    
                    </a>
                    <h4 class="h3 yt-video-title">${video.snippet.title}</h4>
                    <small class="yt-grid-date">${formattedDate}</small>
                `;
                ytVideoGrid.appendChild(ytVideo);


            });
            lazyImages();
            youtubeModals();
        })
        .catch(error => console.log(error));
})();