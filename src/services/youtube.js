import { YT_KEY as KEY } from '../config.js';

export async function findTrailerId(name) {
  if (!KEY) return null;
  const q = encodeURIComponent(`${name} trailer`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&key=${KEY}&q=${q}`;
  const res = await fetch(url); if (!res.ok) return null;
  const data = await res.json(); return data.items?.[0]?.id?.videoId || null;
}
