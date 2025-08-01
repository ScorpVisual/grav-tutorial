console.log('Loading tombstone controls!');

const controlsContainer = document.getElementById('controls-container');

// Funkcja do podświetlania części SVG (bez zmian)
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
    // 1. Ukryj wszystkie opisy
    const allDescriptions = document.querySelectorAll('.tomb-desc');
    allDescriptions.forEach(desc => {
        desc.classList.add('is-hidden');
    });

    // 2. Pokaż właściwy opis (ZAKTUALIZOWANA LOGIKA)
    // Budujemy poprawne ID: 'desc-' + wartość z data-target
    const targetDescId = `desc-${targetId}`; 
    const targetDesc = document.getElementById(targetDescId);
    
    // Teraz ten warunek zostanie spełniony!
    if (targetDesc) {
        targetDesc.classList.remove('is-hidden');
    }
};

// GŁÓWNY EVENT LISTENER
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
    showDescription(targetId); // <- DODANA LINIA
});

// Ustaw stan początkowy
const initialButton = controlsContainer.querySelector('.switch-button');
if (initialButton) {
    initialButton.classList.add('is-active');
    const initialTargetId = initialButton.dataset.target;
    highlightSvgPart(initialTargetId);
    showDescription(initialTargetId); // <- DODANA LINIA
}