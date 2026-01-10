window.addEventListener('scroll', () => {
    const video = document.querySelector('#section-main video');
    const scrolled = window.pageYOffset;
    if (video) {
        video.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
