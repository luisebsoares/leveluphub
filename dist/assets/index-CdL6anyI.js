(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function i(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=i(a);fetch(a.href,o)}})();function s(e,t=document){return t.querySelector(e)}function u(e,t){typeof e=="string"&&(e=s(e)),e.innerHTML=t}function d(e,t){typeof e=="string"&&(e=s(e)),e.insertAdjacentHTML("beforeend",t)}function $(e){u(e,'<div class="spinner" role="status" aria-label="Loading"></div>')}const m="https://api.rawg.io/api",b="cab8a530d1b74e168df21c53d34e0cf8";function g(e){const t=new URLSearchParams({key:b});for(const[i,r]of Object.entries(e))r==null||r===""||t.set(i,r);return t.toString()}function w(e={}){const t={ordering:e.ordering||"-added",page_size:e.page_size||24};return e.search&&(t.search=e.search),e.genres&&(t.genres=e.genres),e.platforms&&(t.platforms=e.platforms),e.dates&&(t.dates=e.dates),e.metacritic&&(t.metacritic=e.metacritic),t}async function E(e={}){const t=w(e),i=`${m}/games?${g(t)}`,r=await fetch(i);if(!r.ok)throw new Error(`RAWG error ${r.status}`);return r.json()}async function S(){const e=await fetch(`${m}/genres?${g({})}`);if(!e.ok)throw new Error(`RAWG genres error ${e.status}`);return(await e.json()).results||[]}async function A(){const e=await fetch(`${m}/platforms?${g({page_size:50})}`);if(!e.ok)throw new Error(`RAWG platforms error ${e.status}`);return(await e.json()).results||[]}function L(e){const t=e.background_image||"/favicon.svg",i=(e.parent_platforms||[]).map(r=>r.platform.name).slice(0,3).join(" • ");return`
    <article class="card" tabindex="0" aria-label="${e.name} card">
      <img src="${t}" alt="${e.name} cover" loading="lazy" />
      <div class="meta">
        <div class="title">${e.name}</div>
        <div class="sub">${e.released||"N/A"} • ⭐ ${e.rating} • ${i||"Platforms N/A"}</div>
      </div>
    </article>
  `}function y(e){return`<div class="empty"><p>${e}</p></div>`}function P(e){return`<div class="error"><p>${e}</p></div>`}async function q(){const e=s("#app");u(e,`
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
        ${y("Use the filters or start typing to discover games.")}
      </section>
    </main>
  `);const t=new Date().getFullYear(),i=s("#year");for(let n=t;n>=2e3;n--)d(i,`<option value="${n}">${n}</option>`);try{const[n,l]=await Promise.all([S(),A()]),f=s("#genre");n.forEach(h=>d(f,'<option value="${g.slug}">${g.name}</option>'));const p=s("#platform");l.forEach(h=>d(p,'<option value="${p.id}">${p.name}</option>'))}catch(n){console.warn(n)}const r={q:s("#q"),genre:s("#genre"),platform:s("#platform"),year:s("#year"),rating:s("#rating"),results:s("#results")};function a(){let n;r.year.value&&(n=`${r.year.value}-01-01,${r.year.value}-12-31`);const l=r.rating.value||void 0;return{search:r.q.value.trim()||void 0,genres:r.genre.value||void 0,platforms:r.platform.value||void 0,dates:n,metacritic:l,ordering:"-added",page_size:24}}async function o(){$(r.results);try{const l=(await E(a())).results||[];if(!l.length){u(r.results,y("No results found. Try adjusting filters."));return}u(r.results,'<div class="grid" id="grid"></div>');const f=s("#grid");l.forEach(p=>d(f,L(p)))}catch(n){console.error(n),u(r.results,P("Sorry—something went wrong loading games. Please try again."))}}o();let c;r.q.addEventListener("input",()=>{clearTimeout(c),c=setTimeout(o,350)}),[r.genre,r.platform,r.year,r.rating].forEach(n=>n.addEventListener("change",o))}s("#year").textContent=new Date().getFullYear();async function v(e="explore"){switch(e){case"explore":default:await q();break}}v();document.addEventListener("click",e=>{const t=e.target.closest("a[data-route]");if(!t)return;e.preventDefault();const i=t.getAttribute("data-route");v(i)});
