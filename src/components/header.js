export function Header(){
  return `
    <header class="header">
      <div class="container brand">
        <img src="/src/assets/logo.svg" alt="LevelUp Hub logo">
        <div>
          <div style="display:flex; align-items:center; gap:.5rem">
            <strong>LevelUp Hub</strong>
            <span class="badge">Beta</span>
          </div>
          <div class="sub">Discover your next game</div>
        </div>
      </div>
    </header>
  `;
}
