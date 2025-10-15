# 🎮 LevelUp Hub

**LevelUp Hub** is a modern web app that lets users explore, discover, and learn about video games from different platforms — including PC, PlayStation, Xbox, and Nintendo.  
It pulls live data from the **RAWG.io API**, showcasing trending, highly rated, and newly released games in a clean, responsive interface.

---

## 🚀 Live Demo
🔗 **[View it on GitHub Pages](https://luisebsoares.github.io/leveluphub/)**

---

## 🧩 Features

- 🎞️ **Dynamic Game Carousel** – Displays top or trending games on the homepage.
- 🔍 **Explore Page** – Search, filter by platform or genre, and sort by popularity or rating.
- ❤️ **Favorites System** – Save favorite games locally (using `localStorage`).
- 📄 **Detail Pages** – See release info, platforms, ratings, and YouTube trailers.
- 🌙 **Dark / Light Mode** – Clean, accessible UI with theme toggle.
- 📱 **Responsive Design** – Works great on desktop and mobile.
- ⚙️ **Built with Vite** – Fast builds and local development environment.

---

## 🛠️ Tech Stack
|-----------|-------------|
| Frontend | HTML 5, CSS 3, JavaScript (ES Modules) |
| Framework / Bundler | [Vite](https://vitejs.dev/) |
| API | [RAWG.io Game Database](https://rawg.io/apidocs) |
| Deployment | GitHub Pages |
| Version Control | Git + GitHub |

---

## 📦 Project Structure
leveluphub/
├── public/ # Static assets (favicon, preview images)
├── src/
│ ├── assets/ # Icons, logos, misc assets
│ ├── entries/ # Entry points for each HTML page
│ ├── pages/ # Page-specific scripts (home.js, explore.js, etc.)
│ ├── services/ # API service modules (RAWG, YouTube)
│ ├── utils/ # Helper functions (DOM, formatting)
│ ├── styles.css # Global styling
│ ├── include.js # Header/Footer partial loader
│ └── main.js # Common JS entry
├── partials/ # Header and footer HTML templates
├── index.html # Home page
├── explore.html # Explore / search page
├── favorites.html # Saved games page
├── about.html # About / info page
├── vite.config.js # Vite configuration (base path for GitHub Pages)
├── package.json