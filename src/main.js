import './styles.css';
import { Header } from './components/header.js';
import { Nav } from './components/nav.js';
import { Footer } from './components/footer.js';
import { html, append, el } from './utils/dom.js';
import { ExplorePage } from './pages/explore.js';

function renderShell(){
  const root = document.getElementById('app');
  html(root, Header() + Nav());
  append(root, '<div id="view"></div>');
  append(root, Footer());
}

async function router(route = 'explore'){
  switch(route){
    case 'explore':
    default:
      await ExplorePage();
      break;
  }
}

renderShell();

// basic route handling for future expansion
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[data-route]');
  if (!a) return;
  e.preventDefault();
  const route = a.getAttribute('data-route');
  router(route);
});
