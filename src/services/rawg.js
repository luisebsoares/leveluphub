import { RAWG_KEY as KEY } from '../config.js';
const BASE = 'https://api.rawg.io/api';

function toQuery(params) {
  const q = new URLSearchParams({ key: KEY });
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v);
  });
  return q.toString();
}

export function buildParams(filters = {}) {
  const p = {
    ordering: filters.ordering || '-added',
    page_size: filters.page_size || 24,
  };

  if (filters.search) {
    p.search = filters.search;
    p.search_precise = true;
    if (filters.search_exact) p.search_exact = true;
  }

  if (filters.genres) p.genres = filters.genres;
  if (filters.platforms) p.platforms = filters.platforms;
  if (filters.dates) p.dates = filters.dates;
  if (filters.metacritic) p.metacritic = filters.metacritic;
  return p;
}

export async function fetchGames(f = {}) {
  const url = `${BASE}/games?${toQuery(buildParams(f))}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('RAWG games error');
  return res.json();
}

export async function fetchGenres() {
  const res = await fetch(`${BASE}/genres?${toQuery({})}`);
  if (!res.ok) throw new Error('RAWG genres error');
  return (await res.json()).results || [];
}

export async function fetchPlatforms() {
  const res = await fetch(`${BASE}/platforms?${toQuery({ page_size: 50 })}`);
  if (!res.ok) throw new Error('RAWG platforms error');
  return (await res.json()).results || [];
}

export async function fetchGame(id) {
  const res = await fetch(`${BASE}/games/${id}?${toQuery({})}`);
  if (!res.ok) throw new Error('RAWG game error');
  return res.json();
}

export async function fetchScreenshots(id) {
  const res = await fetch(`${BASE}/games/${id}/screenshots?${toQuery({ page_size: 8 })}`);
  if (!res.ok) throw new Error('RAWG screenshots error');
  return (await res.json()).results || [];
}

export async function fetchNewReleasesByParentPlatforms({ parentPlatforms, startDate, endDate, pageSize = 12 }) {
  const params = new URLSearchParams({
    key: KEY,
    dates: `${startDate},${endDate}`,
    parent_platforms: parentPlatforms, // e.g. "1,2,3"
    ordering: "-added",                // popularity proxy
    page_size: String(pageSize)
  });

  const url = `${BASE}/games?${params.toString()}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`RAWG error (${r.status}) for ${url}`);
  const data = await r.json();
  return data.results || [];
}
