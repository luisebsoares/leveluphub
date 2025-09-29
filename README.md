# LevelUp Hub — Week 5 Starter

This starter matches your proposal goals: trending games grid, filters (genre/year/platform/rating), simple error states, and a clean Vite + vanilla JS module setup.

## Quick start
1. Extract the zip.
2. In the folder, run:
   ```bash
   npm install
   npm run dev
   ```
3. Create a `.env` file (see `.env.example`) and paste your RAWG API key:
   ```env
   VITE_RAWG_KEY=your_rawg_key_here
   ```

## Project structure
```
src/
  components/
    footer.js
    header.js
    nav.js
  pages/
    explore.js
  services/
    rawg.js
  utils/
    dom.js
  assets/
    logo.svg
  styles.css
  main.js
index.html
public/
  favicon.svg
```

## Notes
- Filters are wired into the RAWG query builder in `services/rawg.js`.
- Error/empty states render into the grid area with friendly messages.
- Swap to React later if you want — the service and page logic will carry over.
