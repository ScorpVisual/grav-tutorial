import './components/_home--tombstone.js';
import 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js';
window.Alpine = Alpine;
Alpine.start();

console.log('main.js loaded');

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-active');
        navToggle.classList.toggle('is-active');
    });
}

