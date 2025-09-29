export function Nav(){
  return `
    <nav class="container" aria-label="Primary">
      <div class="nav">
        <a href="#" data-route="explore" aria-current="page">Explore</a>
        <a href="#" data-route="favorites">Favorites</a>
        <a href="#" data-route="about">About</a>
      </div>
    </nav>
  `;
}
