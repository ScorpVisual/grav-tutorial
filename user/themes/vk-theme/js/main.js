import './components/_navigation.js';
import './components/_gallery.js';
import './components/_faq.js';
import './components/_contentSwitcher.js';
import './components/_productVariants.js';
import './components/_cookieConsent.js';
import './components/_stonesDrawer.js';
import { initOverlayProductCards } from './components/_productCards.js';

import './components/_home--tombstone.js';
import 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js';

document.addEventListener('DOMContentLoaded', () => {

    function safeInit(selector, initFn) {
        if (typeof initFn === 'function' && document.querySelector(selector)) {
            initFn();
        }
    }

    safeInit('.product-card', initOverlayProductCards);
});
