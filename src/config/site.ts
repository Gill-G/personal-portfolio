// Everything personal about the site lives here, so components never hardcode it.
// TODO: replace the placeholder values with your real details.

export const site = {
  name: 'Gurnoor Gill',
  firstName: 'Gurnoor',
  lastName: 'Gill',
  initials: 'GG',
  role: 'Software Development @ Sheridan College',
  // The quote shown under your name on the home screen. Quote marks are added for you.
  quote: {
    text: 'It is impossible for a man to learn what he thinks he already knows.',
    author: 'Epictetus',
    source: 'Discourses',
  },
  location: 'City, Country',
  status: 'Open to internships',
  email: 'gillg.dev@gmail.com',
  // Shown in the Contact section, next to a pulsing dot.
  availability: 'Open to Winter 2027 internships · Greater Toronto Area / Remote',
  // Leave a link empty ('') to hide it.
  links: {
    github: 'https://github.com/Gill-G',
    linkedin: 'https://www.linkedin.com/in/gurnoor-gill-a33280431/',
    // A file in /public that will be served as-is. Can be used to provide a downloadable resume.
    resume: 'Resume_GurnoorGill.pdf',
  },
  description: 'Portfolio of Gurnoor Gill, software developer.',
} as const;
