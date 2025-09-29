import { el, html, append, showSpinner, els } from '../utils/dom.js';
import { fetchGames, fetchGenres, fetchPlatforms } from '../services/rawg.js';

function gameCard(g){
  const background = g.background_image || '/favicon.svg';
  const platforms = (g.parent_platforms||[]).map(p=>p.platform.name).slice(0,3).join(' • ');
  return `
    <article class="card" tabindex="0" aria-label="${g.name} card">
      <img src="${background}" alt="${g.name} cover" loading="lazy" />
      <div class="meta">
        <div class="title">${g.name}</div>
        <div class="sub">${(g.released||'N/A')} • ⭐ ${g.rating} • ${platforms||'Platforms N/A'}</div>
      </div>
    </article>
  `;
}

function emptyState(msg){
  return `<div class="empty"><p>${msg}</p></div>`;
}
function errorState(msg){
  return `<div class="error"><p>${msg}</p></div>`;
}

export async function ExplorePage(){
  const app = el('#app');
  html(app, `
    <main class="container">
      <section class="filters" id="filters">
        <input id="q" class="input" type="search" placeholder="Search games..." aria-label="Search games" />
        <select id="genre" class="select" aria-label="Filter by genre">
          <option value="">All genres</option>
        </select>
        <select id="platform" class="select" aria-label="Filter by platform">
          <option value="">All platforms</option>
        </select>
        <select id="year" class="select" aria-label="Filter by year">
          <option value="">Any year</option>
        </select>
        <select id="rating" class="select" aria-label="Filter by rating">
          <option value="">Any rating</option>
          <option value="90,100">90–100</option>
          <option value="80,89">80–89</option>
          <option value="70,79">70–79</option>
        </select>
      </section>

      <section id="results">
        ${emptyState('Use the filters or start typing to discover games.')}
      </section>
    </main>
  `);

  // Populate static selects
  const currentYear = new Date().getFullYear();
  const yearSel = el('#year');
  for(let y = currentYear; y >= 2000; y--){
    append(yearSel, `<option value="${y}">${y}</option>`);
  }

  // Load genres/platforms (async)
  try{
    const [genres, platforms] = await Promise.all([fetchGenres(), fetchPlatforms()]);
    const genreSel = el('#genre');
    genres.forEach(g=> append(genreSel, `<option value="\${g.slug}">\${g.name}</option>`));
    const platformSel = el('#platform');
    platforms.forEach(p=> append(platformSel, `<option value="\${p.id}">\${p.name}</option>`));
  }catch(e){
    console.warn(e);
  }

  // Search + filter behavior
  const refs = {
    q: el('#q'),
    genre: el('#genre'),
    platform: el('#platform'),
    year: el('#year'),
    rating: el('#rating'),
    results: el('#results')
  };

  function buildFilters(){
    // dates range if year is set
    let dates;
    if (refs.year.value){
      dates = `${refs.year.value}-01-01,${refs.year.value}-12-31`;
    }
    // metacritic filter from rating select (optional)
    const met = refs.rating.value || undefined;
    return {
      search: refs.q.value.trim() || undefined,
      genres: refs.genre.value || undefined,
      platforms: refs.platform.value || undefined,
      dates,
      metacritic: met,
      ordering: "-added",
      page_size: 24
    };
  }

  async function run(){
    showSpinner(refs.results);
    try{
      const data = await fetchGames(buildFilters());
      const list = data.results || [];
      if (!list.length){
        html(refs.results, emptyState('No results found. Try adjusting filters.'));
        return;
      }
      html(refs.results, '<div class="grid" id="grid"></div>');
      const grid = el('#grid');
      list.forEach(g=> append(grid, gameCard(g)));
    }catch(e){
      console.error(e);
      html(refs.results, errorState('Sorry—something went wrong loading games. Please try again.'));
    }
  }

  // Trigger initial load of trending (ordering -added, current year range by default off)
  run();

  // Wire up events (debounced search)
  let t;
  refs.q.addEventListener('input', () => { clearTimeout(t); t=setTimeout(run, 350); });
  [refs.genre, refs.platform, refs.year, refs.rating].forEach(sel => sel.addEventListener('change', run));
}
