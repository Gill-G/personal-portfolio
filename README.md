# personal-portfolio

Personal tech portfolio for **Gurnoor Gill**: a single scrolling page with Home, About,
Education, Projects and Contact sections.

**Live:** https://gill-g.github.io/personal-portfolio/

## Features

- **One-page layout.** Tabs in the top right glide to each section. The active tab is
  highlighted as you scroll, and the GG logo in the top left takes you back to the top.
- **Smooth scrolling** with [Lenis](https://github.com/darkroomengineering/lenis).
- **Bold, abstract design.** Oversized condensed type, a morphing blob that leans toward
  the cursor, marquee bands that react to scroll speed, and scroll-triggered reveals.
- **Dark and light themes** that follow the visitor's OS setting.
- **Accessible.** Keyboard navigation with visible focus, a skip link, WCAG AA contrast in
  both themes, and all motion turned off for visitors who prefer reduced motion.
- **Mobile friendly.** On small screens the tabs collapse into a full-screen menu.
- **Résumé button** in the header that opens the PDF in a new tab.

## Tech stack

| Tool                                                  | Used for                                         |
| ----------------------------------------------------- | ------------------------------------------------ |
| [Astro 7](https://astro.build)                        | Static site framework (plain HTML output)        |
| TypeScript (strict)                                   | Scripts and type-checked content                 |
| Plain CSS + design tokens                             | All styling. No Tailwind or CSS-in-JS            |
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth scrolling                                 |
| GitHub Actions + GitHub Pages                         | Automatic build and deploy on every push to main |

Fonts: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) and
[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts.

## Getting started

Requires **Node.js 22.12 or newer**.

```bash
npm install      # install dependencies
npm run dev      # start the dev server
```

The dev server runs at **http://localhost:4321/personal-portfolio/**, where the
`/personal-portfolio/` part matches the GitHub Pages address. It reloads when you save
a file. In Astro 7 it runs in the background, so stop it with `npx astro dev stop`.

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the local dev server                            |
| `npm run build`   | Type-check (`astro check`), then build to `dist/`     |
| `npm run preview` | Serve the built `dist/` folder locally                |
| `npm run check`   | Type-check only                                       |

## Project structure

```text
public/                  Files served as-is (favicon, résumé PDF)
src/
  config/
    site.ts              Name, role, intro, email, links, résumé file
    nav.ts               The sections shown in the header tabs
  data/
    about.ts             About section text, facts and toolkit
    education.ts         Education timeline entries
  content/projects/      One Markdown file per project
  content.config.ts      The project fields and their types
  components/
    sections/            Hero, About, Education, Projects, Contact
    Header.astro         Logo, tabs, résumé button, mobile menu
    ...                  Smaller building blocks (Blob, Marquee, ProjectCard, ...)
  layouts/BaseLayout.astro   The page shell: <head>, fonts, header, footer, scripts
  pages/index.astro      The one page. It stacks the section components in order
  scripts/               Browser behaviour: smooth scroll, nav, animations, copy button
  styles/
    tokens.css           Design tokens: colors, fonts, spacing, motion
    global.css           Reset, base styles, reveal animations
  utils/url.ts           withBase(): adds /personal-portfolio to /public file paths
.github/workflows/deploy.yml   Builds and deploys to GitHub Pages
```

## Updating content

Personal details and page text live in data files, never inside the components.

| To change...                                     | Edit                                  |
| ------------------------------------------------ | ------------------------------------- |
| Name, role, intro, status, email, social links   | `src/config/site.ts`                  |
| About text, quick facts, toolkit                 | `src/data/about.ts`                   |
| Education entries                                | `src/data/education.ts`               |
| Tag line under a section title                   | `kicker` on its `SectionHeading`      |

In the About lead, wrap words in `[square brackets]` to give them the volt highlight.

### Résumé

1. Put the PDF in `public/`.
2. Set `links.resume` in `src/config/site.ts` to its file name, for example
   `'Resume_GurnoorGill.pdf'`.

The header button and the Contact link both update from that one setting. Set it to
`''` to hide both.

### Adding a project

1. Copy `src/content/projects/_template.md` to a new file, such as `my-app.md`.
   Files starting with `_` are ignored.
2. Fill in the front matter:

   ```yaml
   title: My App
   summary: One sentence on what it does and why it matters.
   year: '2026'
   order: 1 # lower numbers show first
   status: shipped # shipped | in-progress | concept
   tags: [TypeScript, React]
   repo: https://github.com/Gill-G/my-app # optional
   demo: https://my-app.example.com # optional
   ```

3. Save. The card appears in the Projects section by itself. The build fails with a clear
   message if a field is missing or has the wrong type.

Cards alternate between wide and narrow in a repeating pattern of four. Each card gets
its own generated blob artwork.

### Adding a section

1. Create `src/components/sections/MySection.astro`. Use an existing section as the model:
   a `<section id="my-section" tabindex="-1">` with a `SectionHeading`.
2. Add it to `src/pages/index.astro` where it should appear.
3. Add `{ id: 'my-section', label: 'My Section' }` to `src/config/nav.ts` to give it a tab.

## Design system

All visual values are tokens in `src/styles/tokens.css`. Components use only these
tokens, so re-theming the site means editing one file.

- **Palette "Volt":** ink `#0C0C0E`, bone `#ECE8DF` and a single acid-lime accent
  `#D4FF3A`. Dark mode is the default look. Light mode swaps ink and bone, and uses an
  olive shade of the accent for text and small marks so they keep enough contrast.
- **Type:** Bricolage Grotesque, condensed and heavy for headlines and regular for body
  text. JetBrains Mono for labels. Font sizes scale smoothly with the screen width.
- **Spacing:** an 8pt grid (`--space-1` … `--space-10`).
- **Motion:** 150–250ms transitions and longer reveal wipes. All of it switches off
  under `prefers-reduced-motion`.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site with
[`withastro/action`](https://github.com/withastro/action) and publishes it to GitHub
Pages. A deploy takes about a minute. You can re-run one by hand from the **Actions** tab.

The site is served from a sub-path, so `astro.config.mjs` sets
`base: '/personal-portfolio'`:

- Links to files in `public/` must go through `withBase()` from `src/utils/url.ts`.
- In-page links like `#about` work as they are.

## Roadmap

- [ ] Replace the placeholder content (intro, About, Education, projects, email, links)
- [ ] Project detail pages generated from each project's Markdown
- [ ] Light/dark theme toggle
- [ ] Custom domain or the shorter `gill-g.github.io` address
