// Plik: content-switcher.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Znajdź WSZYSTKIE moduły przełącznika treści na stronie
    const switcherModules = document.querySelectorAll('.js-content-switcher');

    // 2. Jeśli nie ma żadnych modułów, zakończ działanie skryptu
    if (switcherModules.length === 0) {
        return;
    }

    // 3. Dla każdego znalezionego modułu, uruchom osobną logikę
    switcherModules.forEach((module) => {
        const FADE_DURATION = 100; // Czas w ms, musi być zgodny z SCSS
        let contentData = [];

        // --- Pobieranie danych i elementów UI dla TEGO konkretnego modułu ---
        try {
            // Używamy teraz generycznego atrybutu 'data-content-items'
            contentData = JSON.parse(module.dataset.contentItems || '[]');
        } catch (e) {
            console.error('Błąd parsowania danych JSON dla modułu:', e, module);
            return; // Przejdź do następnego modułu w pętli
        }

        if (!Array.isArray(contentData) || contentData.length === 0) {
            return; // Przejdź do następnego modułu
        }

        // Selektory szukają klas tylko wewnątrz bieżącego modułu
        const contentCards = module.querySelectorAll('.content-switcher__card');
        const displayContainer = module.querySelector('.content-switcher__display');
        const contentImage = module.querySelector('.content-switcher__image');
        const contentTitle = module.querySelector('.content-switcher__title');
        const contentPrice = module.querySelector('.content-switcher__price');
        const contentDescription = module.querySelector('.content-switcher__description');
        
        // Sprawdzenie, czy wszystkie elementy istnieją w tym module
        if (!displayContainer || !contentImage || !contentTitle || !contentPrice || !contentDescription) {
            console.error("W module brakuje jednego lub więcej wymaganych elementów (np. __display, __image, etc.)", module);
            return;
        }

        /**
         * Aktualizuje wyświetlacz nowymi danymi dla wybranego elementu.
         */
        function updateDisplay(index) {
            const item = contentData[index];
            if (!item) return;

            displayContainer.classList.add('--is-fading');

            setTimeout(() => {
                const img = new Image();
                img.onload = () => {
                    contentImage.src = item.image || '';
                    contentImage.alt = item.alt_text || '';
                    contentTitle.textContent = item.title || '';
                    contentPrice.textContent = item.price || '';
                    contentDescription.textContent = item.full_desc || '';
                    displayContainer.classList.remove('--is-fading');
                };
                img.onerror = () => {
                    console.error(`Nie można załadować obrazu: ${item.image}`);
                    contentTitle.textContent = item.title || '';
                    contentPrice.textContent = item.price || '';
                    contentDescription.textContent = item.full_desc || '';
                    displayContainer.classList.remove('--is-fading');
                };
                img.src = item.image || '';
            }, FADE_DURATION);
        }

        /**
         * Obsługuje aktywację karty.
         */
        function activateCard(card) {
            contentCards.forEach(c => {
                c.classList.remove('--is-active');
                c.setAttribute('aria-pressed', 'false');
            });
            card.classList.add('--is-active');
            card.setAttribute('aria-pressed', 'true');
            const index = Number(card.dataset.index);
            if (!isNaN(index)) {
                updateDisplay(index);
            }
        }

        // --- Inicjalizacja i obsługa zdarzeń dla TEGO modułu ---
        contentCards.forEach(card => {
            card.addEventListener('click', () => activateCard(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateCard(card);
                }
            });
        });
    });

     const showcaseModules = document.querySelectorAll('.js-product-showcase');

    showcaseModules.forEach(module => {
        const FADE_DURATION = 100;
        let productsData = [];

        try {
            productsData = JSON.parse(module.dataset.products || '[]');
        } catch (e) {
            console.error('Błąd parsowania danych JSON dla product-showcase:', e);
            return;
        }

        if (productsData.length === 0) return;

        // --- Pobieranie elementów UI ---
        const variantItems = module.querySelectorAll('.product-showcase__variant-item');
        const carousel = module.querySelector('.product-showcase__carousel');
        const carouselItems = module.querySelectorAll('.product-showcase__carousel-item');
        const nextBtn = module.querySelector('.product-showcase__nav-btn--next');
        const prevBtn = module.querySelector('.product-showcase__nav-btn--prev');
        
        const titleEl = module.querySelector('.product-showcase__title');
        const priceEl = module.querySelector('.product-showcase__price');
        const descEl = module.querySelector('.product-showcase__description');
        const infoElements = [titleEl, module.querySelector('.product-showcase__price-wrapper'), descEl];

        let currentIndex = 0;
        const totalItems = productsData.length;
        let isAnimating = false;

        /**
         * Centralna funkcja aktualizująca cały komponent do wybranego indeksu.
         */
        function updateShowcase(index, isInstant = false) {
            if (isAnimating && !isInstant) return;
            isAnimating = true;

            currentIndex = index;

            // 1. Aktualizacja listy wariantów
            variantItems.forEach((btn, i) => {
                btn.classList.toggle('--is-active', i === currentIndex);
            });

            // 2. Aktualizacja karuzeli
            const slideWidth = carouselItems[0].parentElement.offsetWidth;
            const offset = -currentIndex * slideWidth;
            carousel.style.transform = `translateX(${offset}px)`;

            carouselItems.forEach((item, i) => {
                item.classList.toggle('--is-center', i === currentIndex);
            });
            
            // 3. Aktualizacja karty informacyjnej z animacją
            infoElements.forEach(el => el.style.opacity = '0');

            setTimeout(() => {
                const product = productsData[currentIndex];
                if (product) {
                    titleEl.textContent = product.title;
                    priceEl.textContent = product.price;
                    descEl.textContent = product.full_desc;
                }
                infoElements.forEach(el => el.style.opacity = '1');
            }, isInstant ? 0 : FADE_DURATION);
            
            // Zwolnienie blokady animacji
            setTimeout(() => {
                isAnimating = false;
            }, isInstant ? 50 : 500);
        }

        // --- Podpięcie zdarzeń ---
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % totalItems;
            updateShowcase(newIndex);
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateShowcase(newIndex);
        });

        variantItems.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index, 10);
                updateShowcase(index);
            });
        });

        // Inicjalizacja komponentu
        updateShowcase(0, true);
    });
});