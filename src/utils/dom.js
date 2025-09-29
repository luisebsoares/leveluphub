export function el(selector, root = document){
  return root.querySelector(selector);
}
export function els(selector, root = document){
  return [...root.querySelectorAll(selector)];
}
export function html(target, markup){
  if(typeof target === "string") target = el(target);
  target.innerHTML = markup;
}
export function append(target, markup){
  if(typeof target === "string") target = el(target);
  target.insertAdjacentHTML("beforeend", markup);
}
export function showSpinner(target){
  html(target, '<div class="spinner" role="status" aria-label="Loading"></div>');
}
