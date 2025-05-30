document.addEventListener('DOMContentLoaded', function() {
    const darkmode = document.querySelector('#dark-mode');
    const menuButton = document.querySelector('#menu-toggle');
    
    if (darkmode) {
        darkmode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            darkmode.classList.toggle('dark-mode');
        });
    }
    
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            document.querySelector('nav ul').classList.toggle('show');
            document.body.classList.toggle('menu-open');
            menuButton.classList.toggle('menu-open');
            if (document.body.classList.contains('menu-open')) {
                menuButton.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuButton.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
});