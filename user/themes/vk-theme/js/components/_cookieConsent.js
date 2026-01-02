document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const cookieKey = 'cookie_consent_accepted';

    // Sprawdź czy zgoda już istnieje
    if (!localStorage.getItem(cookieKey)) {
        banner.classList.remove('hidden');
    }

    // Obsługa kliknięcia
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(cookieKey, 'true');
        banner.classList.add('hidden');
        
        // Opcjonalnie: animacja usunięcia z DOM po zakończeniu przejścia
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    });
});