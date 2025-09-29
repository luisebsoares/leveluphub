export function parseHash() {
  const [path, query = ''] = location.hash.slice(1).split('?');
  const params = Object.fromEntries(new URLSearchParams(query));
  return { path: '/' + (path || ''), params };
}
export function setHash(path, params = {}) {
  const q = new URLSearchParams(params).toString();
  const s = q ? `#${path}?${q}` : `#${path}`;
  if (s !== location.hash) history.pushState(null, '', s);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
