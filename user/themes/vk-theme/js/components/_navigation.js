const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu-full');
const body = document.body;

if (navToggle && navMenu) {
    const closeMenu = () => {
        navMenu.classList.remove('is-active');
        navToggle.classList.remove('is-active');
        body.classList.remove('no-scroll');
    };

    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.contains('is-active');
        if (isActive) {
            closeMenu();
        } else {
            navMenu.classList.add('is-active');
            navToggle.classList.add('is-active');
            body.classList.add('no-scroll');
        }
    });

    navMenu.addEventListener('click', (event) => {

        if (event.target === navMenu) {
            closeMenu();
        }
    });
}