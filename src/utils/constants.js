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
  'Sciences & Humanities',
  'Computer Science and Business Systems'
]

// Departments shown for each college, pulled from each college's website.
// The form filters the department dropdown by the selected college.
//   KRCT offers Civil Engineering; KRCE offers Computer Science and Business
//   Systems instead (and no Civil).
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
    'Sciences & Humanities',
    'Computer Science and Business Systems'
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

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

// Deterministic quote per student: the same name always maps to the same quote,
// so the stored card and the live display slideshow never disagree.
export function getQuoteFor(name) {
  const key = String(name || '').trim().toLowerCase()
  if (!key) return getRandomQuote()
  return QUOTES[hashString(key) % QUOTES.length]
}