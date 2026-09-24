// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The public URL of the deployed site. Change this when the site goes live,
  // e.g. for GitHub Pages: site: 'https://gill-g.github.io'
  site: 'http://localhost:4321',

  // Plain static HTML output: deployable to GitHub Pages, Netlify, Vercel or S3.
  output: 'static',
});
