import { useState, useCallback } from 'react'
import { QUESTIONS } from '../utils/quiz'

function Quiz({ onComplete, onBack }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const question = QUESTIONS[currentQ]
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100

  const handleSelect = useCallback((optionIndex) => {
    if (isTransitioning) return
    setSelectedOption(optionIndex)
    setIsTransitioning(true)

    const newAnswers = [...answers, optionIndex]

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setAnswers(newAnswers)
        setCurrentQ(prev => prev + 1)
        setSelectedOption(null)
        setIsTransitioning(false)
      } else {
        onComplete(newAnswers)
      }
    }, 400)
  }, [answers, currentQ, isTransitioning, onComplete])

  return (
    <div className="quiz">
      <div className="quiz-header">
        <button type="button" className="btn btn-ghost quiz-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
        <span className="quiz-counter">{currentQ + 1} / {QUESTIONS.length}</span>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-question" key={currentQ}>
        <h3 className="quiz-question-text">{question.question}</h3>

        <div className="quiz-options">
          {question.options.map((option, i) => (
            <button
              key={i}
              type="button"
              className={`quiz-option ${selectedOption === i ? 'selected' : ''}`}
              onClick={() => handleSelect(i)}
              disabled={isTransitioning}
            >
              <span className="quiz-option-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="quiz-option-text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="quiz-hint">
        Think like Akinator — answer honestly for the best match!
      </p>
    </div>
  )
}

export default Quiz
