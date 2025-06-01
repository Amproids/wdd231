document.addEventListener('DOMContentLoaded', function() {
    const darkmode = document.querySelector('#dark-mode');
    const menuButton = document.querySelector('#menu-toggle');
    
    // Set mobile menu position dynamically
    function setMenuPosition() {
        const header = document.querySelector('header');
        const mobileMenu = document.querySelector('nav ul');
        
        if (header && mobileMenu) {
            const headerHeight = header.offsetHeight;
            mobileMenu.style.top = `${headerHeight}px`;
        }
    }
    
    // Set position on load and resize
    setMenuPosition();
    window.addEventListener('resize', setMenuPosition);
    
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
            
            // Update for SVG icons instead of Font Awesome
            if (document.body.classList.contains('menu-open')) {
                menuButton.src = 'images/xmark.svg'; // or whatever your close icon is called
                menuButton.alt = 'Close Menu';
            } else {
                menuButton.src = 'images/bars.svg';
                menuButton.alt = 'Menu';
            }
        });
    }
});