import './styles.css';
import { ExplorePage } from './pages/explore.js';
import { el } from './utils/dom.js';

// Set dynamic year in footer
el('#year').textContent = new Date().getFullYear();

async function router(route = 'explore') {
  switch (route) {
    case 'explore':
    default:
      await ExplorePage();
      break;
  }
}

// initial route
router();

// basic route handling
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-route]');
  if (!a) return;
  e.preventDefault();
  const route = a.getAttribute('data-route');
  router(route);
});
