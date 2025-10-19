document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-select:not(.select_bar)');
    const selectBar = document.querySelector('.select_bar');
    
    navItems.forEach((item) => {
        item.addEventListener('click', function() {
            const itemRect = item.getBoundingClientRect();
            const navRect = item.parentElement.getBoundingClientRect();
            
            selectBar.style.width = (itemRect.width + 20) + 'px';
            selectBar.style.left = (itemRect.left - navRect.left + 15) + 'px';
        });
    });
});