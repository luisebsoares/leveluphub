const KEY = 'levelup-favorites';
export function getFavorites() { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
export function saveFavorites(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
export function toggleFavorite(game) {
  const list = getFavorites();
  const exists = list.find(x => x.id === game.id);
  const next = exists ? list.filter(x => x.id !== game.id) : [...list, game];
  saveFavorites(next); return next;
}
export function isFav(id) { return getFavorites().some(x => x.id === id); }
