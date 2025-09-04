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

});
