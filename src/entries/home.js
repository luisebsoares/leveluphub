import { loadPartials } from '../include.js';
import { initHome } from '../pages/home.js';

(async () => {
    await loadPartials();
    initHome();
})();
