import { el, html, append, showSpinner, safe } from '../utils/dom.js';
import { fetchGame, fetchScreenshots } from '../services/rawg.js';
import { findTrailerId } from '../services/youtube.js';
import { toggleFavorite, isFav } from '../utils/storage.js';

function pill(text) { return `<span class="pill">${safe(text)}</span>`; }
function errorState(msg) { return `<div class="error"><p>${msg}</p></div>`; }

export async function initDetail() {
  const view = el('#view'); showSpinner(view);
  const id = new URLSearchParams(location.search).get('id');
  if (!id) { html(view, errorState('Missing game id.')); return; }
  try {
    const game = await fetchGame(id);
    const shots = await fetchScreenshots(id);
    const fav = isFav(game.id);
    const clipUrl = game.clip?.clip || null;
    let trailerEmbed = '';
    if (clipUrl) { trailerEmbed = `<video class="media" src="${clipUrl}" controls></video>`; }
    else { const vid = await findTrailerId(game.name); if (vid) trailerEmbed = `<div class="media"><iframe src="https://www.youtube.com/embed/${vid}" title="Trailer" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`; }

    html(view, `<section class="hero">
      <div>
        <h1>${safe(game.name)}</h1>
        <div class="list">
          ${game.released ? pill('Released: ' + safe(game.released)) : ''}
          ${pill('Rating: ' + (game.rating || 'N/A'))}
          ${game.metacritic ? pill('Metacritic: ' + game.metacritic) : ''}
        </div>
        <p class="sub" style="margin-top:.75rem">${safe(game.description_raw || 'No description available.')}</p>
        <div class="list" style="margin-top:.75rem">
          ${(game.genres || []).map(g => pill(g.name)).join('')}
          ${(game.parent_platforms || []).map(p => pill(p.platform.name)).join('')}
        </div>
        <div class="card-actions" style="padding-left:0">
          <a class="button" href="/index.html">← Back</a>
          <button id="favBtn" class="button-ghost">${fav ? '★ Remove' : '☆ Favorite'}</button>
        </div>
      </div>
      <div>${trailerEmbed || '<div class="empty media"><p>No trailer available.</p></div>'}</div>
    </section>
    <section style="margin-top:1rem">
      <h2>Screenshots</h2>
      <div class="grid" id="shots"></div>
    </section>`);

    // Render screenshots
    const shotsGrid = el('#shots');
    const shotUrls = shots.map(s => s.image);
    if (shotUrls.length) {
      shotUrls.forEach((url, i) => append(shotsGrid, `<img src="${url}" alt="Screenshot ${i + 1}" loading="lazy" data-idx="${i}">`));
    } else {
      append(shotsGrid, '<div class="empty" style="grid-column:1/-1"><p>No screenshots available.</p></div>');
    }

    // Favorites button
    el('#favBtn').addEventListener('click', () => {
      const mini = { id: game.id, name: game.name, background_image: game.background_image, rating: game.rating, released: game.released };
      const after = toggleFavorite(mini);
      el('#favBtn').textContent = after.some(x => x.id === game.id) ? '★ Remove' : '☆ Favorite';
    });

    // ------- LIGHTBOX -------
    // Build modal once and append to <body>
    const modal = document.createElement('div');
    modal.className = 'lightbox hidden';
    modal.innerHTML = `
      <div class="lightbox-backdrop" data-close></div>
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Screenshot viewer" tabindex="-1">
        <button class="lightbox-btn lightbox-close" aria-label="Close" data-close>×</button>
        <button class="lightbox-btn lightbox-prev" aria-label="Previous" data-prev>‹</button>
        <figure class="lightbox-figure">
          <img id="lightboxImg" alt="Game screenshot" />
        </figure>
        <button class="lightbox-btn lightbox-next" aria-label="Next" data-next>›</button>
      </div>
    `;
    document.body.appendChild(modal);

    const imgEl = modal.querySelector('#lightboxImg');
    const dlg = modal.querySelector('.lightbox-dialog');
    const btnPrev = modal.querySelector('[data-prev]');
    const btnNext = modal.querySelector('[data-next]');
    const closeEls = modal.querySelectorAll('[data-close]');

    let current = 0;
    let lastFocus = null;

    function show(i) {
      current = (i + shotUrls.length) % shotUrls.length;
      imgEl.src = shotUrls[current];
    }
    function open(i) {
      if (!shotUrls.length) return;
      lastFocus = document.activeElement;
      document.body.classList.add('noscroll');
      modal.classList.remove('hidden');
      show(i);
      // focus dialog for keyboard controls
      dlg.focus();
      // preload neighbors (nice-to-have)
      const a = new Image(); a.src = shotUrls[(current + 1) % shotUrls.length];
      const b = new Image(); b.src = shotUrls[(current - 1 + shotUrls.length) % shotUrls.length];
    }
    function close() {
      modal.classList.add('hidden');
      document.body.classList.remove('noscroll');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // Click on thumbnails -> open
    shotsGrid.addEventListener('click', (e) => {
      const img = e.target.closest('img[data-idx]');
      if (!img) return;
      open(Number(img.dataset.idx));
    });

    // Controls
    btnPrev.addEventListener('click', () => show(current - 1));
    btnNext.addEventListener('click', () => show(current + 1));
    closeEls.forEach(el => el.addEventListener('click', close));

    // Backdrop click closes (already wired via [data-close])

    // Keyboard
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });

    // Touch swipe on dialog
    let startX = null;
    dlg.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', e => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });

  } catch (e) {
    console.error(e);
    html(view, errorState('Could not load game details.'));
  }
}
