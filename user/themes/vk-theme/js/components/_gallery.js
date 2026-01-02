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

    // ====================================================================
    //  1. GALERIA MODAL (FULLSCREEN)
    // ====================================================================
    function initGalleryModal() {
        const modal = document.getElementById('fullscreen-modal');
        const modalImage = document.getElementById('fullscreen-image');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalAltText = document.getElementById('fullscreen-alt-text');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        const clickableImages = document.querySelectorAll('.product-img');
        if (!modal || !modalImage || !closeModalBtn || !modalAltText || !prevBtn || !nextBtn || clickableImages.length === 0) {
            return;
        }

        const galleryImageElements = Array.from(clickableImages).map(container => container.querySelector('img'));
        let currentIndex = 0;

        const showImage = (index) => {
            if (index < 0 || index >= galleryImageElements.length) return;
            const img = galleryImageElements[index];
            currentIndex = index;
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalAltText.textContent = img.alt;
            prevBtn.style.display = (currentIndex === 0) ? 'none' : 'block';
            nextBtn.style.display = (currentIndex === galleryImageElements.length - 1) ? 'none' : 'block';
        };

        const openModal = (startIndex) => {
            showImage(startIndex);
            modal.classList.remove('is-hidden');
            scrollLockManager.lock();
            requestAnimationFrame(() => modal.classList.remove('opacity-0'));
        };

        const closeModal = () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('is-hidden');
                scrollLockManager.unlock();
                modalImage.src = "";
                modalAltText.textContent = '';
            }, 300);
        };
        
        clickableImages.forEach((container, index) => {
            container.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                openModal(index);
            });
        });

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', e => {
            if (modal.classList.contains('is-hidden')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

    // ====================================================================
    //  2. KARUZELA MATERIAŁÓW
    // ====================================================================
    function initMaterialCarousel() {
        document.querySelectorAll('.js-material-carousel').forEach(carouselWrapper => {
            const container = carouselWrapper.querySelector('.carousel-main-container');
            if (!container) return;

            const uniqueId = container.id.split('-').pop();
            if (!uniqueId) return;
            
            const items = container.querySelectorAll('.carousel-item');
            const nameEl = document.getElementById(`materialName-${uniqueId}`);
            const descEl = document.getElementById(`materialDesc-${uniqueId}`);
            const prevBtn = carouselWrapper.querySelector('.carousel-btn[data-dir="prev"]');
            const nextBtn = carouselWrapper.querySelector('.carousel-btn[data-dir="next"]');

            if (!items.length || !nameEl || !descEl || !prevBtn || !nextBtn) return;

            if (items.length < 3) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                if (items.length > 0) {
                    const center = items[0];
                    nameEl.textContent = center.dataset.name;
                    descEl.textContent = center.dataset.desc;
                    items[0].classList.add('carousel-center', 'golden-img-border');
                }
                return;
            }

            let currentIndex = 0;
            let isAnimating = false;
            const total = items.length;

            function update() {
                isAnimating = true;
                const center = items[currentIndex];
                
                const priceStarsContainer = carouselWrapper.querySelector('.js-price-stars');
                const priceLabel = document.getElementById(`materialPriceLabel-${uniqueId}`);
                const availStarsContainer = carouselWrapper.querySelector('.js-availability-stars');

                nameEl.style.opacity = 0;
                descEl.style.opacity = 0;
                if (priceStarsContainer) priceStarsContainer.style.opacity = 0;
                if (priceLabel) priceLabel.style.opacity = 0;
                if (availStarsContainer) availStarsContainer.style.opacity = 0;

                setTimeout(() => {
                    nameEl.textContent = center.dataset.name;
                    descEl.textContent = center.dataset.desc;

                    const renderStars = (starContainer, levelValue) => {
                        if (!starContainer) return;
                        const level = parseInt(levelValue) || 1;
                        const iconPath = starContainer.dataset.icon;
                        starContainer.replaceChildren();

                        for (let i = 1; i <= 5; i++) {
                            const img = document.createElement('img');
                            img.src = iconPath;
                            img.className = 'h-6 w-auto';
                            img.style.opacity = i <= level ? '1' : '0.2'; 
                            img.alt = `Poziom ${i} z 5`;
                            starContainer.appendChild(img);
                        }
                        starContainer.style.opacity = 1;
                    };

                    renderStars(priceStarsContainer, center.dataset.price);
                    renderStars(availStarsContainer, center.dataset.availability || 5);

                    if (priceLabel) priceLabel.style.opacity = 1;
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
        });
    }

    // ====================================================================
    //  3. KARUZELA "NA ZAKŁADKĘ"
    // ====================================================================
    function initShuffleCarousel() {
    const carousel = document.querySelector('.js-shuffle-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.shuffle-carousel__track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.shuffle-carousel__btn--next');
    const prevButton = carousel.querySelector('.shuffle-carousel__btn--prev');
    if (slides.length === 0) return;

    let currentIndex = Math.floor(slides.length / 2);

    // Dodajemy klasę rozpoznającą karty w karuzeli
    slides.forEach(slide => {
        const card = slide.querySelector('.product-card');
        if (card) card.classList.add('product-card--in-carousel');
    });

    function updateCarousel() {
        const carouselWidth = carousel.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 32;
        const offset = (carouselWidth / 2) - (slideWidth / 2) - (currentIndex * (slideWidth + gap));
        track.style.transform = `translateX(${offset}px)`;

        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === currentIndex);
            slide.classList.toggle('golden-img-border', index === currentIndex);

            const card = slide.querySelector('.product-card');
            if (!card) return;

            // Zamykamy overlay na nieaktywnych kartach
            if (index !== currentIndex) {
                card.classList.remove('is-details-open');
            }
        });
    }

    function setupEventListeners() {
        slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                const card = slide.querySelector('.product-card');
                if (!card) return;

                // Kliknięcie w NIE-aktywny slajd → tylko przesuwa
                if (index !== currentIndex) {
                    currentIndex = index;
                    updateCarousel();
                    return;
                }

                // Kliknięcie w aktywny slajd → otwiera overlay
                if (e.target.closest('.product-card__main-content')) {
                    card.classList.add('is-details-open');
                }

                // Kliknięcie poza linkami zamyka overlay
                if (card.classList.contains('is-details-open')) {
                    if (!e.target.closest('a, .btn-primary, .btn-cta')) {
                        // nic — overlay zostaje otwarty
                    }
                }
            });
        });

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
    }

    setupEventListeners();
    updateCarousel();
    window.addEventListener('resize', updateCarousel);
}


    // ====================================================================
    //  4. KARUZELA "NA SKRÓTY"
    // ====================================================================
    function initShortcutCarousel() {
        const carouselContainer = document.querySelector('.js-shortcut-carousel-container');
        if (!carouselContainer) return;

        const track = carouselContainer.querySelector('.shortcut-carousel__track');
        const prevButton = carouselContainer.querySelector('.shortcut-button__left');
        const nextButton = carouselContainer.querySelector('.shortcut-button__right');
        const viewport = track.parentElement; 

        if (!track || !prevButton || !nextButton || !viewport) return;

        const updateNavButtons = () => {
            const tolerance = 1;
            const isAtStart = viewport.scrollLeft <= tolerance;
            const isAtEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - tolerance;

            prevButton.disabled = isAtStart;
            nextButton.disabled = isAtEnd;
            prevButton.style.opacity = isAtStart ? '0.5' : '1';
            nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        };

        nextButton.addEventListener('click', () => {
            const scrollAmount = viewport.clientWidth * 0.8;
            viewport.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevButton.addEventListener('click', () => {
            const scrollAmount = viewport.clientWidth * 0.8;
            viewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        viewport.addEventListener('scroll', updateNavButtons, { passive: true });
        new ResizeObserver(updateNavButtons).observe(viewport);
        updateNavButtons();
    }

    // ====================================================================
    //  5. OBSŁUGA KART PRODUKTÓW (NAKŁADKI)
    // ====================================================================
    function initOverlayProductCards() {
        const overlayCards = document.querySelectorAll('.product-card');
        if (!overlayCards.length) return;

        overlayCards.forEach(card => {
            const closeBtn = card.querySelector('.details-overlay__close-btn');
            const overlayLayer = card.querySelector('.product-card__details-overlay');
            const overlayContent = card.querySelector('.details-overlay__content');

            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('.btn-cta')) return;
                card.classList.add('is-details-open');
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    card.classList.remove('is-details-open');
                });
            }

            if (overlayLayer) {
                overlayLayer.addEventListener('click', (e) => {
                    if (e.target === overlayLayer) {
                        e.stopPropagation();
                        card.classList.remove('is-details-open');
                    }
                });
            }

            if (overlayContent) {
                overlayContent.addEventListener('click', (e) => e.stopPropagation());
            }

            const desc = card.querySelector('[class*="product-card__desc"]');
            if (desc) {
                desc.addEventListener('click', (e) => {
                    if (!e.target.closest('a')) {
                        e.stopPropagation();
                        card.classList.remove('is-details-open');
                    }
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.product-card')) {
                document.querySelectorAll('.product-card.is-details-open')
                    .forEach(openCard => openCard.classList.remove('is-details-open'));
            }
        });
    }

    // ====================================================================
    //  6. KARUZELA PRODUKTÓW
    // ====================================================================
    function initProductCarousel() {
        const productCarousels = document.querySelectorAll('.js-product-carousel');
        if (!productCarousels.length) return;

        productCarousels.forEach(carouselContainer => {
            const productSlider = carouselContainer.querySelector('.product-carousel__slider');
            const productItems = carouselContainer.querySelectorAll('.product-carousel__item');
            const productPrevBtn = carouselContainer.querySelector('.product-carousel__btn--prev');
            const productNextBtn = carouselContainer.querySelector('.product-carousel__btn--next');
            const dotsNavContainer = carouselContainer.querySelector('.product-carousel__dots-nav');

            if (!productSlider || productItems.length === 0) return;

            let currentProductIndex = 0;
            const totalProducts = productItems.length;

            if (totalProducts <= 1) {
                if (productPrevBtn) productPrevBtn.style.display = 'none';
                if (productNextBtn) productNextBtn.style.display = 'none';
                if (dotsNavContainer) dotsNavContainer.style.display = 'none';
                return;
            }

            for (let i = 0; i < totalProducts; i++) {
                const dot = document.createElement('button');
                dot.classList.add('product-carousel__dot');
                dot.dataset.index = i;
                if (i === 0) dot.classList.add('is-active');
                dotsNavContainer.appendChild(dot);
            }

            const dots = dotsNavContainer.querySelectorAll('.product-carousel__dot');

            function updateProductCarousel() {
                productSlider.style.transform = `translateX(-${currentProductIndex * 100}%)`;

                dots.forEach((dot, index) => {
                    dot.classList.toggle('is-active', index === currentProductIndex);
                });
            }

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

            updateProductCarousel();
        });
    }

    // ====================================================================
    //  7. BEZPIECZNA INICJALIZACJA WSZYSTKICH KOMPONENTÓW
    // ====================================================================
    if (document.querySelector('.product-img')) initGalleryModal();
    if (document.querySelector('.js-material-carousel')) initMaterialCarousel();
    if (document.querySelector('.js-shuffle-carousel')) initShuffleCarousel();
    if (document.querySelector('.js-shortcut-carousel-container')) initShortcutCarousel();
    if (document.querySelector('.product-card')) initOverlayProductCards();
    if (document.querySelector('.js-product-carousel')) initProductCarousel();
});
