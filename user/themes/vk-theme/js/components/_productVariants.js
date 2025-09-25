document.addEventListener('DOMContentLoaded', function () {
    
    // ====================================================================
    //  SKRYPT 1: (Bez zmian)
    // ====================================================================
    const variantButtons = document.querySelectorAll('.variant-button');
    const priceElement = document.getElementById('product-price');
    const descriptionElement = document.getElementById('product-description');

    if (variantButtons.length > 0 && priceElement && descriptionElement) {
        // ... cała logika skryptu 1 pozostaje bez zmian ...
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