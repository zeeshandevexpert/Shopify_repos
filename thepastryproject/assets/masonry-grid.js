// function resizeMasonryItems() {
//     const masonry = document.querySelector('.masonry-group');
//     const items = masonry.querySelectorAll('.masonry-item');

//     items.forEach((item) => {
//         const rowSpan = Math.ceil(item.querySelector('img').clientHeight / 30);
//         item.style.gridRowEnd = `span ${rowSpan}`;
//     });
// }

// document.addEventListener('DOMContentLoaded', function () {
//     // resizeMasonryItems();

//     // Re-layout when all images are loaded
//     imagesLoaded(document.querySelector('.masonry-group'), function () {
//         const masonry = new Masonry('.masonry-group', {
//             itemSelector: '.masonry-item',
//             columnWidth: '.masonry-sizer',
//             gutter: 30,
//             percentPosition: true
//         });
//         window.addEventListener('resize', masonry.reloadItems());
//     });

//     // Re-layout when window is resized
//     // window.addEventListener('resize', resizeMasonryItems);
// });


document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.masonry-group');
    var msnry;

    imagesLoaded(grid, function () {
        msnry = new Masonry(grid, {
            itemSelector: '.masonry-item',
            columnWidth: '.masonry-sizer',
            gutter: 30,
            percentPosition: true,
        });
    });

    // Re-layout when window is resized
    window.addEventListener('resize', function () {
        if (msnry) {
            msnry.layout();
        }
    });
});