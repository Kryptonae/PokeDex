# PokéDex

A modern, responsive Pokémon explorer built with **React**, **Vite**, and **Tailwind CSS**. Search for a Pokémon, browse the Pokédex with "Load More" pagination, flip cards to inspect base stats, and switch between light and dark themes with an animated reveal.

**Live demo:** [https://kryptonae.github.io/PokeDex/](https://kryptonae.github.io/PokeDex/)

## Features

- **Pokémon search** by name or Pokédex number using the [PokéAPI](https://pokeapi.co/).
- **Paginated browsing** with parallel detail fetching and a "Load More" button.
- **3D flip cards** on hover, tap, or keyboard focus.
- **Base stats view** with height, weight, individual stat bars, and total stats.
- **Type-coloured chips** for every Pokémon type.
- **Light and dark themes** with a circle reveal powered by the View Transitions API.
- **Theme persistence** in `localStorage` with system-preference fallback and no flash on reload.
- **Theme-aware particle background** that reacts to the cursor.
- **Polished image loading** with a skeleton, fade-in, priority/lazy loading, and sprite fallback.
- **Responsive layout** with no horizontal overflow on small screens.
- **Accessibility touches** including focus rings, keyboard card flipping, screen-reader labels, and reduced-motion support.

## Tech Stack

| Tool | Purpose |
| --- | --- |
| [React 19](https://react.dev/) | UI and component state |
| [Vite 8](https://vite.dev/) | Development server and production build |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling and dark-mode variants |
| [Framer Motion](https://motion.dev/) | Navbar hover animation |
| [Lucide React](https://lucide.dev/) | Icons |
| [Oxlint](https://oxc.rs/docs/guide/usage/linter) | Linting |
| [PokéAPI](https://pokeapi.co/) | Pokémon data and artwork |

Several UI effects are adapted from [MagicUI](https://magicui.design/) (Animated Theme Toggler, Particles, Aurora Text) and [Animata](https://animata.design/) (flip card).

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
git clone https://github.com/Kryptonae/PokeDex.git
cd PokeDex
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

The production build uses the `/PokeDex/` base path. Preview it at [http://localhost:4173/PokeDex/](http://localhost:4173/PokeDex/).

## Project Structure

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                    # Search, pagination, and page layout
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Theme base, animations, view transitions
│   └── componenets/
│       ├── Card.jsx               # Pokémon card face and stats
│       ├── Footer.jsx
│       ├── Header.jsx
│       ├── theme-provider.jsx
│       ├── theme-context.js
│       ├── use-theme.js
│       ├── animata/
│       │   ├── background/        # Legacy boids background
│       │   └── card/              # CSS-only flip card
│       └── ui/                    # Reusable animation and UI components
├── index.html
├── vite.config.js
└── package.json
```

## Deployment to GitHub Pages

This project is a Vite single-page app and must be deployed from its **built `dist/` output**, not from the repository root. The included workflow at `.github/workflows/deploy.yml` builds and publishes the app automatically.

### One-time setup

1. Push the repository to GitHub.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to the `main` branch, or run the workflow manually from the **Actions** tab.

The site will be available at:

```text
https://<username>.github.io/<repository>/
```

For this repository:

```text
https://kryptonae.github.io/PokeDex/
```

### Why the 404 happens

GitHub Pages does **not** compile JSX or run Vite. If Pages serves the repository root, the browser receives `index.html` with `/src/main.jsx`, which cannot run in production. Assets also need to be served from the repository subpath.

This project fixes both issues:

- `vite.config.js` sets `base: "/PokeDex/"` for production builds.
- `.github/workflows/deploy.yml` uploads only the compiled `dist/` folder.
- The favicon uses `%BASE_URL%favicon.svg`, so it resolves correctly under `/PokeDex/`.

If the repository is renamed, update the `base` value in `vite.config.js` to match the new repository name.

### Troubleshooting

- **Blank page after deployment:** confirm Pages is using **GitHub Actions**, then check the latest workflow run for build errors.
- **Assets 404 under `/assets/...`:** the production base path is missing. It should be `/PokeDex/assets/...`.
- **Old version still showing:** hard-refresh the page (`Ctrl + Shift + R`) or re-run the deployment workflow.
- **404 on a deep link:** this app only uses hash links (`#home`, `#explore`, `#about`), so no SPA rewrite is required.

## Data and API

The app uses public PokéAPI endpoints:

```text
https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
https://pokeapi.co/api/v2/pokemon/{name-or-id}
```

No API key or environment variables are required. Artwork is loaded from the PokéAPI sprite repository on `raw.githubusercontent.com`.

## Customization

- **Theme colors and animations:** `src/index.css`
- **Navbar and theme toggle:** `src/componenets/Header.jsx`
- **Card design and image fallbacks:** `src/componenets/Card.jsx`
- **Footer links and social profiles:** `src/componenets/Footer.jsx`
- **Particle quantity and colors:** the `<Particles />` props in `src/App.jsx`
- **Page size:** the `limit=20` query in `src/App.jsx`

## Credits

- Pokémon data and sprites: [PokéAPI](https://pokeapi.co/)
- Component inspiration: [MagicUI](https://magicui.design/) and [Animata](https://animata.design/)
- Icons: [Lucide](https://lucide.dev/)

## Disclaimer

This is a fan-made educational project. Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and GAME FREAK Inc. This project is not affiliated with or endorsed by them.
