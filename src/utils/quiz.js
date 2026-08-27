export const CHARACTERS = [
  {
    id: 'the-coder',
    title: 'The Code Wizard',
    emoji: '🧙‍♂️',
    description: 'You think in algorithms and dream in binary. Bugs fear you.',
    color: '#00d4aa'
  },
  {
    id: 'the-leader',
    title: 'The Born Leader',
    emoji: '👑',
    description: 'People follow you naturally. Your words inspire action.',
    color: '#ffc845'
  },
  {
    id: 'the-artist',
    title: 'The Creative Soul',
    emoji: '🎨',
    description: 'You see beauty where others see chaos. Your mind is a canvas.',
    color: '#ff6b9d'
  },
  {
    id: 'the-explorer',
    title: 'The Fearless Explorer',
    emoji: '🧭',
    description: 'The unknown excites you. Every road is an adventure.',
    color: '#4ecdc4'
  },
  {
    id: 'the-strategist',
    title: 'The Mastermind',
    emoji: '🧠',
    description: 'Ten moves ahead, always. You solve puzzles others don\'t see.',
    color: '#a78bfa'
  },
  {
    id: 'the-healer',
    title: 'The Empath',
    emoji: '💚',
    description: 'You feel what others feel. Your kindness changes rooms.',
    color: '#34d399'
  },
  {
    id: 'the-rebel',
    title: 'The Rule Breaker',
    emoji: '🔥',
    description: 'Rules? You make your own. Innovation is your middle name.',
    color: '#f97316'
  },
  {
    id: 'the-scholar',
    title: 'The Knowledge Seeker',
    emoji: '📚',
    description: 'Your thirst for knowledge is unquenchable. Wisdom is your power.',
    color: '#60a5fa'
  }
]

export const FAVOURITE_CHARACTERS = [
  'Iron Man',
  'Batman',
  'Superman',
  'Spider-Man',
  'Captain America',
  'Thor',
  'Hulk',
  'Wolverine',
  'Deadpool',
  'Doctor Strange',
  'Black Panther',
  'Thanos',
  'Joker',
  'Sherlock Holmes',
  'Dexter',
  'Luffy',
  'Naruto',
  'Goku',
  'Vegeta',
  'Light Yagami',
  'L Lawliet',
  'Eren Yeager',
  'Gojo Satoru',
  'Zoro',
  'Saitama',
  'Levi Ackerman',
  'Alakh Pandey (Physics Wallah)',
  'Elon Musk',
  'MS Dhoni',
  'Virat Kohli',
  'Thalapathy Vijay',
  'Allu Arjun',
  'Shah Rukh Khan',
  'Rajinikanth',
  'APJ Abdul Kalam',
  'Swami Vivekananda',
  'None / Skip'
]

export const QUESTIONS = [
  {
    id: 1,
    question: 'First day at college. You...',
    options: [
      { text: 'Scan every notice board and club list', scores: { 'the-explorer': 3, 'the-scholar': 1 } },
      { text: 'Walk up to strangers and start talking', scores: { 'the-leader': 3, 'the-healer': 2 } },
      { text: 'Find the best corner to sit and observe', scores: { 'the-strategist': 3, 'the-artist': 1 } },
      { text: 'Check if the campus has good WiFi', scores: { 'the-coder': 3, 'the-rebel': 1 } }
    ]
  },
  {
    id: 2,
    question: 'Your canteen squad is deciding lunch. You...',
    options: [
      { text: 'Decide for everyone — "We\'re going HERE"', scores: { 'the-leader': 3, 'the-rebel': 1 } },
      { text: 'Go wherever your best friend goes', scores: { 'the-healer': 3, 'the-artist': 1 } },
      { text: 'Try the weirdest thing on the menu', scores: { 'the-explorer': 3, 'the-rebel': 2 } },
      { text: 'Skip lunch, you\'re on a mission', scores: { 'the-strategist': 2, 'the-coder': 3 } }
    ]
  },
  {
    id: 3,
    question: 'College fest announcement drops. Your reaction?',
    options: [
      { text: 'Already Volunteering to organize it', scores: { 'the-leader': 3, 'the-rebel': 2 } },
      { text: 'Planning which day to attend and with whom', scores: { 'the-healer': 2, 'the-strategist': 3 } },
      { text: 'Signing up for every competition', scores: { 'the-explorer': 3, 'the-artist': 2 } },
      { text: 'Will go only if friends drag you', scores: { 'the-coder': 2, 'the-scholar': 3 } }
    ]
  },
  {
    id: 4,
    question: 'Pick a hangout spot on campus:',
    options: [
      { text: 'The library rooftop or quiet corner', scores: { 'the-scholar': 3, 'the-artist': 2 } },
      { text: 'The busiest spot — near the canteen', scores: { 'the-leader': 2, 'the-healer': 3 } },
      { text: 'Behind the lab, scheming something', scores: { 'the-strategist': 3, 'the-coder': 2 } },
      { text: 'Literally anywhere you haven\'t been', scores: { 'the-explorer': 3, 'the-rebel': 2 } }
    ]
  },
  {
    id: 5,
    question: 'A senior ragged you. You...',
    options: [
      { text: 'Outsmart them with a comeback they didn\'t expect', scores: { 'the-strategist': 3, 'the-rebel': 3 } },
      { text: 'Laugh it off and make them your friend', scores: { 'the-healer': 3, 'the-leader': 2 } },
      { text: 'Record it and post it as a reel', scores: { 'the-artist': 3, 'the-rebel': 2 } },
      { text: 'Quietly observe and note who to avoid', scores: { 'the-coder': 2, 'the-scholar': 3 } }
    ]
  },
  {
    id: 6,
    question: 'Weekend plans?',
    options: [
      { text: 'Binge a whole anime/series in one day', scores: { 'the-scholar': 2, 'the-rebel': 3 } },
      { text: 'Road trip with friends — no plan, just go', scores: { 'the-explorer': 3, 'the-healer': 2 } },
      { text: 'Work on a personal project or hobby', scores: { 'the-coder': 3, 'the-artist': 3 } },
      { text: 'Sleep. You earned it.', scores: { 'the-healer': 2, 'the-strategist': 1 } }
    ]
  },
  {
    id: 7,
    question: 'You get a free T-shirt at fresher day. You...',
    options: [
      { text: 'Wear it every day for a month straight', scores: { 'the-healer': 3, 'the-rebel': 1 } },
      { text: 'Customize it with markers and patches', scores: { 'the-artist': 3, 'the-rebel': 2 } },
      { text: 'Frame it — it\'s a memory now', scores: { 'the-scholar': 3, 'the-strategist': 1 } },
      { text: 'Give it to someone who needs it more', scores: { 'the-leader': 3, 'the-healer': 3 } }
    ]
  }
]

export function calculateCharacter(answers) {
  const scores = {}
  CHARACTERS.forEach(c => { scores[c.id] = 0 })

  answers.forEach((answerIndex, questionIndex) => {
    if (answerIndex === null || answerIndex === undefined) return
    const question = QUESTIONS[questionIndex]
    if (!question || !question.options[answerIndex]) return
    const optionScores = question.options[answerIndex].scores
    Object.entries(optionScores).forEach(([charId, pts]) => {
      scores[charId] = (scores[charId] || 0) + pts
    })
  })

  let maxScore = -1
  let result = CHARACTERS[0]
  Object.entries(scores).forEach(([charId, score]) => {
    if (score > maxScore) {
      maxScore = score
      result = CHARACTERS.find(c => c.id === charId)
    }
  })

  return result
}
