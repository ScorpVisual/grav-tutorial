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