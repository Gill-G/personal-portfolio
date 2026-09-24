/*
 * Decorative motion: scroll reveals, the morphing blobs and the marquee bands.
 * Everything here is optional polish. With reduced motion on, the page is
 * fully usable and simply stays still.
 */
import { blobPath } from './blob-shape';
import { lenis, prefersReducedMotion } from './smooth-scroll';

/* ---- Scroll reveals ----
 * Elements marked data-reveal get .is-visible the first time they scroll into
 * view. The CSS in global.css does the actual fade or wipe. */
const revealer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealer.unobserve(entry.target);
      }
    }
  },
  { rootMargin: '0px 0px -10% 0px' },
);
document.querySelectorAll('[data-reveal]').forEach((el) => revealer.observe(el));

/* Tracks which decorative elements are on screen, so offscreen ones don't animate. */
const onScreen = new WeakSet<Element>();
const visibility = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) onScreen.add(entry.target);
    else onScreen.delete(entry.target);
  }
});

/* ---- Morphing blobs ---- */

interface Blob {
  el: SVGSVGElement;
  path: SVGPathElement;
  seed: number;
  follow: boolean;
  // Current and target offsets for the "lean toward the cursor" effect.
  x: number;
  y: number;
  tx: number;
  ty: number;
}

const blobs: Blob[] = [...document.querySelectorAll<SVGSVGElement>('[data-blob]')].flatMap(
  (el) => {
    const path = el.querySelector('path');
    if (!path) return [];
    visibility.observe(el);
    return [
      {
        el,
        path,
        seed: Number(el.dataset.seed ?? 0),
        follow: el.hasAttribute('data-follow'),
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
      },
    ];
  },
);

// Only real mice get the cursor effect (touch screens have no hover position).
if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener(
    'pointermove',
    (event) => {
      for (const blob of blobs) {
        if (!blob.follow) continue;
        const box = blob.el.getBoundingClientRect();
        // -1..1: how far the cursor is from the blob's centre, relative to the window.
        const dx = (event.clientX - (box.left + box.width / 2)) / window.innerWidth;
        const dy = (event.clientY - (box.top + box.height / 2)) / window.innerHeight;
        blob.tx = dx * 80;
        blob.ty = dy * 80;
      }
    },
    { passive: true },
  );
}

/* ---- Marquee bands ----
 * Each band's track holds its words twice. We slide it left and wrap around
 * after one copy's width, so it looks endless. Scrolling faster speeds it up,
 * and scrolling up reverses it (Lenis reports velocity and direction). */

interface Marquee {
  el: HTMLElement;
  track: HTMLElement;
  x: number;
}

const marquees: Marquee[] = [...document.querySelectorAll<HTMLElement>('[data-marquee]')].flatMap(
  (el) => {
    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return [];
    visibility.observe(el);
    return [{ el, track, x: 0 }];
  },
);

let direction = 1;

/* ---- One animation loop for everything ---- */

function frame(now: number) {
  const time = now / 1000;

  for (const blob of blobs) {
    if (!onScreen.has(blob.el)) continue;
    blob.path.setAttribute('d', blobPath(blob.seed, time));
    // Ease 6% of the way toward the target each frame: a soft, lagging follow.
    blob.x += (blob.tx - blob.x) * 0.06;
    blob.y += (blob.ty - blob.y) * 0.06;
    if (blob.follow) blob.el.style.translate = `${blob.x.toFixed(1)}px ${blob.y.toFixed(1)}px`;
  }

  const velocity = lenis?.velocity ?? 0;
  if (lenis && lenis.direction !== 0) direction = lenis.direction;

  for (const marquee of marquees) {
    if (!onScreen.has(marquee.el)) continue;
    const speed = 0.6 + Math.min(Math.abs(velocity) * 0.25, 12);
    const half = marquee.track.scrollWidth / 2;
    marquee.x -= speed * direction;
    // Wrap around so the band never runs out of words.
    if (marquee.x <= -half) marquee.x += half;
    if (marquee.x > 0) marquee.x -= half;
    marquee.track.style.transform = `translate3d(${marquee.x.toFixed(2)}px, 0, 0)`;
  }

  requestAnimationFrame(frame);
}

if (!prefersReducedMotion) requestAnimationFrame(frame);
