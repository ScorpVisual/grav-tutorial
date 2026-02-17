document.addEventListener('DOMContentLoaded', () => {
const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu-full');

    if (navToggle && navMenu) {
        const closeMenu = () => {
            navMenu.classList.remove('is-active');
            navToggle.classList.remove('is-active');
            scrollLockManager.unlock();
        };

        navToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('is-active');
            if (isActive) {
                closeMenu();
            } else {
                navMenu.classList.add('is-active');
                navToggle.classList.add('is-active');
                scrollLockManager.lock();
            }
        });

        navMenu.addEventListener('click', (event) => {
            if (event.target === navMenu) {
                closeMenu();
            }
        });
    }

    });

document.addEventListener('DOMContentLoaded', function() {
    // 1. Pobieranie elementów DOM
    const scrollBtn = document.getElementById('scrollToTopBtn');
    const callBtn = document.getElementById('callUsBtn');
    
    // Zmień 'contact' na ID sekcji, do której ma przewijać przycisk (np. 'footer', 'formularz')
    const contactSection = document.getElementById('kontakt'); 

    // 2. Funkcja sprawdzająca widoczność przycisków podczas przewijania
    const checkVisibility = () => {
        const threshold = 300; // Liczba pikseli, po której pojawiają się przyciski

        // Logika dla przycisku "W górę"
        if (scrollBtn) {
            if (window.scrollY > threshold) {
                scrollBtn.classList.add('is-visible');
            } else {
                scrollBtn.classList.remove('is-visible');
            }
        }

        // Logika dla przycisku "Kontakt"
        if (callBtn) {
            if (window.scrollY > threshold) {
                callBtn.classList.add('is-visible');
            } else {
                callBtn.classList.remove('is-visible');
            }
        }
    };

    // Podpięcie nasłuchiwania na scroll
    window.addEventListener('scroll', checkVisibility);

    // 3. Obsługa kliknięcia: Przewiń do góry
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Obsługa kliknięcia: Przewiń do kontaktu
    if (callBtn) {
        callBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn('Nie znaleziono sekcji docelowej (sprawdź ID w kodzie JS).');
            }
        });
    }
    
    // Wywołanie przy załadowaniu, na wypadek gdyby strona była odświeżona w połowie długości
    checkVisibility();
});

// document.addEventListener('DOMContentLoaded', function() {
//     const scrollBtn = document.getElementById('scrollToTopBtn');

//     window.addEventListener('scroll', () => {
//         if (window.scrollY > 300) {
//             scrollBtn.classList.add('is-visible');
//         } else {
//             scrollBtn.classList.remove('is-visible');
//         }
//     });

//     scrollBtn.addEventListener('click', () => {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         });
//     });
// });