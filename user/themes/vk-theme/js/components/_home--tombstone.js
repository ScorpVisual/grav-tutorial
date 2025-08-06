// user/themes/vk-theme/js/components/_home--tombstone.js

console.log('Loading tombstone controls!');

const controlsContainer = document.getElementById('controls-container');

// Sprawdzamy, czy kontener istnieje na tej stronie
if (controlsContainer) {

    // --- FUNKCJE POMOCNICZE ---

    const highlightSvgPart = (targetId) => {
        const oldSvgPart = document.querySelector('.svg-part.highlighted');
        if (oldSvgPart) {
            oldSvgPart.classList.remove('highlighted', 'pulsate');
        }
        const newSvgPart = document.getElementById(targetId);
        if (newSvgPart) {
            newSvgPart.classList.add('highlighted', 'pulsate');
        }
    };

    const showDescription = (targetId) => {
        const allDescriptions = document.querySelectorAll('.tomb-desc');
        allDescriptions.forEach(desc => {
            desc.classList.add('is-hidden');
        });

        const targetDescId = `desc-${targetId}`;
        const targetDesc = document.getElementById(targetDescId);
        if (targetDesc) {
            targetDesc.classList.remove('is-hidden');
        }
    };

    // --- GŁÓWNY EVENT LISTENER ---
    // POPRAWKA 1: Usunięto zbędny, zewnętrzny listener. Został tylko jeden.
    controlsContainer.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.switch-button');
        if (!clickedButton) return;

        // Przełączanie klasy aktywnej dla przycisków
        const oldActiveButton = controlsContainer.querySelector('.is-active');
        if (oldActiveButton) {
            oldActiveButton.classList.remove('is-active');
        }
        clickedButton.classList.add('is-active');

        const targetId = clickedButton.dataset.target;

        // Wywołaj obie funkcje
        highlightSvgPart(targetId);
        showDescription(targetId);
    });

    // --- USTAWIENIE STANU POCZĄTKOWEGO ---
    // POPRAWKA 2: Ten blok został przeniesiony do środka warunku 'if'.
    const initialButton = controlsContainer.querySelector('.switch-button');
    if (initialButton) {
        initialButton.classList.add('is-active');
        const initialTargetId = initialButton.dataset.target;
        highlightSvgPart(initialTargetId);
        showDescription(initialTargetId);
    }
}