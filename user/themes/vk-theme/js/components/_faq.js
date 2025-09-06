document.addEventListener("DOMContentLoaded", function () {
    // Twoje pozostałe skrypty...

    // --- LOGIKA FAQ Z DYNAMICZNYM PODKREŚLENIEM ---
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const questionDiv = item.querySelector(".faq-question");
        // Znajdź element h3 wewnątrz klikanego nagłówka
        const h3 = questionDiv.querySelector("h3");

        questionDiv.addEventListener("click", () => {
            const currentlyActive = document.querySelector(".faq-item.is-active");

            // Jeśli kliknięto aktywny element, zamknij go
            if (currentlyActive && currentlyActive === item) {
                currentlyActive.classList.remove("is-active");
                // Usuń klasę podkreślenia z h3
                h3.classList.remove("underline--cherry");
            } 
            // Jeśli kliknięto inny element...
            else {
                // ...zamknij poprzednio otwarty (jeśli istniał)
                if (currentlyActive) {
                    currentlyActive.classList.remove("is-active");
                    // Usuń podkreślenie ze starego aktywnego h3
                    currentlyActive.querySelector("h3").classList.remove("underline--cherry");
                }
                // ...i otwórz nowo kliknięty
                item.classList.add("is-active");
                // Dodaj klasę podkreślenia do nowego aktywnego h3
                h3.classList.add("underline--cherry");
            }
        });
    });

    // Inicjalizacja: dodaj klasę do domyślnie aktywnego elementu
    const initialActive = document.querySelector(".faq-item.is-active");
    if (initialActive) {
        initialActive.querySelector("h3").classList.add("underline--cherry");
    }
});