export function Footer(){
  const year = new Date().getFullYear();
  return `
    <footer class="footer">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
        <small>&copy; ${year} LevelUp Hub</small>
        <small class="sub">Data: RAWG.io</small>
      </div>
    </footer>
  `;
}
