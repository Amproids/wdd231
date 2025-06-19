document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('#menu-button');
    const navMenu = document.querySelector('#nav-menu');
    
    if (menuButton && navMenu) {
        menuButton.addEventListener('click', function() {
            // Toggle the menu visibility
            navMenu.classList.toggle('show');
            
            // Toggle the menu button appearance
            menuButton.classList.toggle('active');
            
            // Change the hamburger icon to X and back
            if (navMenu.classList.contains('show')) {
                menuButton.textContent = '✕';
                menuButton.setAttribute('aria-label', 'Close Menu');
            } else {
                menuButton.textContent = '☰';
                menuButton.setAttribute('aria-label', 'Toggle Menu');
            }
        });
        
        // Close menu when clicking on a nav link (for mobile)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('show');
                menuButton.classList.remove('active');
                menuButton.textContent = '☰';
                menuButton.setAttribute('aria-label', 'Toggle Menu');
            });
        });
        
        // Close menu when clicking outside of it
        document.addEventListener('click', function(event) {
            if (!menuButton.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('show');
                menuButton.classList.remove('active');
                menuButton.textContent = '☰';
                menuButton.setAttribute('aria-label', 'Toggle Menu');
            }
        });
    }
});