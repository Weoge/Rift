document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-select:not(.select_bar)');
    const selectBar = document.querySelector('.select_bar');
    const sections = document.querySelectorAll('.section');
    
    function updateSelectBar(item) {
        const itemRect = item.getBoundingClientRect();
        const navRect = item.parentElement.getBoundingClientRect();
        selectBar.style.width = (itemRect.width + 20) + 'px';
        selectBar.style.left = (itemRect.left - navRect.left + 15) + 'px';
    }
    
    navItems.forEach((item) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            updateSelectBar(item);
            const targetId = item.getAttribute('href').substring(2);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
            }
        });
    });
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(item => {
            if (item.getAttribute('href') === '/#' + current) {
                updateSelectBar(item);
            }
        });
    });
});
