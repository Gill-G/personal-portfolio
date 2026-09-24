/*
 * Smooth scrolling with Lenis, plus in-page link handling.
 *
 * Lenis replaces the browser's jumpy wheel scrolling with an eased glide. It is
 * skipped entirely for people who ask their OS for reduced motion; they get
 * normal scrolling and instant jumps instead.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// `null` when reduced motion is on. Other scripts check for that.
export const lenis = prefersReducedMotion ? null : new Lenis({ autoRaf: true, lerp: 0.1 });

/** Scrolls to a section, then moves keyboard focus there so Tab continues from it. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const focusTarget = () => target.focus({ preventScroll: true });

  if (id === 'home') {
    if (lenis) lenis.scrollTo(0, { onComplete: focusTarget });
    else window.scrollTo({ top: 0 });
  } else if (lenis) {
    lenis.scrollTo(target, { onComplete: focusTarget });
  } else {
    target.scrollIntoView();
  }

  if (!lenis) focusTarget();
  // Keep the URL shareable (e.g. /#projects) without adding a history entry per click.
  history.replaceState(null, '', id === 'home' ? location.pathname : `#${id}`);
}

// One listener for every in-page link (#about, #projects, ...), including ones added later.
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;
  const id = link.hash.slice(1);
  if (!id || !document.getElementById(id)) return;

  event.preventDefault();
  scrollToSection(id);
});

// If the page is opened with a hash (e.g. someone shared /#projects), glide there.
if (location.hash && lenis) {
  const id = location.hash.slice(1);
  window.addEventListener('load', () => lenis.scrollTo(`#${CSS.escape(id)}`, { immediate: true }));
}
