// The sections of the one-page site, in scroll order. Each `id` must match the
// `id` on its <section>. Add an entry here when you add a new section.
// "Home" isn't listed: the GG logo in the top left takes you back there.

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;
