/*
 * Header behaviour:
 *  1. Highlights the tab for the section you're currently reading ("scroll spy").
 *  2. Slides the accent pill under that tab.
 *  3. Gives the header a backdrop once you've scrolled off the top.
 *  4. Hides the header while scrolling down and brings it back on scroll up.
 *  5. Opens and closes the full-screen menu on small screens.
 */
import { lenis } from './smooth-scroll';

const header = document.querySelector<HTMLElement>('[data-header]');
const tabList = document.querySelector<HTMLElement>('[data-tabs]');
const tabs = [...document.querySelectorAll<HTMLAnchorElement>('[data-tab]')];

/* ---- 1 + 2: active tab and sliding pill ---- */

function setActive(id: string | null) {
  let activeTab: HTMLAnchorElement | undefined;

  // Both desktop tabs and menu links carry data-tab, so both stay in sync.
  for (const tab of tabs) {
    const isActive = tab.dataset.tab === id;
    if (isActive) tab.setAttribute('aria-current', 'true');
    else tab.removeAttribute('aria-current');
    if (isActive && tabList?.contains(tab)) activeTab = tab;
  }

  if (!tabList) return;
  if (activeTab) {
    tabList.style.setProperty('--pill-x', `${activeTab.offsetLeft}px`);
    tabList.style.setProperty('--pill-w', `${activeTab.offsetWidth}px`);
    tabList.dataset.pill = 'on';
  } else {
    // On the home screen no tab is active, so the pill hides.
    tabList.dataset.pill = 'off';
  }
}

// A section counts as "current" when it crosses a thin line 40% down the viewport.
const sections = [...document.querySelectorAll<HTMLElement>('main > section[id]')];
let currentId: string | null = null;

const spy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        currentId = entry.target.id === 'home' ? null : entry.target.id;
        setActive(currentId);
      }
    }
  },
  { rootMargin: '-40% 0px -59% 0px' },
);
sections.forEach((section) => spy.observe(section));

// Tab widths change when fonts load or the window resizes, so re-measure.
window.addEventListener('resize', () => setActive(currentId));
document.fonts?.ready.then(() => setActive(currentId));

/* ---- 3 + 4: header backdrop, and hide on scroll down / show on scroll up ----
 *
 * Rules for when the header is hidden (data-hidden):
 *  - Near the top of the page it is always shown.
 *  - Scrolling down hides it; scrolling up shows it.
 *  - Moving the mouse to the top of the screen shows it. Once the mouse has been
 *    there, moving it away again hides it.
 *  - It never hides while the mobile menu is open or a header link has keyboard focus.
 */

// Ignore scroll movements smaller than this, so tiny wobbles don't flicker it.
const SCROLL_THRESHOLD = 8;
let lastScrollY = window.scrollY;
let pointerInTopZone = false;

function headerHeight() {
  return header?.offsetHeight ?? 72;
}

function canHide() {
  if (!header) return false;
  const nearTop = window.scrollY < headerHeight();
  const menuOpen = header.hasAttribute('data-menu-open');
  // Only keyboard focus counts; a mouse click on a tab shouldn't pin the header open.
  const focusInside = header.querySelector(':focus-visible') !== null;
  return !nearTop && !menuOpen && !focusInside && !pointerInTopZone;
}

function setHidden(hidden: boolean) {
  header?.toggleAttribute('data-hidden', hidden && canHide());
}

function onScroll() {
  const y = window.scrollY;
  header?.toggleAttribute('data-scrolled', y > 8);

  const delta = y - lastScrollY;
  if (Math.abs(delta) < SCROLL_THRESHOLD) return;
  setHidden(delta > 0); // down = hide, up = show
  lastScrollY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mouse only: touch screens have no hover, so they rely on the scroll rules above.
if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener(
    'pointermove',
    (event) => {
      // The "top zone" is the header's area plus a little slack below it.
      const inZone = event.clientY <= headerHeight() + 16;
      if (inZone === pointerInTopZone) return;
      pointerInTopZone = inZone;
      if (inZone) setHidden(false);
      else setHidden(true); // left the header area, so tuck it away again
    },
    { passive: true },
  );

  // Leaving the window through the top edge counts as leaving the zone too.
  document.documentElement.addEventListener('pointerleave', () => {
    if (!pointerInTopZone) return;
    pointerInTopZone = false;
    setHidden(true);
  });
}

// Keyboard users: tabbing into the header always reveals it.
header?.addEventListener('focusin', () => setHidden(false));

/* ---- 5: small-screen menu ---- */

const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const menu = document.getElementById('menu');

function setMenu(open: boolean) {
  if (!menuButton || !menu) return;
  menuButton.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
  header?.toggleAttribute('data-menu-open', open);
  if (open) setHidden(false);
  // Freeze page scrolling behind the open menu.
  if (open) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = open ? 'hidden' : '';
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

// Picking a link closes the menu (the click is still handled by smooth-scroll.ts).
menu?.addEventListener('click', (event) => {
  if ((event.target as Element).closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

// If the window grows past the mobile breakpoint while the menu is open, close it.
window.matchMedia('(min-width: 48rem)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});
