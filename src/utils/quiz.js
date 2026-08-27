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

export const QUESTIONS = [
  {
    id: 1,
    question: 'You see a locked door. What do you do?',
    options: [
      { text: 'Look for the key or find another way in', scores: { 'the-coder': 3, 'the-strategist': 2 } },
      { text: 'Knock confidently — someone will open it', scores: { 'the-leader': 3, 'the-healer': 1 } },
      { text: 'Decorate the wall next to it while you wait', scores: { 'the-artist': 3, 'the-rebel': 1 } },
      { text: 'Check what\'s behind the building first', scores: { 'the-explorer': 3, 'the-scholar': 1 } }
    ]
  },
  {
    id: 2,
    question: 'It\'s Friday night. What sounds best?',
    options: [
      { text: 'Building a side project from scratch', scores: { 'the-coder': 3, 'the-rebel': 2 } },
      { text: 'Hosting a dinner with friends', scores: { 'the-leader': 3, 'the-healer': 2 } },
      { text: 'Sketching or playing music alone', scores: { 'the-artist': 3, 'the-scholar': 1 } },
      { text: 'Exploring a place you\'ve never been', scores: { 'the-explorer': 3, 'the-strategist': 1 } }
    ]
  },
  {
    id: 3,
    question: 'A group project is falling apart. You...',
    options: [
      { text: 'Take charge and delegate tasks', scores: { 'the-leader': 3, 'the-strategist': 2 } },
      { text: 'Fix the technical issues quietly', scores: { 'the-coder': 3, 'the-scholar': 2 } },
      { text: 'Try to keep everyone\'s spirits up', scores: { 'the-healer': 3, 'the-artist': 1 } },
      { text: 'Suggest a completely new approach', scores: { 'the-rebel': 3, 'the-explorer': 2 } }
    ]
  },
  {
    id: 4,
    question: 'Pick a superpower:',
    options: [
      { text: 'Read minds', scores: { 'the-strategist': 3, 'the-healer': 2 } },
      { text: 'Time travel', scores: { 'the-explorer': 3, 'the-scholar': 2 } },
      { text: 'Create anything from thin air', scores: { 'the-artist': 3, 'the-coder': 2 } },
      { text: 'Command anyone to follow you', scores: { 'the-leader': 3, 'the-rebel': 2 } }
    ]
  },
  {
    id: 5,
    question: 'What\'s your study style?',
    options: [
      { text: 'Late night, headphones on, deep focus', scores: { 'the-coder': 3, 'the-scholar': 3 } },
      { text: 'Teach it to someone else to learn it', scores: { 'the-leader': 2, 'the-healer': 3 } },
      { text: 'Draw diagrams and color-coded notes', scores: { 'the-artist': 3, 'the-strategist': 1 } },
      { text: 'Skip the book, learn by doing', scores: { 'the-rebel': 3, 'the-explorer': 3 } }
    ]
  },
  {
    id: 6,
    question: 'You find ₹500 on the ground. You...',
    options: [
      { text: 'Invest it or put it toward a gadget', scores: { 'the-coder': 2, 'the-strategist': 3 } },
      { text: 'Treat your friends to chai', scores: { 'the-healer': 3, 'the-leader': 2 } },
      { text: 'Buy art supplies or a book', scores: { 'the-artist': 2, 'the-scholar': 3 } },
      { text: 'Use it for an impromptu trip', scores: { 'the-explorer': 3, 'the-rebel': 2 } }
    ]
  },
  {
    id: 7,
    question: 'Which quote speaks to you most?',
    options: [
      { text: '"Move fast and break things"', scores: { 'the-rebel': 3, 'the-coder': 2 } },
      { text: '"Be the change you wish to see"', scores: { 'the-leader': 3, 'the-healer': 2 } },
      { text: '"Creativity takes courage"', scores: { 'the-artist': 3, 'the-explorer': 1 } },
      { text: '"Knowledge is power"', scores: { 'the-scholar': 3, 'the-strategist': 2 } }
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
