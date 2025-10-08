// src/pages/home.js
import { el, html, append, safe } from '../utils/dom.js';
import { fetchGames } from '../services/rawg.js';

function slideCard(g) {
    const bg = g.background_image || 'public/favicon.svg';
    const plats = (g.parent_platforms || [])
        .map(p => p.platform.name)
        .slice(0, 3)
        .join(' • ');

    return `
    <a href="detail.html?id=${g.id}" class="card-link">
      <article class="slide card" role="listitem">
        <img src="${bg}" alt="${safe(g.name)} cover" loading="lazy" />
        <div class="meta">
          <div class="title">${safe(g.name)}</div>
          <div class="sub">${safe(g.released || 'N/A')} • ⭐ ${g.rating} • ${safe(plats || 'Platforms N/A')}</div>
        </div>
      </article>
    </a>
  `;
}

// simple array shuffle
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export async function initHome() {
    const track = el('#carouselTrack');
    const dots = el('#carouselDots');
    const prev = el('#prevSlide');
    const next = el('#nextSlide');

    let list = [];
    try {
        // Grab a decent pool of games (e.g., top added)
        const data = await fetchGames({ ordering: '-added', page_size: 40 });
        // filter for only games with rating >= 4
        const highRated = (data.results || []).filter(g => g.rating >= 4);
        // randomize and take 6
        list = shuffle(highRated).slice(0, 6);
    } catch (e) {
        console.error(e);
        html(track, `<div class="error"><p>Could not load games.</p></div>`);
        return;
    }

    if (!list.length) {
        html(track, `<div class="empty"><p>No games found.</p></div>`);
        return;
    }

    // Render slides + dots
    list.forEach((g, i) => {
        append(track, slideCard(g));
        append(
            dots,
            `<button class="dot${i === 0 ? ' is-active' : ''}" data-idx="${i}" aria-label="Go to slide ${i + 1}" role="tab"></button>`
        );
    });

    let current = 0;
    let timer = null;
    const SLIDE_MS = 4500;

    function goTo(i) {
        current = (i + list.length) % list.length;
        track.style.transform = `translateX(calc(${current} * -100%))`;
        dots.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('is-active', idx === current));
    }

    function play() { stop(); timer = setInterval(() => goTo(current + 1), SLIDE_MS); }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    next.addEventListener('click', () => { goTo(current + 1); play(); });
    prev.addEventListener('click', () => { goTo(current - 1); play(); });
    dots.addEventListener('click', (e) => {
        const btn = e.target.closest('.dot');
        if (!btn) return;
        goTo(Number(btn.dataset.idx));
        play();
    });

    const viewport = track.parentElement;
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', play);
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', play);

    let startX = null;
    viewport.addEventListener('touchstart', e => (startX = e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchend', e => {
        if (startX == null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); play(); }
        startX = null;
    });

    goTo(0);
    play();
}