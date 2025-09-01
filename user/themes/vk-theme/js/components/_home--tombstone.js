console.log('Loading tombstone controls! 🚀');

document.querySelectorAll('.js-controls-container').forEach(controlsContainer => {
    const parentSection = controlsContainer.closest('section');
    if (!parentSection) {
        console.error('Critical Error: Could not find parent <section> for tombstone component!');
        return;
    }

    const svgContainer = parentSection.querySelector('.js-svg-container');
    const descContainer = parentSection.querySelector('.js-desc-container');

    if (!svgContainer || !descContainer) {
        console.error('Critical Error: Missing .js-svg-container or .js-desc-container within the section!');
        return;
    }

    const highlightSvgPart = (partName) => {
        svgContainer.querySelector('.svg-part.highlighted')?.classList.remove('highlighted', 'pulsate');
        const newSvgPart = svgContainer.querySelector(`.svg-part[data-part="${partName}"]`);
        if (newSvgPart) {
            newSvgPart.classList.add('highlighted', 'pulsate');
        }
    };

    const showDescription = (partName) => {
        descContainer.querySelectorAll('.tomb-desc').forEach(desc => {
            desc.classList.add('is-hidden');
        });
        const targetDesc = descContainer.querySelector(`.tomb-desc[data-part="${partName}"]`);
        if (targetDesc) {
            targetDesc.classList.remove('is-hidden');
        }
    };

    controlsContainer.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.switch-button');
        if (!clickedButton) return;

        controlsContainer.querySelector('.is-active')?.classList.remove('is-active');
        clickedButton.classList.add('is-active');

        const partName = clickedButton.dataset.part;
        if (partName) {
            highlightSvgPart(partName);
            showDescription(partName);
        }
    });

    // Ustawienie stanu początkowego
    const initialButton = controlsContainer.querySelector('.switch-button');
    if (initialButton) {
        initialButton.click();
    }
});
