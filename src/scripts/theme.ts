/*
 * Theme toggle (the round button in the header): flips between light and dark and
 * remembers the choice. The inline script in BaseLayout applies a saved choice before
 * the page paints. Until the visitor picks one, the OS setting decides (tokens.css).
 *
 * The switch is a circle reveal: the new theme spreads out from the button. It uses
 * the browser's View Transitions; without them, or with reduced motion, it's instant.
 */
import { prefersReducedMotion } from './smooth-scroll';

type Theme = 'light' | 'dark';

const REVEAL_MS = 500;

const root = document.documentElement;
const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const osDark = window.matchMedia('(prefers-color-scheme: dark)');

// The browser's own UI colour (e.g. the mobile address bar), from BaseLayout's
// theme-color tags. They follow the OS, so a picked theme overrides them.
const browserColorTags = [
  ...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'),
];
const browserColor = Object.fromEntries(
  browserColorTags.map((tag) => [tag.media.includes('dark') ? 'dark' : 'light', tag.content]),
);

function currentTheme(): Theme {
  const picked = root.dataset.theme;
  if (picked === 'light' || picked === 'dark') return picked;
  return osDark.matches ? 'dark' : 'light';
}

function syncBrowserColor() {
  if (!root.dataset.theme) return;
  for (const tag of browserColorTags) tag.content = browserColor[currentTheme()];
}

// The label says what a click will do, e.g. "Switch to light theme".
function updateLabel() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  button?.setAttribute('aria-label', `Switch to ${next} theme`);
}

function setTheme(theme: Theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Storage can be blocked: the theme still switches, it just isn't remembered.
  }
  syncBrowserColor();
  updateLabel();
}

function revealFrom(origin: HTMLElement, change: () => void) {
  if (prefersReducedMotion || !('startViewTransition' in document)) {
    change();
    return;
  }
  const box = origin.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  // Big enough to reach the farthest corner of the screen.
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  // The browser snapshots the page, applies the change, then we grow a circle that
  // shows the new look over the old (global.css turns off the default cross-fade).
  const transition = document.startViewTransition(change);
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: REVEAL_MS,
        easing: getComputedStyle(root).getPropertyValue('--ease-in-out'),
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
}

button?.addEventListener('click', () => {
  // Lets the new icon spin in (Header.astro), but not on page load.
  button.toggleAttribute('data-switched', true);
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  revealFrom(button, () => setTheme(next));
});

// Before a pick, the theme follows the OS live, so keep the label in step.
osDark.addEventListener('change', updateLabel);

syncBrowserColor();
updateLabel();
