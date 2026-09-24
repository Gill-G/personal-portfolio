// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The public URL of the deployed site (GitHub Pages). Used for canonical links.
  site: 'https://gill-g.github.io',

  // GitHub Pages serves this repo from a sub-path: gill-g.github.io/personal-portfolio/
  // Any path to a file in /public must include it (see BaseLayout's favicon link).
  // In-page links like #about don't need it.
  base: '/personal-portfolio',

  // Plain static HTML output: deployable to GitHub Pages, Netlify, Vercel or S3.
  output: 'static',
});
