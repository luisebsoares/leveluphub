export const el = (sel, root = document) => root.querySelector(sel);
export const els = (sel, root = document) => [...root.querySelectorAll(sel)];
export function html(target, markup) { if (typeof target === 'string') target = el(target); target.innerHTML = markup; }
export function append(target, markup) { if (typeof target === 'string') target = el(target); target.insertAdjacentHTML('beforeend', markup); }
export function showSpinner(target) { html(target, '<div class="spinner" role="status" aria-label="Loading"></div>'); }
export function safe(text) { return (text || '').toString().replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[s])); }
