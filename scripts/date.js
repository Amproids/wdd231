const year = document.getElementById('current-year');
const lastModified = document.getElementById('lastModified');
year.textContent = new Date().getFullYear();
lastModified.textContent = document.lastModified;