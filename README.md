# personal-portfolio

Personal portfolio of **Gurnoor Gill**, designed and built from scratch.

**Live:** https://gill-g.github.io/personal-portfolio/

## Features

- One scrolling page (Home, About, Education, Projects, Contact) with tabs that track your position
- Smooth scrolling and scroll-triggered animation
- Dark and light themes that follow your system setting
- Keyboard accessible, WCAG AA contrast, and reduced-motion support
- Mobile menu and a résumé button in the header

## Tech stack

| Tool                                                  | Used for                                         |
| ----------------------------------------------------- | ------------------------------------------------ |
| [Astro 7](https://astro.build)                        | Static site framework (plain HTML output)        |
| TypeScript (strict)                                   | Scripts and type-checked content                 |
| Plain CSS + design tokens                             | All styling. No Tailwind or CSS-in-JS            |
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth scrolling                                 |
| GitHub Actions + GitHub Pages                         | Automatic build and deploy on every push to main |
| [Vercel](https://vercel.com)                          | Second deploy, served from the domain root       |

## Technical highlights

- **No UI framework in the browser.** Pages are static HTML. The little interactivity there
  is uses small TypeScript modules, so the site loads fast.
- **Content kept apart from code.** Personal details, section text and projects live in
  typed data files and a Markdown content collection. Adding a project means adding one
  Markdown file, and the build fails if a field is missing or has the wrong type.

## Design system

All visual values live in `src/styles/tokens.css`:

- **Palette:** ink, bone and one lime accent, in dark (default) and light themes
- **Type:** Bricolage Grotesque for headings and body, JetBrains Mono for labels
- **Spacing:** an 8pt grid
- **Motion:** short 150–250ms transitions, turned off under `prefers-reduced-motion`

## Getting started

Requires **Node.js 22.12 or newer**.

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321/personal-portfolio/
```

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the local dev server                        |
| `npm run build`   | Type-check (`astro check`), then build to `dist/` |
| `npm run preview` | Serve the built `dist/` folder locally            |

## Project structure

```text
public/              Static files (favicon, résumé PDF)
src/
  config/            Site-wide details and navigation
  data/              About and Education content
  content/projects/  One Markdown file per project
  components/        Page sections and reusable building blocks
  layouts/           The page shell
  pages/             Routes (the site is a single page)
  scripts/           Browser behaviour: scrolling, navigation, animation
  styles/            Design tokens and global styles
.github/workflows/   Build and deploy pipeline
```

## Deployment

The same code deploys to two places:

- **GitHub Pages:** every push to `main` runs `.github/workflows/deploy.yml`, which builds
  the site and publishes it at the `/personal-portfolio` sub-path.
- **Vercel:** builds from the domain root. `astro.config.mjs` detects Vercel's build
  environment (`VERCEL`) and switches `site` and `base` to match.

Links to files in `public/` go through the `url()` helper in `src/utils/url.ts`, which adds
the right base path for either deploy.

## Roadmap

- [ ] Project detail pages generated from each project's Markdown
- [ ] Light/dark theme toggle
- [ ] Custom domain or the shorter `gill-g.github.io` address

## Contact

[gillg.dev@gmail.com](mailto:gillg.dev@gmail.com) ·
[LinkedIn](https://www.linkedin.com/in/gurnoor-gill-a33280431/) ·
[GitHub](https://github.com/Gill-G)
