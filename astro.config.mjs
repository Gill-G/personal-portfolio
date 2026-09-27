// @ts-check
import { defineConfig } from 'astro/config';

const isVercel = Boolean(process.env.VERCEL);

// https://astro.build/config
export default defineConfig({
  // The site is deployed twice from this repo. Vercel sets VERCEL=1 during its builds and
  // serves the site from the domain root; GitHub Pages serves it from a sub-path
  // (gill-g.github.io/personal-portfolio/). `site` is used for canonical links; `base` is
  // prefixed onto Astro's own CSS/JS automatically and onto /public files via url()
  // (src/utils/url.ts). In-page links like #about don't need it.
  site: isVercel
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? 'localhost:4321'}`
    : 'https://gill-g.github.io',
  base: isVercel ? '/' : '/personal-portfolio',

  // Plain static HTML output: deployable to GitHub Pages, Netlify, Vercel or S3.
  output: 'static',

  vite: {
    server: {
      // The project lives on the Windows drive (/mnt/c) but runs in WSL, where file-change
      // events don't get through. Polling checks files for changes instead, so the dev
      // server still reloads when you save.
      watch: { usePolling: true, interval: 300 },
    },
  },
});
