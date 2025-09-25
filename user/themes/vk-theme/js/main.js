import './components/_navigation.js';
import './components/_gallery.js';
import './components/_faq.js';
import './components/_products.js';
import './components/_productVariants.js';

import './components/_home--tombstone.js';
import 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js';
// window.Alpine = Alpine;
// Alpine.start();

document.addEventListener('DOMContentLoaded', () => {
    // ... (Twój istniejący kod: scrollLockManager, initGalleryModal, initMaterialCarousel)

    // --- NOWA LOGIKA KARUZELI "WYBÓR PRODUKTU" ---
    function initProductCarousel() {
        // Znajdź wszystkie kontenery karuzel produktowych na stronie
        const productCarousels = document.querySelectorAll('.js-product-carousel');

        // Uruchom logikę dla każdej znalezionej karuzeli osobno
        productCarousels.forEach(carouselContainer => {
            const productSlider = carouselContainer.querySelector('.product-carousel__slider');
            const productItems = carouselContainer.querySelectorAll('.product-carousel__item');
            const productPrevBtn = carouselContainer.querySelector('.product-carousel__btn--prev');
            const productNextBtn = carouselContainer.querySelector('.product-carousel__btn--next');
            const dotsNavContainer = carouselContainer.querySelector('.product-carousel__dots-nav');

            // Sprawdzenie, czy wszystkie elementy istnieją
            if (!productSlider || productItems.length === 0) {
                console.warn("Karuzela produktów nie ma slajdów lub kontenera slidera.", carouselContainer);
                return;
            }

            let currentProductIndex = 0;
            const totalProducts = productItems.length;

            // Ukryj przyciski, jeśli jest tylko jeden slajd
            if (totalProducts <= 1) {
                if (productPrevBtn) productPrevBtn.style.display = 'none';
                if (productNextBtn) productNextBtn.style.display = 'none';
                if (dotsNavContainer) dotsNavContainer.style.display = 'none';
                return;
            }

            // --- Generowanie kropek nawigacyjnych ---
            for (let i = 0; i < totalProducts; i++) {
                const dot = document.createElement('button');
                dot.classList.add('product-carousel__dot');
                dot.setAttribute('data-index', i);
                if (i === 0) {
                    dot.classList.add('is-active');
                }
                dotsNavContainer.appendChild(dot);
            }
            const dots = dotsNavContainer.querySelectorAll('.product-carousel__dot');

            // --- Funkcja aktualizująca widok karuzeli ---
            function updateProductCarousel() {
                // Przesuń slider
                productSlider.style.transform = `translateX(-${currentProductIndex * 100}%)`;

                // Zaktualizuj aktywną kropkę
                dots.forEach((dot, index) => {
                    dot.classList.toggle('is-active', index === currentProductIndex);
                });

                // Zaktualizuj stan przycisków (opcjonalne: wyłączanie na krańcach)
                // productPrevBtn.disabled = currentProductIndex === 0;
                // productNextBtn.disabled = currentProductIndex === totalProducts - 1;
            }

            // --- Obsługa zdarzeń ---
            if (productNextBtn) {
                productNextBtn.addEventListener('click', () => {
                    currentProductIndex = (currentProductIndex + 1) % totalProducts;
                    updateProductCarousel();
                });
            }

            if (productPrevBtn) {
                productPrevBtn.addEventListener('click', () => {
                    currentProductIndex = (currentProductIndex - 1 + totalProducts) % totalProducts;
                    updateProductCarousel();
                });
            }

            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    currentProductIndex = parseInt(e.target.dataset.index, 10);
                    updateProductCarousel();
                });
            });

            // Inicjalizacja
            updateProductCarousel();
        });
    }

    // --- INICJALIZACJA WSZYSTKICH KOMPONENTÓW ---
    initGalleryModal();
    initMaterialCarousel();
    initProductCarousel(); // <--- DODAJ TO WYWOŁANIE
});