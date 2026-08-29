import krctLogo from '../assets/krct-logo.png'
import krceLogo from '../assets/krce-logo.png'

export const COLLEGES = {
  KRCT: {
    id: 'KRCT',
    name: 'K. Ramakrishnan College of Technology',
    short: 'KRCT',
    logo: krctLogo
  },
  KRCE: {
    id: 'KRCE',
    name: 'K. Ramakrishnan College of Engineering',
    short: 'KRCE',
    logo: krceLogo
  }
}

export const DEPARTMENTS = [
  'Artificial Intelligence & Data Science',
  'CSE - Artificial Intelligence & Machine Learning',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Sciences & Humanities'
]

// Departments shown for each college. Edit these lists to reflect what each
// college actually offers — the form filters the department dropdown by the
// selected college.
export const COLLEGE_DEPARTMENTS = {
  KRCT: [
    'Artificial Intelligence & Data Science',
    'CSE - Artificial Intelligence & Machine Learning',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Sciences & Humanities'
  ],
  KRCE: [
    'Artificial Intelligence & Data Science',
    'CSE - Artificial Intelligence & Machine Learning',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Sciences & Humanities'
  ]
}

export const QUOTES = [
  'Where Ambition Meets Excellence.',
  'Dream big. Work hard. Shine bright.',
  'The future belongs to those who believe in their dreams.',
  'Small steps every day lead to big changes.',
  'Learn. Unlearn. Relearn.',
  'Your only limit is your mind.',
  'Strive for progress, not perfection.',
  'Great things start with a single step.',
  'Believe you can and you are halfway there.',
  'Make today count, tomorrow will thank you.',
  'Curiosity is the engine of achievement.',
  'Turn your passion into your profession.',
  'Excellence is a habit, not an act.',
  'Be the reason someone believes in good people.',
  'Chase growth, not just grades.'
]

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}