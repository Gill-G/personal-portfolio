/*
 * Builds a path to a file in /public that works under either deploy's base path.
 * url('resume.pdf') -> '/personal-portfolio/resume.pdf' on GitHub Pages, '/resume.pdf' on Vercel.
 * Full URLs (https://..., mailto:...) are returned unchanged.
 */
export function url(path: string): string {
  if (/^[a-z]+:/i.test(path)) return path;
  // BASE_URL is '/personal-portfolio' or '/' (see astro.config.mjs). Trim the slashes at
  // the join so there is always exactly one '/' between base and path.
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
