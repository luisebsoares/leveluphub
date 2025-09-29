const BASE = "https://api.rawg.io/api";
const KEY = import.meta.env.VITE_RAWG_KEY;

function toQuery(params){
  const q = new URLSearchParams({ key: KEY });
  for (const [k,v] of Object.entries(params)){
    if (v === undefined || v === null || v === "" ) continue;
    q.set(k, v);
  }
  return q.toString();
}

/**
 * Build RAWG query params from filter state
 * @param {Object} filters {search, genres, platforms, dates, ordering, page_size, metacritic}
 */
export function buildParams(filters = {}){
  const params = {
    ordering: filters.ordering || "-added",
    page_size: filters.page_size || 24,
  };
  if (filters.search) params.search = filters.search;
  if (filters.genres) params.genres = filters.genres;            // comma-separated ids or slugs
  if (filters.platforms) params.platforms = filters.platforms;    // comma-separated ids
  if (filters.dates) params.dates = filters.dates;                // YYYY-MM-DD,YYYY-MM-DD
  if (filters.metacritic) params.metacritic = filters.metacritic; // e.g. 80,100
  return params;
}

export async function fetchGames(filters = {}){
  const params = buildParams(filters);
  const url = `${BASE}/games?${toQuery(params)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG error ${res.status}`);
  return res.json();
}

export async function fetchGenres(){
  const res = await fetch(`${BASE}/genres?${toQuery({})}`);
  if (!res.ok) throw new Error(`RAWG genres error ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchPlatforms(){
  const res = await fetch(`${BASE}/platforms?${toQuery({ page_size: 50 })}`);
  if (!res.ok) throw new Error(`RAWG platforms error ${res.status}`);
  const data = await res.json();
  return data.results || [];
}
