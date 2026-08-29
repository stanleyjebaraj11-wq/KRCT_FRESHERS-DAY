import { useState } from 'react'
import './StyleSelector.css'

function StyleSelector({ onContinue, onBack, studentData }) {
  const [selectedStyle, setSelectedStyle] = useState('futuristic')

  const handleContinue = () => {
    onContinue(selectedStyle)
  }

  const studentName = studentData?.name || 'KR Groupian'
  const photo = studentData?.photo

  return (
    <main className="style-page">
      <div className="background-dots dots-left" />
      <div className="background-dots dots-right" />
      <div className="page-orb orb-one" />
      <div className="page-orb orb-two" />

      <section className="style-container">
        <button type="button" className="style-back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="style-header">
          <p className="style-step">STEP 03 OF 04</p>
          <h1>Choose your <span>vibe.</span></h1>
          <p>Pick the style that feels most like you.<br />We'll use it to create your personalized KR Group story.</p>
        </div>

        <div className="style-grid">
          {/* FUTURISTIC */}
          <button type="button" className={`creative-style-card futuristic ${selectedStyle === 'futuristic' ? 'selected' : ''}`} onClick={() => setSelectedStyle('futuristic')}>
            <div className="story-preview futuristic-preview">
              <div className="tech-lines line-one" />
              <div className="tech-lines line-two" />
              <div className="tech-lines line-three" />
              <div className="tech-corner top-left" />
              <div className="tech-corner top-right" />
              <div className="tech-corner bottom-left" />
              <div className="tech-corner bottom-right" />
              <div className="preview-brand"><strong>KR Group</strong><span>ENGINEERING THE FUTURE</span></div>
              <div className="future-year">2026</div>
              <div className="hud-circle">
                <div className="hud-ring">
                  <div className="student-photo futuristic-photo">
                    {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                  </div>
                </div>
              </div>
              <div className="vertical-text">FUTURISTIC</div>
              <div className="futuristic-bottom">
                <p>WELCOME, FUTURE</p>
                <h2>{studentName}!</h2>
                <p className="story-quote futuristic-quote">"The future isn't waiting.<br />It's being built by you."</p>
                <span>A NEW JOURNEY BEGINS →</span>
              </div>
              <div className="building-line">▱ ▰ ▱ ▰ ▱ ▰ ▱</div>
            </div>
            <div className="style-card-info">
              <div><h3>🚀 Futuristic</h3><p>Bold. Digital. Forward.</p></div>
              <div className="selection-circle">{selectedStyle === 'futuristic' && '✓'}</div>
            </div>
          </button>

          {/* DREAMER */}
          <button type="button" className={`creative-style-card dreamer ${selectedStyle === 'dreamer' ? 'selected' : ''}`} onClick={() => setSelectedStyle('dreamer')}>
            <div className="story-preview dreamer-preview">
              <div className="stars">✦ · ✧ · ★</div>
              <div className="moon">☾</div>
              <div className="dream-brand"><strong>KR Group</strong><span>DREAM • BELIEVE • ACHIEVE</span></div>
              <div className="dream-photo-frame">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="dream-text-side">The future is yours</div>
              <div className="dreamer-bottom">
                <p>WELCOME, FUTURE</p>
                <h2>{studentName}!</h2>
                <div className="dream-divider">✦</div>
                <p className="story-quote dreamer-quote">"Dream boldly.<br />Your journey is just beginning."</p>
              </div>
              <div className="cloud cloud-one" />
              <div className="cloud cloud-two" />
            </div>
            <div className="style-card-info">
              <div><h3>✨ Dreamer</h3><p>Elegant. Inspiring. Limitless.</p></div>
              <div className="selection-circle">{selectedStyle === 'dreamer' && '✓'}</div>
            </div>
          </button>

          {/* BOLD */}
          <button type="button" className={`creative-style-card bold ${selectedStyle === 'bold' ? 'selected' : ''}`} onClick={() => setSelectedStyle('bold')}>
            <div className="story-preview bold-preview">
              <div className="bold-dots" />
              <div className="red-slash slash-one" />
              <div className="red-slash slash-two" />
              <div className="bold-brand"><strong>KR Group</strong><span>RISE. FOCUS. CONQUER.</span></div>
              <div className="background-bold-text">RISE<br />FOCUS<br />CONQUER</div>
              <div className="bold-photo-frame">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="bold-bottom">
                <p>WELCOME,</p>
                <span>FUTURE</span>
                <h2>{studentName}!</h2>
                <p className="story-quote bold-quote">"Don't just chase the future.<br />Create it."</p>
                <div className="legacy-strip">BUILD YOUR LEGACY</div>
              </div>
            </div>
            <div className="style-card-info">
              <div><h3>🔥 Bold</h3><p>Energetic. Fearless. Unforgettable.</p></div>
              <div className="selection-circle">{selectedStyle === 'bold' && '✓'}</div>
            </div>
          </button>

          {/* CLASSIC */}
          <button type="button" className={`creative-style-card classic ${selectedStyle === 'classic' ? 'selected' : ''}`} onClick={() => setSelectedStyle('classic')}>
            <div className="story-preview classic-preview">
              <div className="classic-border" />
              <div className="classic-brand">
                <div className="classic-logo">🎓</div>
                <div><strong>KR Group</strong><span>GROUP OF</span><small>INSTITUTIONS</small></div>
              </div>
              <div className="classic-line">───── ✦ ─────</div>
              <div className="classic-photo-frame">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="classic-leaves left-leaf">❯❯❯</div>
              <div className="classic-leaves right-leaf">❮❮❮</div>
              <div className="classic-bottom">
                <p>WELCOME, FUTURE</p>
                <h2>{studentName}!</h2>
                <div className="classic-divider">─── ✦ ───</div>
                <p className="story-quote classic-quote">"Every great journey begins<br />with a single step."</p>
                <span>LEARN • GROW • EXCEL</span>
              </div>
            </div>
            <div className="style-card-info">
              <div><h3>🎓 Classic KR Group</h3><p>Clean. Premium. Timeless.</p></div>
              <div className="selection-circle">{selectedStyle === 'classic' && '✓'}</div>
            </div>
          </button>
        </div>

        <button type="button" className="generate-story-button" onClick={handleContinue}>
          <span>Generate My KR Group Story</span>
          <span className="generate-sparkle">✦</span>
        </button>

        <p className="safe-text">🔒 Your details are safe with us</p>
      </section>
    </main>
  )
}

export default StyleSelector
