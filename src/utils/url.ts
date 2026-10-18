/*
 * The deploy's base path, without a trailing slash: '/personal-portfolio' on GitHub
 * Pages, '' on Vercel (BASE_URL comes from `base` in astro.config.mjs).
 */
export const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '');

/*
 * Builds a path to a file in /public that works under either deploy's base path.
 * url('resume.pdf') -> '/personal-portfolio/resume.pdf' on GitHub Pages, '/resume.pdf' on Vercel.
 * Full URLs (https://..., mailto:...) are returned unchanged.
 */
export function url(path: string): string {
  if (/^[a-z]+:/i.test(path)) return path;
  // Trim slashes at the join so there is always exactly one '/' between base and path.
  return `${basePath}/${path.replace(/^\/+/, '')}`;
}
