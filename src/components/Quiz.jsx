import { useState, useCallback } from 'react'
import { QUESTIONS, FAVOURITE_CHARACTERS } from '../utils/quiz'

function Quiz({ onComplete, onBack }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [favouriteChar, setFavouriteChar] = useState('')
  const [showFavStep, setShowFavStep] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const totalSteps = QUESTIONS.length + 1
  const isQuizDone = currentQ >= QUESTIONS.length
  const progress = (showFavStep
    ? totalSteps
    : currentQ + 1
  ) / totalSteps * 100

  const filteredChars = FAVOURITE_CHARACTERS.filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        setAnswers(newAnswers)
        setShowFavStep(true)
        setIsTransitioning(false)
      }
    }, 400)
  }, [answers, currentQ, isTransitioning])

  const handleFinish = useCallback(() => {
    onComplete(answers, favouriteChar || null)
  }, [answers, favouriteChar, onComplete])

  const handleSkipFav = useCallback(() => {
    onComplete(answers, null)
  }, [answers, onComplete])

  return (
    <div className="quiz">
      <div className="quiz-header">
        <button type="button" className="btn btn-ghost quiz-back" onClick={showFavStep ? () => { setShowFavStep(false); setCurrentQ(QUESTIONS.length - 1) } : onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
        <span className="quiz-counter">
          {showFavStep ? `${QUESTIONS.length} + 1` : `${currentQ + 1} / ${QUESTIONS.length}`}
        </span>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {!showFavStep && (
        <div className="quiz-question" key={currentQ}>
          <h3 className="quiz-question-text">{QUESTIONS[currentQ].question}</h3>

          <div className="quiz-options">
            {QUESTIONS[currentQ].options.map((option, i) => (
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
      )}

      {showFavStep && (
        <div className="quiz-question quiz-fav-step">
          <h3 className="quiz-question-text">
            Who's your favourite character? <span className="quiz-optional-tag">(Optional)</span>
          </h3>
          <p className="quiz-fav-hint">Pick from the list or type your own</p>

          <input
            type="text"
            className="quiz-search"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <div className="quiz-fav-list">
            {filteredChars.map((char, i) => (
              <button
                key={i}
                type="button"
                className={`quiz-fav-chip ${favouriteChar === char ? 'selected' : ''}`}
                onClick={() => { setFavouriteChar(char); setSearchTerm('') }}
              >
                {char}
              </button>
            ))}
            {searchTerm && !FAVOURITE_CHARACTERS.includes(searchTerm) && searchTerm !== 'None / Skip' && (
              <button
                type="button"
                className={`quiz-fav-chip custom ${favouriteChar === searchTerm ? 'selected' : ''}`}
                onClick={() => { setFavouriteChar(searchTerm); setSearchTerm('') }}
              >
                + "{searchTerm}"
              </button>
            )}
          </div>

          {favouriteChar && favouriteChar !== 'None / Skip' && (
            <p className="quiz-fav-selected">
              Selected: <strong>{favouriteChar}</strong>
              <button type="button" className="quiz-fav-clear" onClick={() => setFavouriteChar('')}>✕</button>
            </p>
          )}
        </div>
      )}

      {!showFavStep && (
        <p className="quiz-hint">
          Think like Akinator — answer honestly for the best match!
        </p>
      )}

      {showFavStep && (
        <div className="quiz-fav-actions">
          <button type="button" className="btn btn-primary" onClick={handleFinish}>
            {favouriteChar ? `Show My Character ${FAVOURITE_CHARACTERS.includes(favouriteChar) ? '✨' : '🎯'}` : 'Show My Character ✨'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleSkipFav}>
            Skip & Show Character
          </button>
        </div>
      )}
    </div>
  )
}

export default Quiz
