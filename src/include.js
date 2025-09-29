export async function loadPartials() {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  if (header) {
    const r = await fetch('/partials/header.html');
    header.innerHTML = await r.text();
  }
  if (footer) {
    const r = await fetch('/partials/footer.html');
    footer.innerHTML = await r.text();
  }

  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle
  const btn = document.getElementById('themeToggle');
  const pref = localStorage.getItem('levelup-pref-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', pref);
  if (btn) {
    btn.textContent = pref === 'dark' ? '🌙' : '☀️';

    function applyTheme(next) {
      const root = document.documentElement;
      root.classList.add('theming'); // enable transitions
      root.setAttribute('data-theme', next);
      localStorage.setItem('levelup-pref-theme', next);
      btn.textContent = next === 'dark' ? '🌙' : '☀️';

      // remove .theming after transition
      clearTimeout(window.__themeTimer);
      window.__themeTimer = setTimeout(() => {
        root.classList.remove('theming');
      }, 450);
    }

    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // mark active nav
  const path = location.pathname;
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}
