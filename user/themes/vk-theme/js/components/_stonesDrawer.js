document.querySelectorAll('.js-stone-drawer').forEach(drawer => {
    const toggleBtn = drawer.querySelector('.js-drawer-toggle');
    const list = drawer.querySelector('.js-drawer-list');

    // Domyślnie otwarta
    list.classList.add('open');

    toggleBtn.addEventListener('click', () => {
        if (list.classList.contains('open')) {
            // Zamykamy: dodajemy hidden
            list.classList.remove('open');
            list.classList.add('hidden');
            toggleBtn.querySelector('span').textContent = '+';
        } else {
            // Otwieramy: usuwamy hidden
            list.classList.remove('hidden');
            list.classList.add('open');
            toggleBtn.querySelector('span').textContent = '-';
        }
    });

    const items = drawer.querySelectorAll('.js-drawer-item');
    const img = drawer.querySelector('.js-drawer-active-img');
    const nameEl = drawer.querySelector('.js-drawer-name');
    const descEl = drawer.querySelector('.js-drawer-desc');
    const priceStars = drawer.querySelector('.js-drawer-price-stars');
    const availStars = drawer.querySelector('.js-drawer-availability-stars');

    const renderStars = (container, level) => {
        container.replaceChildren();
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('img');
            star.src = container.dataset.icon;
            star.className = 'h-6 w-auto';
            star.style.opacity = i <= level ? '1' : '0.2';
            container.appendChild(star);
        }
    };

    // --- Ustaw pierwszy element jako wybrany ---
    if (items.length > 0) {
        const first = items[0];
        first.classList.add('active');
        img.src = first.dataset.img;
        nameEl.textContent = first.dataset.name;
        descEl.textContent = first.dataset.desc;
        renderStars(priceStars, first.dataset.price);
        renderStars(availStars, first.dataset.availability);
    }

    // Obsługa kliknięcia na elementy
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            img.src = item.dataset.img;
            nameEl.textContent = item.dataset.name;
            descEl.textContent = item.dataset.desc;
            renderStars(priceStars, item.dataset.price);
            renderStars(availStars, item.dataset.availability);
        });
    });
});
