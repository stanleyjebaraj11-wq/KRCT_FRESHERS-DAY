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
              <div className="preview-brand"><span>ENGINEERING THE FUTURE</span></div>
              <div className="future-year">2026</div>
              <div className="tech-diamonds">◇ ◇ ◇</div>
              <div className="tech-edge-dots">◆ ◆ ◆</div>
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
              <div className="shooting-star">✧</div>
              <div className="constellation">✦ ✧ ✦</div>
              <div className="dream-brand"><span>DREAM • BELIEVE • ACHIEVE</span></div>
              <div className="dream-photo-frame">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="dream-text-side">The future is yours</div>
              <div className="dreamer-bottom">
                <p>WELCOME, FUTURE</p>
                
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
              <div className="bold-slashes" />
              <div className="red-slash slash-one" />
              <div className="red-slash slash-two" />
              <div className="bold-brand"><span>RISE. FOCUS. CONQUER.</span></div>
              <div className="background-bold-text">RISE<br />FOCUS<br />CONQUER</div>
              <div className="bold-photo-frame">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="bold-bottom">
                <p>WELCOME,</p>
                <span>FUTURE</span>
                
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
                <div><span>GROUP OF</span><small>INSTITUTIONS</small></div>
              </div>
              <div className="classic-line">───── ✦ ─────</div>
              <div className="classic-flourish">❧</div>
              <div className="classic-photo-frame">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="classic-leaves left-leaf">❯❯❯</div>
              <div className="classic-leaves right-leaf">❮❮❮</div>
              <div className="classic-ornaments">✦ ❖ ✦</div>
              <div className="classic-bottom">
                <p>WELCOME, FUTURE</p>
                
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

          {/* SPIDERMAN */}
          <button type="button" className={`creative-style-card spiderman ${selectedStyle === 'spiderman' ? 'selected' : ''}`} onClick={() => setSelectedStyle('spiderman')}>
            <div className="story-preview spiderman-preview">
              <div className="spidey-webs" />
              <div className="spidey-web corner-tl" />
              <div className="spidey-web corner-tr" />
              <div className="spidey-web corner-bl" />
              <div className="spidey-web corner-br" />
              <div className="spidey-hanging">🕷️</div>
              <div className="bold-brand spidey-brand"><span>WEB OF OPPORTUNITY</span></div>
              <div className="background-bold-text spidey-bigtext">POWER<br />GREAT<br />RESPONSIBILITY</div>
              <div className="bold-photo-frame spidey-photo">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="bold-dots spidey-dots" />
              <div className="bold-bottom spidey-bottom">
                <p>WELCOME,</p>
                <span>HERO</span>
                
                <p className="story-quote bold-quote">"With great power<br />comes great responsibility."</p>
                <div className="legacy-strip">AN UNTOLD STORY BEGINS</div>
              </div>
            </div>
            <div className="style-card-info">
              <div><h3>🕷️ Spiderman</h3><p>Heroic. Urban. Web-slinger.</p></div>
              <div className="selection-circle">{selectedStyle === 'spiderman' && '✓'}</div>
            </div>
          </button>

          {/* BATMAN */}
          <button type="button" className={`creative-style-card batman ${selectedStyle === 'batman' ? 'selected' : ''}`} onClick={() => setSelectedStyle('batman')}>
            <div className="story-preview batman-preview">
              <div className="bat-signal">🦇</div>
              <div className="bat-galaxy">
                <span className="bat-fly bat-one">🦇</span>
                <span className="bat-fly bat-two">🦇</span>
                <span className="bat-fly bat-three">🦇</span>
              </div>
              <div className="bat-skyline" />
              <div className="dream-brand batman-brand"><span>IN THE SHADOWS OF GREATNESS</span></div>
              <div className="dream-photo-frame batman-photo">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="dream-text-side batman-side">I am vengeance</div>
              <div className="dreamer-bottom batman-bottom">
                <p>WELCOME,</p>
                
                <div className="dream-divider">🦇</div>
                <p className="story-quote bold-quote">"It's not who I am underneath.<br />It's what I do that defines me."</p>
              </div>
            </div>
            <div className="style-card-info">
              <div><h3>🦇 Batman</h3><p>Dark. Bold. The Dark Knight.</p></div>
              <div className="selection-circle">{selectedStyle === 'batman' && '✓'}</div>
            </div>
          </button>

          {/* ONE PIECE */}
          <button type="button" className={`creative-style-card onepiece ${selectedStyle === 'onepiece' ? 'selected' : ''}`} onClick={() => setSelectedStyle('onepiece')}>
            <div className="story-preview onepiece-preview">
              <div className="onepiece-sun" />
              <div className="op-waves" />
              <div className="op-boat">⛵</div>
              <div className="onepiece-logo">🏴☠️</div>
              <div className="dream-brand onepiece-brand"><span>TO THE GRAND LINE OF DREAMS</span></div>
              <div className="dream-photo-frame onepiece-photo">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="dream-text-side onepiece-side">Adventure awaits</div>
              <div className="dreamer-bottom onepiece-bottom">
                <p>WELCOME, FUTURE</p>
                
                <div className="dream-divider">☠</div>
                <p className="story-quote dreamer-quote">"I'm gonna be the king of the pirates!"</p>
              </div>
            </div>
            <div className="style-card-info">
              <div><h3>🏴‍☠️ One Piece</h3><p>Adventurous. Free. Grand Line.</p></div>
              <div className="selection-circle">{selectedStyle === 'onepiece' && '✓'}</div>
            </div>
          </button>

          {/* ANIME */}
          <button type="button" className={`creative-style-card anime ${selectedStyle === 'anime' ? 'selected' : ''}`} onClick={() => setSelectedStyle('anime')}>
            <div className="story-preview anime-preview">
              <div className="petals">✿ ❀ ✿ ❀</div>
              <div className="anime-moon">☾</div>
              <div className="anime-branch">🌸</div>
              <div className="anime-petals-edge">❀ ✿</div>
              <div className="dream-brand anime-brand"><span>SAKURA & ANIME DREAMS</span></div>
              <div className="dream-photo-frame anime-photo">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="dream-text-side anime-side">Believe in yourself</div>
              <div className="dreamer-bottom anime-bottom">
                <p>WELCOME, FUTURE</p>
                
                <div className="dream-divider">✿</div>
                <p className="story-quote anime-quote">"In the world of anime,<br />anything is possible."</p>
              </div>
              <div className="cloud cloud-one" />
              <div className="cloud cloud-two" />
            </div>
            <div className="style-card-info">
              <div><h3>🌸 Anime</h3><p>Magical. Sakura. Legendary.</p></div>
              <div className="selection-circle">{selectedStyle === 'anime' && '✓'}</div>
            </div>
          </button>

          {/* ROYAL */}
          <button type="button" className={`creative-style-card royal ${selectedStyle === 'royal' ? 'selected' : ''}`} onClick={() => setSelectedStyle('royal')}>
            <div className="story-preview royal-preview">
              <div className="royal-frame" />
              <div className="royal-crown">👑</div>
              <div className="stars">✦ · ✧ · ✦</div>
              <div className="dream-brand"><span>ROYAL • REGAL • STELLAR</span></div>
              <div className="classic-line">───── ✦ ─────</div>
              <div className="classic-photo-frame">
                <div className="student-photo">
                  {photo ? <img src={photo} alt={studentName} /> : <span>YOUR PHOTO</span>}
                </div>
              </div>
              <div className="dream-text-side">Rule your dreams</div>
              <div className="dreamer-bottom">
                <p>HONOUR THE FUTURE</p>
                
                <div className="classic-divider">✦</div>
                <p className="story-quote classic-quote">"Every star<br />shines in its own orbit."</p>
              </div>
              <div className="royal-diamonds">◆ ◇ ◆</div>
            </div>
            <div className="style-card-info">
              <div><h3>👑 Royal</h3><p>Regal. Prestigious. Radiant.</p></div>
              <div className="selection-circle">{selectedStyle === 'royal' && '✓'}</div>
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
