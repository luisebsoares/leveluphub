import { el, html, append, showSpinner } from '../utils/dom.js';
import { fetchGames, fetchGenres, fetchPlatforms } from '../services/rawg.js';
import { toggleFavorite, isFav } from '../utils/storage.js';

function gameCard(g) {
  const background = g.background_image || '/favicon.svg';
  const plats = (g.parent_platforms || []).map(p => p.platform.name).slice(0, 3).join(' • ');
  const fav = isFav(g.id);
  return `
    <a href="/detail.html?id=${g.id}" class="card-link">
      <article class="card">
        <img src="${background}" alt="${g.name} cover" loading="lazy" />
        <div class="meta">
          <div class="title">${g.name}</div>
          <div class="sub">${g.released || 'N/A'} • ⭐ ${g.rating} • ${plats || 'Platforms N/A'}</div>
        </div>
        <div class="card-actions">
          <button class="button-ghost" data-fav="${g.id}">${fav ? '★ Remove' : '☆ Favorite'}</button>
        </div>
      </article>
    </a>
  `;
}

function emptyState(msg) { return `<div class="empty"><p>${msg}</p></div>`; }
function errorState(msg) { return `<div class="error"><p>${msg}</p></div>`; }

function params() { return new URLSearchParams(location.search); }
function setParams(obj) {
  const p = new URLSearchParams(obj);
  const q = p.toString();
  const url = q ? `${location.pathname}?${q}` : location.pathname;
  history.pushState(null, '', url);
  window.dispatchEvent(new Event('popstate'));
}

/* ---------- ranking helpers to make search more specific on the client ---------- */
function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function scoreTitle(query, name) {
  if (!query) return 0;
  const q = normalize(query);
  const n = normalize(name);
  if (!q || !n) return 0;

  if (n === q) return 1000;             // exact match
  if (n.startsWith(q)) return 750;      // starts with
  if (n.includes(q)) return 500;        // contains
  // minor hyphen/colon differences
  if (n.replace(/\s+/g, '') === q.replace(/\s+/g, '')) return 900;
  return 0;
}

export async function initExplore() {
  const view = el('#view');
  html(view, `
  <section class="filters" id="filters">
    <div class="search-row">
      <input id="q" class="input" type="search" placeholder="Search games..." aria-label="Search games" />
    </div>

    <div class="filter-row">
      <select id="genre" class="select filter" aria-label="Filter by genre">
        <option value="">All genres</option>
      </select>

      <select id="platform" class="select filter" aria-label="Filter by platform">
        <option value="">All platforms</option>
      </select>

      <select id="year" class="select filter" aria-label="Filter by year">
        <option value="">Any year</option>
      </select>

      <select id="rating" class="select filter" aria-label="Filter by rating">
        <option value="">Any rating</option>
        <option value="90,100">90–100</option>
        <option value="80,89">80–89</option>
        <option value="70,79">70–79</option>
      </select>
    </div>
  </section>

  <section id="results">${emptyState('Use the filters or start typing to discover games.')}</section>
`);


  const currentYear = new Date().getFullYear();
  const yearSel = el('#year');
  for (let y = currentYear; y >= 2000; y--) append(yearSel, `<option value="${y}">${y}</option>`);

  try {
    const [genres, platforms] = await Promise.all([fetchGenres(), fetchPlatforms()]);
    genres.forEach(g => append('#genre', `<option value="${g.slug}">${g.name}</option>`));
    platforms.forEach(p => append('#platform', `<option value="${p.id}">${p.name}</option>`));
  } catch (e) { console.warn(e); }

  const refs = {
    q: el('#q'),
    genre: el('#genre'),
    platform: el('#platform'),
    year: el('#year'),
    rating: el('#rating'),
    results: el('#results'),
  };

  function syncUI() {
    const p = params();
    refs.q.value = p.get('search') || '';
    refs.genre.value = p.get('genres') || '';
    refs.platform.value = p.get('platforms') || '';
    const d = p.get('dates') || '';
    refs.year.value = d.slice(0, 4) || '';
    refs.rating.value = p.get('metacritic') || '';
  }

  function buildFilters() {
    const p = {};
    const q = refs.q.value.trim();
    if (q) p.search = q;
    if (refs.genre.value) p.genres = refs.genre.value;
    if (refs.platform.value) p.platforms = refs.platform.value;
    if (refs.year.value) p.dates = `${refs.year.value}-01-01,${refs.year.value}-12-31`;
    if (refs.rating.value) p.metacritic = refs.rating.value;
    return p;
  }

  async function run() {
    showSpinner(refs.results);
    try {
      const f = buildFilters();
      const data = await fetchGames(f);
      let list = data.results || [];

      // Re-rank with strictness when searching (no checkbox UI needed)
      if (f.search) {
        list = list
          .map(g => ({ g, s: scoreTitle(f.search, g.name) }))
          .sort((a, b) => b.s - a.s || (b.g.rating - a.g.rating))
          .map(x => x.g);
      }

      if (!list.length) { html(refs.results, emptyState('No results found. Try adjusting filters.')); return; }
      html(refs.results, '<div class="grid" id="grid"></div>');
      const grid = el('#grid');
      list.forEach(g => append(grid, gameCard(g)));

      // Favorite button inside linked card
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-fav]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const id = Number(btn.getAttribute('data-fav'));
        const card = list.find(x => x.id === id); if (!card) return;
        const mini = { id: card.id, name: card.name, background_image: card.background_image, rating: card.rating, released: card.released };
        const after = toggleFavorite(mini);
        btn.textContent = after.some(x => x.id === id) ? '★ Remove' : '☆ Favorite';
      });
    } catch (e) {
      html(refs.results, errorState('Sorry—something went wrong loading games.'));
    }
  }

  // Init & wire
  syncUI(); run();

  let t;
  refs.q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => setParams(buildFilters()), 250); });
  [refs.genre, refs.platform, refs.year, refs.rating].forEach(sel =>
    sel.addEventListener('change', () => setParams(buildFilters()))
  );

  window.addEventListener('popstate', () => { syncUI(); run(); });
}
