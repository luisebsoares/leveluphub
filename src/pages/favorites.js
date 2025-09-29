import { el, html, append } from '../utils/dom.js';
import { getFavorites, toggleFavorite } from '../utils/storage.js';

function card(g) {
  const img = g.background_image || '/favicon.svg';
  return `
    <a href="/detail.html?id=${g.id}" class="card-link">
      <article class="card">
        <img src="${img}" alt="${g.name}" loading="lazy" />
        <div class="meta">
          <div class="title">${g.name}</div>
          <div class="sub">${g.released || 'N/A'} • ⭐ ${g.rating || 'N/A'}</div>
        </div>
        <div class="card-actions">
          <button class="button-ghost" data-fav="${g.id}">Remove</button>
        </div>
      </article>
    </a>
  `;
}

export async function initFavorites() {
  const view = el('#view');
  const list = getFavorites();
  if (!list.length) { html(view, '<div class="empty"><p>No favorites yet. Add some from Explore!</p></div>'); return; }
  html(view, '<div class="grid" id="favGrid"></div>');
  const grid = el('#favGrid');
  list.forEach(g => append(grid, card(g)));

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-fav]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = Number(btn.getAttribute('data-fav'));
    const item = list.find(x => x.id === id); if (!item) return;
    const after = toggleFavorite(item);
    btn.closest('.card-link').remove();
    if (!after.length) html('#view', '<div class="empty"><p>No favorites yet. Add some from Explore!</p></div>');
  });
}
