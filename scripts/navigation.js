const hamburgerMenuButton = document.getElementById('menu-button');
const navigationMenu = document.getElementById('nav-menu');

hamburgerMenuButton.addEventListener('click', () => {
    navigationMenu.classList.toggle('open');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navigationMenu.classList.remove('open');
    }
});

window.addEventListener('click', (event) => {
    if (!navigationMenu.contains(event.target) && !hamburgerMenuButton.contains(event.target)) {
        navigationMenu.classList.remove('open');
    }
});

