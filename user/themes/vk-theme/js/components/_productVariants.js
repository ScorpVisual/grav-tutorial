document.addEventListener('DOMContentLoaded', function () {
    
// ====================================================================
    //  SKRYPT 1: Przełączanie wariantów produktu
    // ====================================================================
    
    // Pobranie elementów z DOM
const variantButtons = document.querySelectorAll('.variant-button');
    const priceElement = document.getElementById('product-price');
    const descriptionElement = document.getElementById('product-description');

    if (variantButtons.length > 0 && priceElement && descriptionElement) {
        variantButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Jeśli kliknięty przycisk jest już aktywny, nic nie rób
                if (this.classList.contains('is-active')) {
                    return;
                }

                // Usuń klasę 'is-active' ze wszystkich przycisków
                variantButtons.forEach(btn => btn.classList.remove('is-active'));
                
                // Dodaj klasę 'is-active' do klikniętego przycisku
                this.classList.add('is-active');

                // --- START ANIMACJI ---
                
                // 1. Dodaj klasę, aby rozpocząć zanikanie obecnego tekstu
                priceElement.classList.add('is-fading');
                descriptionElement.classList.add('is-fading');

                // 2. Użyj setTimeout, aby poczekać, aż animacja zanikania się zakończy
                setTimeout(() => {
                    // 3. Pobierz nowe dane i zaktualizuj treść, gdy jest niewidoczna
                    const newPrice = this.dataset.price;
                    const newDescription = this.dataset.desc;
                    
                    priceElement.textContent = newPrice;
                    descriptionElement.textContent = newDescription;

                    // 4. Usuń klasę, aby nowy tekst płynnie się pojawił
                    priceElement.classList.remove('is-fading');
                    descriptionElement.classList.remove('is-fading');
                }, 200); // Czas w milisekundach - musi być taki sam jak w CSS (0.2s = 200ms)

                // --- KONIEC ANIMACJI ---
            });
        });
    }



    // ====================================================================
    //  SKRYPT 2: Obsługa mobilnej szuflady (zaktualizowany)
    // ====================================================================
    const trigger = document.getElementById('addon-drawer-trigger');

    if (trigger) {
        const panel = document.getElementById('addon-drawer-panel');
        const icon = document.getElementById('addon-drawer-icon');
        const currentName = document.getElementById('current-addon-name');
        
        if (panel) {
            // --- NOWA LOGIKA DO OBSŁUGI WIDOCZNOŚCI ---
            const handleTriggerVisibility = () => {
                const isDesktop = window.innerWidth >= 768; // 768px to breakpoint 'md'
                
                // Jeśli jest desktop, dodaj klasę ukrywającą
                if (isDesktop) {
                    trigger.classList.add('is-hidden');
                    // Resetujemy styl panelu, aby CSS mógł go wyświetlić na desktopie
                    panel.style.maxHeight = null; 
                    if(icon) icon.classList.remove('rotate-180');
                } else {
                // Jeśli jest mobile, usuń klasę ukrywającą
                    trigger.classList.remove('is-hidden');
                }
            };

            // Sprawdź widoczność przy załadowaniu strony
            handleTriggerVisibility();
            // Sprawdzaj widoczność przy zmianie rozmiaru okna
            window.addEventListener('resize', handleTriggerVisibility);
            // --- KONIEC NOWEJ LOGIKI ---


            // Istniejąca logika animacji (bez zmian)
            const closeDrawer = () => {
                panel.style.maxHeight = '0px';
                if (icon) icon.classList.remove('rotate-180');
            };

            const openDrawer = () => {
                panel.style.maxHeight = panel.scrollHeight + 'px';
                if (icon) icon.classList.add('rotate-180');
            };

            trigger.addEventListener('click', function() {
                if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });

            const addonCards = panel.querySelectorAll('.content-switcher__card');
            addonCards.forEach(card => {
                card.addEventListener('click', function() {
                    const newName = this.querySelector('h3').textContent;
                    if (currentName) currentName.textContent = newName;
                    if (window.innerWidth < 768) closeDrawer();
                });
            });
        }
    }

});