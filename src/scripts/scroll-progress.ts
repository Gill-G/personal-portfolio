/*
 * Scroll progress bar (ScrollProgress.astro): stretches the bar across the top of
 * the window to match how far down the page you've scrolled.
 */
const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');

// How far down the page you are, from 0 (top) to 1 (bottom).
function update() {
  if (!bar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
  // scaleX stretches the full-width bar from the left; cheaper than changing its width.
  bar.style.transform = `scaleX(${progress})`;
}

// Update at most once per frame while scrolling (Lenis scrolls the window too,
// so its smooth scrolling drives the bar just as smoothly).
let queued = false;
window.addEventListener(
  'scroll',
  () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  },
  { passive: true },
);

// The page's length can change (window resize, images loading), so re-measure.
window.addEventListener('resize', update);
new ResizeObserver(update).observe(document.body);
update();
