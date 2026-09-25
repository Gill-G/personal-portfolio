// Everything personal about the site lives here, so components never hardcode it.
// TODO: replace the placeholder values with your real details.

export const site = {
  name: 'Gurnoor Gill',
  firstName: 'Gurnoor',
  lastName: 'Gill',
  initials: 'GG',
  role: 'Software Developer',
  // One sentence shown under your name on the home screen.
  intro: 'Placeholder intro: one line about what you build and what you care about.',
  location: 'City, Country',
  status: 'Open to internships',
  email: 'your.email@example.com',
  // Leave a link empty ('') to hide it.
  links: {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    // A file in /public (replace public/resume.pdf with your real résumé) or a full URL.
    resume: 'resume.pdf',
  },
  description: 'Portfolio of Gurnoor Gill, software developer.',
} as const;
