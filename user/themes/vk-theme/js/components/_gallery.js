document.addEventListener('DOMContentLoaded', () => {

    // --- ZUNIFIKOWANY MANAGER BLOKOWANIA PRZEWIJANIA (BEZ ZMIAN) ---
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

    // --- LOGIKA GALERII (ZAKTUALIZOWANA) ---
    const imageContainers = document.querySelectorAll('.product-img');
    const modal = document.getElementById('fullscreen-modal');
    const modalImage = document.getElementById('fullscreen-image');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // --- NOWOŚĆ: Pobieramy element, w którym wyświetlimy podpis ---
    const modalAltText = document.getElementById('fullscreen-alt-text');

    if (modal && modalImage && closeModalBtn && modalAltText) {
        
        // --- ZMIANA: Funkcja openModal przyjmuje teraz dwa argumenty: źródło i tekst alternatywny ---
        const openModal = (imgSrc, imgAlt) => {
            modalImage.src = imgSrc;
            
            // --- NOWOŚĆ: Ustawiamy treść podpisu i aktualizujemy atrybut alt w modalu ---
            modalAltText.textContent = imgAlt;
            modalImage.alt = imgAlt; // Dobra praktyka dla dostępności

            modal.classList.remove('is-hidden');
            scrollLockManager.lock();
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
            });
        };

        const closeModal = () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('is-hidden');
                scrollLockManager.unlock();
                
                // --- NOWOŚĆ (opcjonalnie): Czyścimy podpis po zamknięciu modala ---
                modalAltText.textContent = '';

            }, 300);
        };

        imageContainers.forEach(container => {
            container.addEventListener('click', () => {
                const imageElement = container.querySelector('img');
                if (imageElement) {
                    // --- ZMIANA: Przekazujemy do funkcji openModal zarówno .src jak i .alt ---
                    openModal(imageElement.src, imageElement.alt);
                }
            });
        });

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            // Zamyka modal tylko jeśli kliknięto tło (a nie obrazek)
            if (e.target === modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('is-hidden')) {
                closeModal();
            }
        });
    }






    // wybór materiału

   const carouselContainer = document.getElementById('carousel-container');
    if (!carouselContainer) return; // Zabezpieczenie, jeśli karuzela nie istnieje na stronie

    const items = carouselContainer.querySelectorAll('.carousel-item');
    const nameEl = document.getElementById('materialName');
    const descEl = document.getElementById('materialDesc');
    const prevBtn = document.querySelector('.carousel-btn[data-dir="prev"]');
    const nextBtn = document.querySelector('.carousel-btn[data-dir="next"]');

    if (items.length < 3) {
        console.warn("Karuzela wymaga przynajmniej 3 elementów.");
        return;
    }
    
    let currentIndex = 0;
    let isAnimating = false;
    const totalItems = items.length;

    function updateCarousel() {
        isAnimating = true;

        // Aktualizacja tekstu z efektem fade
        nameEl.style.opacity = '0';
        descEl.style.opacity = '0';

        setTimeout(() => {
            const centerItem = items[currentIndex];
            nameEl.textContent = centerItem.dataset.name;
            descEl.textContent = centerItem.dataset.desc;
            nameEl.style.opacity = '1';
            descEl.style.opacity = '1';
        }, 250); // Opóźnienie, aby tekst zmienił się w połowie animacji slajdów

        // Obliczanie indeksów dla lewego, środkowego i prawego slajdu
        const leftIndex = (currentIndex - 1 + totalItems) % totalItems;
        const rightIndex = (currentIndex + 1) % totalItems;

        // Aktualizacja klas dla wszystkich elementów
        items.forEach((item, index) => {
            item.classList.remove('carousel-center', 'carousel-left', 'carousel-right', 'carousel-hidden', 'golden-img-border');

            if (index === currentIndex) {
                item.classList.add('carousel-center');
                item.classList.add('golden-img-border');
            } else if (index === leftIndex) {
                item.classList.add('carousel-left');
            } else if (index === rightIndex) {
                item.classList.add('carousel-right');
            } else {
                item.classList.add('carousel-hidden'); // Ukryj pozostałe slajdy
            }
        });

        // Zwalniamy blokadę po zakończeniu animacji
        setTimeout(() => {
            isAnimating = false;
        }, 500); // Czas musi odpowiadać transition-duration w CSS
    }

    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });
    
    // Inicjalizacja karuzeli
    updateCarousel();
});
