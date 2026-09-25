/*
 * Builds a path to a file in /public that works under the GitHub Pages sub-path.
 * withBase('resume.pdf') -> '/personal-portfolio/resume.pdf'
 * Full URLs (https://...) are returned unchanged.
 */
export function withBase(path: string): string {
  if (/^[a-z]+:/i.test(path)) return path;
  // BASE_URL is '/personal-portfolio' (see astro.config.mjs). Strip any trailing
  // slash so joining always gives exactly one '/'.
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
