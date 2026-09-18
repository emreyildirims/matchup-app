# MatchUp — Amateur Football Platform (MVP)

A mobile-first web app prototype for organizing amateur ("halı saha") football: build a team, join matches, find missing players and book goalkeepers.

Designed and developed by [Mehmet Emre Yıldırım](https://www.linkedin.com/in/mehmetemreyildirim).

## Features

- Match listings with filters (city, position, time, price) and join flow
- Team creation and joining, team profiles and recent form
- Goalkeeper listings with ratings, availability and booking flow
- "Find players" posts, venues, leaderboard, favorites and in-app chat screens
- Player profile with stats and a FIFA-style player card
- Global live search, notifications, dark/light theme
- Splash screen, skeleton loaders, toasts, modals and page transitions

## Architecture

- **No framework, no build step.** Vanilla JavaScript single-page app.
- **Hash-based router.** Each page is an object `{ title, render(), after() }`; `render()` returns HTML and `after()` binds page-specific listeners.
- **Event delegation.** Buttons declare `data-action`; a single click handler dispatches to a shared `Actions` registry.
- **Data layer.** Demo data lives in `data/data.js`; user-generated state is persisted to `localStorage` through a small `Store` wrapper, so a real API can replace it by changing two files.
- **Security.** User input is escaped before rendering to prevent XSS.

## Running

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 5500
```

Login buttons start a demo session; no real authentication is used.

## Structure

```
├── index.html
├── app.js              Router, navigation, search, theme
├── components/         Modal and toast systems
├── data/               Demo data
├── pages/              One file per screen
├── styles/             Design tokens, components, animations
└── utils/              DOM helpers, icons, storage
```

## Roadmap

REST API with authentication, tournaments, map integration, post-match ratings, venue owner dashboard, PWA support.

## License

All rights reserved. This code is shared for portfolio purposes only — see [LICENSE](LICENSE).
