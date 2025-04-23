(function(d) {
    const seoTabHeadings = d.querySelectorAll('.seo-tabs__heading');
    const seoTabContents = d.querySelectorAll('.seo-tabs__tab');
    seoTabHeadings.forEach((heading) => {
        heading.addEventListener('click', (e) => {
            seoTabContents.forEach((tab) => {
                tab.setAttribute('hidden', '');
            });
            seoTabHeadings.forEach((heading) => {
                heading.setAttribute('aria-expanded','false');
            });
            const tab = e.target.getAttribute('aria-controls');
            const tabContent = d.getElementById(tab);
            if(heading.getAttribute('aria-expanded') === 'false') {
                tabContent.removeAttribute('hidden');
                tabContent.setAttribute('aria-hidden', 'false');
                e.target.setAttribute('aria-expanded', 'true');
            } else {
                tabContent.setAttribute('hidden', '');
                tabContent.setAttribute('aria-hidden', 'true');
                e.target.setAttribute('aria-expanded', 'false');
            }
        });
    });
})(document);