// Plik: product-variant-switcher.js

document.addEventListener('DOMContentLoaded', () => {
    // Znajdź główny kontener modułu na stronie
    const variantModule = document.getElementById('product-variants-module');
    
    // Jeśli moduł nie istnieje na tej stronie, zakończ działanie skryptu
    if (!variantModule) {
        return;
    }

    const FADE_DURATION = 300; // Czas w ms, musi być zgodny z przejściem w SCSS
    
    // --- Pobieranie danych i elementów UI ---
    let variantsData = [];
    try {
        variantsData = JSON.parse(variantModule.dataset.variants || '[]');
    } catch (e) {
        console.error('Błąd parsowania danych JSON dla wariantów produktu:', e);
        return; // Zakończ, jeśli dane są nieprawidłowe
    }

    if (!Array.isArray(variantsData) || variantsData.length === 0) {
        return; // Zakończ, jeśli nie ma wariantów
    }

    // Selektory używają teraz profesjonalnych, semantycznych nazw klas
    const variantCards = variantModule.querySelectorAll('.product-variant__card');
    const displayContainer = variantModule.querySelector('.product-variant__display');
    const variantImage = variantModule.querySelector('.product-variant__image');
    const variantTitle = variantModule.querySelector('.product-variant__title');
    const variantPrice = variantModule.querySelector('.product-variant__price');
    const variantDescription = variantModule.querySelector('.product-variant__description');

    /**
     * Aktualizuje wyświetlacz nowymi danymi dla wybranego wariantu.
     * @param {number} index - Indeks wariantu do wyświetlenia.
     */
    function updateDisplay(index) {
        const variant = variantsData[index];
        if (!variant) return;

        // 1. Rozpocznij animację zanikania (fade-out)
        displayContainer.classList.add('--is-fading');

        // 2. Po zakończeniu zanikania, podmień treść
        setTimeout(() => {
            // Preloading obrazu dla płynnego przejścia
            const img = new Image();
            img.onload = () => {
                // Podmień dane w DOM
                variantImage.src = variant.image || '';
                variantImage.alt = variant.alt_text || '';
                variantTitle.textContent = variant.title || '';
                variantPrice.textContent = variant.price || '';
                variantDescription.textContent = variant.full_desc || '';

                // 3. Usuń klasę zanikania, aby uruchomić animację pojawiania się (fade-in)
                displayContainer.classList.remove('--is-fading');
            };
            // Obsługa błędu, jeśli obraz się nie załaduje
            img.onerror = () => {
                console.error(`Nie można załadować obrazu: ${variant.image}`);
                // Mimo wszystko podmień resztę danych i pokaż kontener
                variantTitle.textContent = variant.title || '';
                variantPrice.textContent = variant.price || '';
                variantDescription.textContent = variant.full_desc || '';
                displayContainer.classList.remove('--is-fading');
            };
            img.src = variant.image || '';

        }, FADE_DURATION);
    }

    /**
     * Obsługuje aktywację karty wariantu (po kliknięciu lub naciśnięciu klawisza).
     * @param {HTMLElement} card - Element karty, która ma zostać aktywowana.
     */
    function activateCard(card) {
        // Zdejmij klasę aktywną ze wszystkich kart
        variantCards.forEach(c => {
            c.classList.remove('--is-active');
            c.setAttribute('aria-pressed', 'false');
        });
        
        // Dodaj klasę aktywną do wybranej karty
        card.classList.add('--is-active');
        card.setAttribute('aria-pressed', 'true');
        
        // Pobierz indeks i zaktualizuj wyświetlacz
        const index = Number(card.dataset.index);
        if (!isNaN(index)) {
            updateDisplay(index);
        }
    }

    // --- Inicjalizacja i obsługa zdarzeń ---
    variantCards.forEach(card => {
        card.addEventListener('click', () => activateCard(card));
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Zapobiegaj przewijaniu strony po naciśnięciu spacji
                activateCard(card);
            }
        });
    });
});