// components/_productCards.js

export function initOverlayProductCards() {
    const cards = document.querySelectorAll('.product-card');

    if (!cards.length) return;

    cards.forEach(card => {
        const overlay = card.querySelector('.product-card__details-overlay');
        const closeBtn = card.querySelector('.details-overlay__close-btn');
        const desc = card.querySelector('[data-role="desc"]');

        // --- OTWIERANIE ---
        card.addEventListener('click', (e) => {

            // Jeśli karta jest w shuffle-carousel → NIE otwieramy jej tutaj
            if (card.classList.contains('product-card--in-carousel')) {
                return;
            }

            if (e.target.closest('a') || e.target.closest('.btn-cta')) {
                return;
            }

            card.classList.add('is-details-open');
        });


        // --- ZAMYKANIE PRZYCISKIEM X ---
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('is-details-open');
            });
        }

        // --- ZAMYKANIE KLIKNIĘCIEM W TŁO ---
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    e.stopPropagation();
                    card.classList.remove('is-details-open');
                }
            });
        }

        // --- ZAMYKANIE KLIKNIĘCIEM W OPIS ---
        if (desc) {
            desc.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    e.stopPropagation();
                    card.classList.remove('is-details-open');
                }
            });
        }
    });

    // --- ZAMYKANIE KLIKNIĘCIEM POZA KARTĄ ---
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.product-card')) {
            document.querySelectorAll('.product-card.is-details-open')
                .forEach(card => card.classList.remove('is-details-open'));
        }
    });
}
