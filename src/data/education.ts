// Education entries, newest first.

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
    period: '2025 — 2028',
    school: 'Sheridan College',
    program: 'Advanced Diploma, Software Development & Network Engineering',
    location: 'Oakville, Canada',
    // Coursework from the résumé, grouped so the list stays short.
    details: [
      'Software: Python Programming, Java OOP, JavaScript, HTML & CSS',
      'Systems & cloud: AWS Cloud Computing, Linux OS, Networking Basics',
      'Data: Database Design and Implementation',
    ],
    current: true,
  },
  {
    period: '2019 — 2020',
    school: 'McMaster University',
    program: 'Bachelor of Engineering (incomplete)',
    location: 'Hamilton, Canada',
    details: [
      "I spent a year at McMaster University before I was truly ready, and I'm grateful for everything that year taught me about myself.",
    ],
  },
];
