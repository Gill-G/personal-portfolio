// Education entries, newest first.
// TODO: replace these placeholders with your real schools and programs.

export interface EducationEntry {
  period: string;
  school: string;
  program: string;
  location: string;
  details: string[];
  current?: boolean;
}

export const education: EducationEntry[] = [
  {
    period: '20XX — Present',
    school: 'School Name',
    program: 'Program or Degree Name',
    location: 'City, Country',
    details: [
      'Placeholder: a highlight such as relevant coursework or a focus area.',
      'Placeholder: an award, club, or role worth mentioning.',
    ],
    current: true,
  },
  {
    period: '20XX — 20XX',
    school: 'Previous School',
    program: 'Diploma or Certificate',
    location: 'City, Country',
    details: ['Placeholder: one line about what you took away from it.'],
  },
];
