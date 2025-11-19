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
    const scrollBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('is-visible');
        } else {
            scrollBtn.classList.remove('is-visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});