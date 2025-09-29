import { html } from '../utils/dom.js';
export async function initAbout() {
  html('#view', `<section class="card" style="padding:1rem">
    <h1>About LevelUp Hub</h1>
    <p class="sub">Discover your next favorite game using filters, screenshots, and trailers.</p>
    <ul>
      <li>Explore trending and filtered games</li>
      <li>Save favorites locally</li>
      <li>Share links with filters or open game details</li>
    </ul>
    <p class="sub">Built with Vite + vanilla JS. Data by RAWG.io; trailers via RAWG or YouTube.</p>
  </section>`);
}
