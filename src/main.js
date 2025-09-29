import './styles.css';
import { el } from './utils/dom.js';
import { parseHash } from './utils/querystring.js';
import { ExplorePage } from './pages/explore.js';
import { GameDetailPage } from './pages/detail.js';
import { FavoritesPage } from './pages/favorites.js';
import { AboutPage } from './pages/about.js';
import { getPref, setPref } from './utils/storage.js';

el('#year').textContent = new Date().getFullYear();

const savedTheme = getPref('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
el('#themeToggle').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
el('#themeToggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  setPref('theme', next);
  el('#themeToggle').textContent = next === 'dark' ? '🌙' : '☀️';
});

async function router() {
  const { path } = parseHash();
  if (path.startsWith('/game/')) {
    const id = path.split('/').pop();
    return GameDetailPage(id);
  }
  switch (path) {
    case '/favorites': return FavoritesPage();
    case '/about': return AboutPage();
    case '/explore':
    default: return ExplorePage();
  }
}
window.addEventListener('hashchange', router);
router();
