import Alpine from 'alpinejs'

window.Alpine = Alpine

Alpine.start()

// Plik: app.js lub podobny

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      // Przełącz klasę 'is-active' na menu i przycisku
      navMenu.classList.toggle('is-active');
      navToggle.classList.toggle('is-active');
    });
  }
});