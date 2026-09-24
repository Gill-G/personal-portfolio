/*
 * Header behaviour:
 *  1. Highlights the tab for the section you're currently reading ("scroll spy").
 *  2. Slides the accent pill under that tab.
 *  3. Gives the header a backdrop once you've scrolled off the top.
 *  4. Opens and closes the full-screen menu on small screens.
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

/* ---- 3: header backdrop ---- */

function updateHeader() {
  header?.toggleAttribute('data-scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ---- 4: small-screen menu ---- */

const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const menu = document.getElementById('menu');

function setMenu(open: boolean) {
  if (!menuButton || !menu) return;
  menuButton.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
  header?.toggleAttribute('data-menu-open', open);
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
