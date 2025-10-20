document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-select:not(.select_bar)');
    const selectBar = document.querySelector('.select_bar');
    
    navItems.forEach((item) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const itemRect = item.getBoundingClientRect();
            const navRect = item.parentElement.getBoundingClientRect();
            
            selectBar.style.width = (itemRect.width + 20) + 'px';
            selectBar.style.left = (itemRect.left - navRect.left + 15) + 'px';
            
            const targetId = item.getAttribute('href').substring(2);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const elementPosition = targetElement.offsetTop - 100;
                window.scrollTo({ top: elementPosition, behavior: 'smooth' });
            }
        });
    });
});