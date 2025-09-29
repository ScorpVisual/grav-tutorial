document.addEventListener('DOMContentLoaded', () => {
    // --- ZUNIFIKOWANY MANAGER BLOKOWANIA PRZEWIJANIA (bez zmian) ---
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
    //  POPRAWIONY SKRYPT MODALA GALERII
    // ====================================================================
    function initGalleryModal() {
        const modal = document.getElementById('fullscreen-modal');
        const modalImage = document.getElementById('fullscreen-image');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalAltText = document.getElementById('fullscreen-alt-text');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        // Znajdź WSZYSTKIE klikalne obrazki galerii na stronie
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
        
        // NOWA, LEPSZA LOGIKA: Listener podpięty bezpośrednio do każdego obrazka
        clickableImages.forEach((container, index) => {
            container.addEventListener('click', (event) => {
                // Zapobiegamy otwieraniu się nakładki karty, jeśli na nią klikamy
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
    //  POPRAWIONY SKRYPT KART PRODUKTÓW
    // ====================================================================
    function initProductCards() {
        const allProductCards = document.querySelectorAll('.product-card');

        allProductCards.forEach(card => {
            const expandButton = card.querySelector('.product-card__expand-btn');
            const closeButton = card.querySelector('.details-overlay__close-btn');
            const overlay = card.querySelector('.product-card__details-overlay');

            if (!expandButton || !closeButton || !overlay) return;

            expandButton.addEventListener('click', (event) => {
                event.stopPropagation();
                card.classList.add('is-details-open');
            });

            closeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                card.classList.remove('is-details-open');
            });

            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) { // Poprawiona logika!
                    card.classList.remove('is-details-open');
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.product-card')) {
                document.querySelectorAll('.product-card.is-details-open').forEach(card => {
                    card.classList.remove('is-details-open');
                });
            }
        });
    }

    // --- LOGIKA KARUZELI "WYBÓR MATERIAŁU" ---
   // --- LOGIKA KARUZELI "WYBÓR MATERIAŁU" (WERSJA DZIAŁAJĄCA DLA WIELU INSTANCJI) ---
function initMaterialCarousel() {
    // 1. Znajdź WSZYSTKIE kontenery karuzel na stronie
    document.querySelectorAll('.js-material-carousel').forEach(carouselWrapper => {
        // 2. Dla każdej karuzeli z osobna, znajdź jej elementy wewnętrzne
        const container = carouselWrapper.querySelector('.carousel-main-container');
        if (!container) return;

        // Wyciągamy unikalne ID, żeby znaleźć powiązane elementy info
        const uniqueId = container.id.split('-').pop();
        if (!uniqueId) return;
        
        const items = container.querySelectorAll('.carousel-item');
        const nameEl = document.getElementById(`materialName-${uniqueId}`);
        const descEl = document.getElementById(`materialDesc-${uniqueId}`);
        const prevBtn = carouselWrapper.querySelector('.carousel-btn[data-dir="prev"]');
        const nextBtn = carouselWrapper.querySelector('.carousel-btn[data-dir="next"]');

        // Sprawdzamy, czy ta konkretna instancja ma wszystko, czego potrzebuje
        if (!items.length || !nameEl || !descEl || !prevBtn || !nextBtn) return;

        // Ukryj przyciski, jeśli nie ma wystarczająco slajdów
        if (items.length < 3) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            // Ale nadal zainicjuj stan początkowy dla jednego elementu
            if (items.length > 0) {
                 const center = items[0];
                 nameEl.textContent = center.dataset.name;
                 descEl.textContent = center.dataset.desc;
                 items[0].classList.add('carousel-center', 'golden-img-border');
            }
            return;
        }

        // 3. Cała logika (stan, funkcje, listenery) jest "zamknięta" w tej pętli
        //    i dotyczy tylko jednej karuzeli. Dzięki temu nie ma konfliktów.
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

        // Zainicjuj stan początkowy dla tej karuzeli
        update();
    });
}

    // --- LOGIKA KARUZELI "NA ZAKŁADKĘ" ---
    function initShuffleCarousel() {
        const carousel = document.querySelector('.js-shuffle-carousel');
        if (!carousel) return;
        const track = carousel.querySelector('.shuffle-carousel__track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.shuffle-carousel__btn--next');
        const prevButton = carousel.querySelector('.shuffle-carousel__btn--prev');
        if (slides.length === 0) return;
        let currentIndex = Math.floor(slides.length / 2);

        function updateCarousel() {
            const carouselWidth = carousel.offsetWidth;
            const slideWidth = slides[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(track).gap) || 32;
            const offset = (carouselWidth / 2) - (slideWidth / 2) - (currentIndex * (slideWidth + gap));
            track.style.transform = `translateX(${offset}px)`;
            slides.forEach((slide, index) => {
                slide.classList.toggle('is-active', index === currentIndex);
                slide.classList.toggle('golden-img-border', index === currentIndex);
                if (index !== currentIndex) {
                    const card = slide.querySelector('.product-card');
                    if (card) card.classList.remove('is-details-open');
                }
            });
        }

        function setupEventListeners() {
            slides.forEach((slide, index) => {
                slide.addEventListener('click', (e) => {
                    if (index !== currentIndex) {
                        currentIndex = index;
                        updateCarousel();
                        return;
                    }
                    const card = slide.querySelector('.product-card');
                    if (!card) return;
                    const isDetailsOpen = card.classList.contains('is-details-open');
                    if (isDetailsOpen) {
                        if (!e.target.closest('a, .btn-primary, .btn-cta')) {
                            card.classList.remove('is-details-open');
                        }
                    } else {
                        if (e.target.closest('.product-card__main-content')) {
                            card.classList.add('is-details-open');
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

    // --- POPRAWIONA LOGIKA KARUZELI "NA SKRÓTY" ---
    function initShortcutCarousel() {
        const carouselContainer = document.querySelector('.js-shortcut-carousel-container');
        if (!carouselContainer) return;

        const track = carouselContainer.querySelector('.shortcut-carousel__track');
        const prevButton = carouselContainer.querySelector('.shortcut-button__left');
        const nextButton = carouselContainer.querySelector('.shortcut-button__right');
        const viewport = track.parentElement; // Element z overflow:hidden

        if (!track || !prevButton || !nextButton || !viewport) return;

        const updateNavButtons = () => {
            const tolerance = 1;
            // Sprawdzamy pozycję przewinięcia 'viewportu', a nie 'tracka'
            const isAtStart = viewport.scrollLeft <= tolerance;
            const isAtEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - tolerance;

            prevButton.disabled = isAtStart;
            nextButton.disabled = isAtEnd;
            prevButton.style.opacity = isAtStart ? '0.5' : '1';
            nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        };

        nextButton.addEventListener('click', () => {
            const scrollAmount = viewport.clientWidth * 0.8;
            // Przewijamy 'viewport', a nie 'track'
            viewport.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevButton.addEventListener('click', () => {
            const scrollAmount = viewport.clientWidth * 0.8;
            // Przewijamy 'viewport', a nie 'track'
            viewport.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Nasłuchujemy na zdarzenie 'scroll' na 'viewporcie'
        viewport.addEventListener('scroll', updateNavButtons, { passive: true });
        new ResizeObserver(updateNavButtons).observe(viewport);

        updateNavButtons();
    }

// ====================================================================
    //  SKRYPT 3: obsługa kart produktów (otwieranie i zamykanie nakładki)
    // ====================================================================
    
    /**
 * Inicjalizuje interaktywność dla wszystkich kart produktów (.product-card).
 * Umożliwia otwieranie i zamykanie nakładki ze szczegółami.
 */
function initProductCards() {
  const allProductCards = document.querySelectorAll('.product-card');

  allProductCards.forEach(card => {
    const expandButton = card.querySelector('.product-card__expand-btn');
    const closeButton = card.querySelector('.details-overlay__close-btn');
    const overlay = card.querySelector('.product-card__details-overlay');

    if (!expandButton || !closeButton || !overlay) return;

    // Otwieranie karty
    expandButton.addEventListener('click', (event) => {
      event.stopPropagation();
      card.classList.add('is-details-open');
    });

    // Zamykanie przez przycisk "X"
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      card.classList.remove('is-details-open');
    });

    // Zamykanie przez kliknięcie w overlay (dowolne miejsce)
    overlay.addEventListener('click', () => {
      card.classList.remove('is-details-open');
    });
  });

  // Zamykanie przez kliknięcie poza otwartą kartą
  document.addEventListener('click', (event) => {
    const openCards = document.querySelectorAll('.product-card.is-details-open');

    openCards.forEach(card => {
      if (!card.contains(event.target)) {
        card.classList.remove('is-details-open');
      }
    });
  });
}



  

    // --- INICJALIZACJA WSZYSTKICH KOMPONENTÓW ---
    initGalleryModal();
    initMaterialCarousel();
    initShuffleCarousel();
    initShortcutCarousel();
    initProductCards(); 
});

// document.addEventListener('DOMContentLoaded', () => {
//     // --- ZUNIFIKOWANY MANAGER BLOKOWANIA PRZEWIJANIA ---
//     const scrollLockManager = {
//         lockCount: 0,
//         body: document.body,
//         lock() {
//             this.lockCount++;
//             if (!this.body.classList.contains('no-scroll')) {
//                 this.body.classList.add('no-scroll');
//             }
//         },
//         unlock() {
//             this.lockCount--;
//             if (this.lockCount <= 0) {
//                 this.body.classList.remove('no-scroll');
//                 this.lockCount = 0;
//             }
//         }
//     };

//     function initGalleryModal() {
//     // --- Pobieranie elementów DOM ---
//     const modal = document.getElementById('fullscreen-modal');
//     const modalImage = document.getElementById('fullscreen-image');
//     const closeModalBtn = document.getElementById('close-modal-btn');
//     const modalAltText = document.getElementById('fullscreen-alt-text');
//     const prevBtn = document.getElementById('prev-btn'); // Nowy przycisk
//     const nextBtn = document.getElementById('next-btn'); // Nowy przycisk

//     if (!modal || !modalImage || !closeModalBtn || !modalAltText || !prevBtn || !nextBtn) return;

//     // --- Stan galerii ---
//     const galleryImages = document.querySelectorAll('.product-img img'); // Pobieramy wszystkie obrazki
//     let currentIndex = 0; // Indeks aktualnie wyświetlanego obrazka

//     // --- Funkcja do wyświetlania obrazka na podstawie indeksu ---
//     const showImage = (index) => {
//         if (index < 0 || index >= galleryImages.length) return;

//         const img = galleryImages[index];
//         currentIndex = index; // Aktualizujemy bieżący indeks

//         // Ustawiamy źródło i tekst alternatywny
//         modalImage.src = img.src;
//         modalImage.alt = img.alt;
//         modalAltText.textContent = img.alt;

//         // Pokazujemy/ukrywamy przyciski nawigacji na krańcach galerii
//         prevBtn.style.display = (currentIndex === 0) ? 'none' : 'block';
//         nextBtn.style.display = (currentIndex === galleryImages.length - 1) ? 'none' : 'block';
//     };

//     // --- Funkcje otwierania/zamykania modala ---
//     const openModal = (startIndex) => {
//         showImage(startIndex); // Wyświetlamy obrazek o podanym indeksie
//         modal.classList.remove('is-hidden');
//         // scrollLockManager.lock(); // Odkomentuj, jeśli używasz
//         requestAnimationFrame(() => modal.classList.remove('opacity-0'));
//     };

//     const closeModal = () => {
//         modal.classList.add('opacity-0');
//         setTimeout(() => {
//             modal.classList.add('is-hidden');
//             // scrollLockManager.unlock(); // Odkomentuj, jeśli używasz
//             modalImage.src = ""; // Czyścimy src, by uniknąć mignięcia starego obrazka
//             modalAltText.textContent = '';
//         }, 300);
//     };
    
//     // --- Nawigacja ---
//     const showPrev = () => showImage(currentIndex - 1);
//     const showNext = () => showImage(currentIndex + 1);

//     // --- Listenery zdarzeń ---

//     // Otwieranie modala po kliknięciu na obrazek
//     document.body.addEventListener('click', e => {
//         const container = e.target.closest('.product-img');
//         if (!container) return;

//         const img = container.querySelector('img');
//         if (img) {
//             // Znajdujemy indeks klikniętego obrazka w naszej liście
//             const clickedIndex = Array.from(galleryImages).findIndex(item => item.src === img.src);
//             if (clickedIndex !== -1) {
//                 openModal(clickedIndex);
//             }
//         }
//     });

//     // Zamykanie
//     if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
//     if (modal) modal.addEventListener('click', e => {
//         // Zamykaj tylko, gdy kliknięto tło (a nie przyciski nawigacji)
//         if (e.target === modal) closeModal();
//     });

//     // Nawigacja przyciskami
//     prevBtn.addEventListener('click', showPrev);
//     nextBtn.addEventListener('click', showNext);
    
//     // Nawigacja klawiaturą (strzałki i Escape)
//     document.addEventListener('keydown', e => {
//         if (modal.classList.contains('is-hidden')) return; // Nie rób nic, jeśli modal jest ukryty

//         if (e.key === 'Escape') closeModal();
//         if (e.key === 'ArrowLeft') showPrev();
//         if (e.key === 'ArrowRight') showNext();
//     });
// }
//     // --- LOGIKA KARUZELI "WYBÓR MATERIAŁU" ---
//     function initMaterialCarousel() {
//         // ... (cała, oryginalna logika karuzeli materiałów bez zmian) ...
//         const container = document.getElementById('carousel-container');
//         if (!container) return;

//         const items = container.querySelectorAll('.carousel-item');
//         const nameEl = document.getElementById('materialName');
//         const descEl = document.getElementById('materialDesc');
//         const prevBtn = container.parentElement.querySelector('.carousel-btn[data-dir="prev"]');
//         const nextBtn = container.parentElement.querySelector('.carousel-btn[data-dir="next"]');
//         if (!items.length || !nameEl || !descEl || !prevBtn || !nextBtn) return;
//         if (items.length < 3) {
//             prevBtn.style.display = 'none';
//             nextBtn.style.display = 'none';
//             return;
//         }

//         let currentIndex = 0;
//         let isAnimating = false;
//         const total = items.length;

//         function update() {
//             isAnimating = true;
//             nameEl.style.opacity = 0;
//             descEl.style.opacity = 0;

//             setTimeout(() => {
//                 const center = items[currentIndex];
//                 nameEl.textContent = center.dataset.name;
//                 descEl.textContent = center.dataset.desc;
//                 nameEl.style.opacity = 1;
//                 descEl.style.opacity = 1;
//             }, 250);

//             const leftIdx = (currentIndex - 1 + total) % total;
//             const rightIdx = (currentIndex + 1) % total;

//             items.forEach((it, idx) => {
//                 it.classList.remove('carousel-center', 'carousel-left', 'carousel-right', 'carousel-hidden', 'golden-img-border');
//                 if (idx === currentIndex) it.classList.add('carousel-center', 'golden-img-border');
//                 else if (idx === leftIdx) it.classList.add('carousel-left');
//                 else if (idx === rightIdx) it.classList.add('carousel-right');
//                 else it.classList.add('carousel-hidden');
//             });

//             setTimeout(() => (isAnimating = false), 500);
//         }

//         nextBtn.addEventListener('click', () => {
//             if (isAnimating) return;
//             currentIndex = (currentIndex + 1) % total;
//             update();
//         });
//         prevBtn.addEventListener('click', () => {
//             if (isAnimating) return;
//             currentIndex = (currentIndex - 1 + total) % total;
//             update();
//         });

//         update();
//     }

//     // --- NOWA, ZAAWANSOWANA LOGIKA KARUZELI 3D "WYBÓR PRODUKTU" ---
//     // --- NOWA LOGIKA KARUZELI "NA ZAKŁADKĘ" ---
//    // Zastąp initOverlapCarousel tą nową funkcją

// function initShuffleCarousel() {
//     const carousel = document.querySelector('.js-shuffle-carousel');
//     if (!carousel) return;

//     const track = carousel.querySelector('.shuffle-carousel__track');
//     const slides = Array.from(track.children);
//     const nextButton = carousel.querySelector('.shuffle-carousel__btn--next');
//     const prevButton = carousel.querySelector('.shuffle-carousel__btn--prev');
    
//     if (slides.length === 0) return;
    
//     let currentIndex = Math.floor(slides.length / 2); // Zacznij od środkowej karty
    
//     function updateCarousel() {
//         const carouselWidth = carousel.offsetWidth;
//         const slideWidth = slides[0].offsetWidth;
//         const gap = parseInt(window.getComputedStyle(track).gap) || 32; // 32px to 2rem

//         // Oblicz przesunięcie, aby wycentrować aktywny slajd
//         const offset = (carouselWidth / 2) - (slideWidth / 2) - (currentIndex * (slideWidth + gap));
//         track.style.transform = `translateX(${offset}px)`;

//         // Zaktualizuj klasę 'is-active'
//         slides.forEach((slide, index) => {
//             slide.classList.toggle('is-active', index === currentIndex);
//             slide.classList.toggle('golden-img-border', index === currentIndex);
            
//             // Zamknij nakładkę, jeśli karta nie jest aktywna
//             if (index !== currentIndex) {
//                  const card = slide.querySelector('.product-card');
//                  if (card) card.classList.remove('is-details-open');
//             }
//         });
//     }
    
//     function setupEventListeners() {
//     slides.forEach((slide, index) => {

//         // JEDEN GŁÓWNY LISTENER DLA KAŻDEGO SLAJDU
//         slide.addEventListener('click', (e) => {
            
//             // PRZYPADEK 1: Kliknięto na slajd, który NIE JEST w centrum.
//             // Wtedy chcemy go wycentrować.
//             if (index !== currentIndex) {
//                 currentIndex = index;
//                 updateCarousel();
//                 return; // Zakończ działanie, nie rób nic więcej.
//             }

//             // PRZYPADEK 2: Kliknięto na slajd, który JEST w centrum.
//             // Teraz obsługujemy otwieranie/zamykanie nakładki.
//             const card = slide.querySelector('.product-card');
//             if (!card) return;

//             const isDetailsOpen = card.classList.contains('is-details-open');

//             // Jeśli nakładka jest OTWARTA...
//             if (isDetailsOpen) {
//                 // ...to zamykamy ją, CHYBA ŻE kliknięto w link lub przycisk akcji.
//                 if (!e.target.closest('a, .btn-primary, .btn-cta')) {
//                     card.classList.remove('is-details-open');
//                 }
//             } 
//             // Jeśli nakładka jest ZAMKNIĘTA...
//             else {
//                 // ...to otwieramy ją po kliknięciu w główną treść.
//                 if (e.target.closest('.product-card__main-content')) {
//                     card.classList.add('is-details-open');
//                 }
//             }
//         });
//     });

//     // Przyciski nawigacyjne karuzeli (bez zmian)
//     if(nextButton) {
//         nextButton.addEventListener('click', () => {
//             currentIndex = (currentIndex + 1) % slides.length;
//             updateCarousel();
//         });
//     }

//     if(prevButton) {
//         prevButton.addEventListener('click', () => {
//             currentIndex = (currentIndex - 1 + slides.length) % slides.length;
//             updateCarousel();
//         });
//     }
// }
    
//     // Inicjalizacja
//     setupEventListeners();
//     updateCarousel(); // Ustaw pozycję początkową
    
//     // Przelicz pozycje przy zmianie rozmiaru okna
//     window.addEventListener('resize', updateCarousel);
// }

//     // --- INICJALIZACJA WSZYSTKICH KOMPONENTÓW ---
//     initGalleryModal();
//     initMaterialCarousel();
//     initShuffleCarousel();
// });