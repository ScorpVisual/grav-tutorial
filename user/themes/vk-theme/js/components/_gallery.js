document.addEventListener('DOMContentLoaded', () => {
    // --- ZUNIFIKOWANY MANAGER BLOKOWANIA PRZEWIJANIA ---
    const scrollLockManager = {
        lockCount: 0,
        body: document.body,
        lock() {
            this.lockCount++;
            if (!this.body.classList.contains('no-scroll')) {
                this.body.classList.add('no-scroll');
            }
        },
        unlock() {
            this.lockCount--;
            if (this.lockCount <= 0) {
                this.body.classList.remove('no-scroll');
                this.lockCount = 0;
            }
        }
    };

    // --- LOGIKA GALERII (MODAL) ---
    function initGalleryModal() {
        // ... (cała, oryginalna logika modala galerii bez zmian) ...
        const modal = document.getElementById('fullscreen-modal');
        const modalImage = document.getElementById('fullscreen-image');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalAltText = document.getElementById('fullscreen-alt-text');
        if (!modal || !modalImage || !closeModalBtn || !modalAltText) return;

        const openModal = (src, alt) => {
            modalImage.src = src;
            modalImage.alt = alt;
            modalAltText.textContent = alt;
            modal.classList.remove('is-hidden');
            scrollLockManager.lock();
            requestAnimationFrame(() => modal.classList.remove('opacity-0'));
        };

        const closeModal = () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('is-hidden');
                scrollLockManager.unlock();
                modalAltText.textContent = '';
            }, 300);
        };

        document.body.addEventListener('click', e => {
            const container = e.target.closest('.product-img');
            if (!container) return;
            const img = container.querySelector('img');
            if (img) openModal(img.src, img.alt);
        });

        if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if(modal) modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('is-hidden')) {
                closeModal();
            }
        });
    }

    // --- LOGIKA KARUZELI "WYBÓR MATERIAŁU" ---
    function initMaterialCarousel() {
        // ... (cała, oryginalna logika karuzeli materiałów bez zmian) ...
        const container = document.getElementById('carousel-container');
        if (!container) return;

        const items = container.querySelectorAll('.carousel-item');
        const nameEl = document.getElementById('materialName');
        const descEl = document.getElementById('materialDesc');
        const prevBtn = container.parentElement.querySelector('.carousel-btn[data-dir="prev"]');
        const nextBtn = container.parentElement.querySelector('.carousel-btn[data-dir="next"]');
        if (!items.length || !nameEl || !descEl || !prevBtn || !nextBtn) return;
        if (items.length < 3) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let isAnimating = false;
        const total = items.length;

        function update() {
            isAnimating = true;
            nameEl.style.opacity = 0;
            descEl.style.opacity = 0;

            setTimeout(() => {
                const center = items[currentIndex];
                nameEl.textContent = center.dataset.name;
                descEl.textContent = center.dataset.desc;
                nameEl.style.opacity = 1;
                descEl.style.opacity = 1;
            }, 250);

            const leftIdx = (currentIndex - 1 + total) % total;
            const rightIdx = (currentIndex + 1) % total;

            items.forEach((it, idx) => {
                it.classList.remove('carousel-center', 'carousel-left', 'carousel-right', 'carousel-hidden', 'golden-img-border');
                if (idx === currentIndex) it.classList.add('carousel-center', 'golden-img-border');
                else if (idx === leftIdx) it.classList.add('carousel-left');
                else if (idx === rightIdx) it.classList.add('carousel-right');
                else it.classList.add('carousel-hidden');
            });

            setTimeout(() => (isAnimating = false), 500);
        }

        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            currentIndex = (currentIndex + 1) % total;
            update();
        });
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            currentIndex = (currentIndex - 1 + total) % total;
            update();
        });

        update();
    }

    // --- NOWA, ZAAWANSOWANA LOGIKA KARUZELI 3D "WYBÓR PRODUKTU" ---
    // --- NOWA LOGIKA KARUZELI "NA ZAKŁADKĘ" ---
   // Zastąp initOverlapCarousel tą nową funkcją

function initShuffleCarousel() {
    const carousel = document.querySelector('.js-shuffle-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.shuffle-carousel__track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.shuffle-carousel__btn--next');
    const prevButton = carousel.querySelector('.shuffle-carousel__btn--prev');
    
    if (slides.length === 0) return;
    
    let currentIndex = Math.floor(slides.length / 2); // Zacznij od środkowej karty
    
    function updateCarousel() {
        const carouselWidth = carousel.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 32; // 32px to 2rem

        // Oblicz przesunięcie, aby wycentrować aktywny slajd
        const offset = (carouselWidth / 2) - (slideWidth / 2) - (currentIndex * (slideWidth + gap));
        track.style.transform = `translateX(${offset}px)`;

        // Zaktualizuj klasę 'is-active'
        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === currentIndex);
            slide.classList.toggle('golden-img-border', index === currentIndex);
            
            // Zamknij nakładkę, jeśli karta nie jest aktywna
            if (index !== currentIndex) {
                 const card = slide.querySelector('.product-card');
                 if (card) card.classList.remove('is-details-open');
            }
        });
    }
    
    function setupEventListeners() {
    slides.forEach((slide, index) => {

        // JEDEN GŁÓWNY LISTENER DLA KAŻDEGO SLAJDU
        slide.addEventListener('click', (e) => {
            
            // PRZYPADEK 1: Kliknięto na slajd, który NIE JEST w centrum.
            // Wtedy chcemy go wycentrować.
            if (index !== currentIndex) {
                currentIndex = index;
                updateCarousel();
                return; // Zakończ działanie, nie rób nic więcej.
            }

            // PRZYPADEK 2: Kliknięto na slajd, który JEST w centrum.
            // Teraz obsługujemy otwieranie/zamykanie nakładki.
            const card = slide.querySelector('.product-card');
            if (!card) return;

            const isDetailsOpen = card.classList.contains('is-details-open');

            // Jeśli nakładka jest OTWARTA...
            if (isDetailsOpen) {
                // ...to zamykamy ją, CHYBA ŻE kliknięto w link lub przycisk akcji.
                if (!e.target.closest('a, .btn-primary, .btn-cta')) {
                    card.classList.remove('is-details-open');
                }
            } 
            // Jeśli nakładka jest ZAMKNIĘTA...
            else {
                // ...to otwieramy ją po kliknięciu w główną treść.
                if (e.target.closest('.product-card__main-content')) {
                    card.classList.add('is-details-open');
                }
            }
        });
    });

    // Przyciski nawigacyjne karuzeli (bez zmian)
    if(nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }

    if(prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }
}
    
    // Inicjalizacja
    setupEventListeners();
    updateCarousel(); // Ustaw pozycję początkową
    
    // Przelicz pozycje przy zmianie rozmiaru okna
    window.addEventListener('resize', updateCarousel);
}

    // --- INICJALIZACJA WSZYSTKICH KOMPONENTÓW ---
    initGalleryModal();
    initMaterialCarousel();
    initShuffleCarousel();
});