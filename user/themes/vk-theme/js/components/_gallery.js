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
    function initOverlapCarousel() {
    const carousel = document.querySelector('.js-overlap-carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.overlap-carousel__slide'));
    const nextButton = carousel.querySelector('.overlap-carousel__btn--next');
    const prevButton = carousel.querySelector('.overlap-carousel__btn--prev');
    const totalSlides = slides.length;
    let currentIndex = 0;

    if (totalSlides === 0) return;

    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.classList.remove('is-center', 'is-left', 'is-right', 'is-far-left', 'is-far-right', 'is-hidden');
            
            // AUTOMATYCZNE ZAMYKANIE NAKŁADKI przy zmianie slajdu
            const card = slide.querySelector('.product-card');
            if (card) card.classList.remove('is-details-open');

            let diff = (index - currentIndex + totalSlides) % totalSlides;
            if (diff > totalSlides / 2) diff -= totalSlides;

            switch (diff) {
                case 0: slide.classList.add('is-center'); break;
                case 1: slide.classList.add('is-right'); break;
                case -1: slide.classList.add('is-left'); break;
                case 2: slide.classList.add('is-far-right'); break;
                case -2: slide.classList.add('is-far-left'); break;
                default: slide.classList.add('is-hidden'); break;
            }
        });
    }
    
    function setupEventListeners() {
        slides.forEach((slide, index) => {
            // Przesuń karuzelę, klikając na boczny slajd
            slide.addEventListener('click', () => {
                if (index !== currentIndex) {
                    currentIndex = index;
                    updateCarousel();
                }
            });

            const card = slide.querySelector('.product-card');
            const expandBtn = slide.querySelector('.product-card__expand-btn');
            const closeBtn = slide.querySelector('.details-overlay__close-btn');

            // Otwórz nakładkę
            if (expandBtn && card) {
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Zapobiegaj przesunięciu karuzeli
                    card.classList.add('is-details-open');
                });
            }

            // Zamknij nakładkę
            if (closeBtn && card) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    card.classList.remove('is-details-open');
                });
            }
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }
    
    setupEventListeners();
    updateCarousel();
}

    // --- INICJALIZACJA WSZYSTKICH KOMPONENTÓW ---
    initGalleryModal();
    initMaterialCarousel();
    initOverlapCarousel();
});