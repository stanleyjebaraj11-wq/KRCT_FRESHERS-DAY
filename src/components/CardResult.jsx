import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import QRCode from 'qrcode'
import logo from '../assets/logo.png'
import { BRAND } from '../utils/brand'

const CardResult = forwardRef(({ data, onDownload, onCopyCaption, onShare, onWhatsApp, onInstagramStory, onMakeAnother }, ref) => {
  useImperativeHandle(ref, () => ({
    getElement: () => document.getElementById('card-element')
  }))

  const { cardId, name, department, funFact, dreamJob, photo, quote, selectedStyle } = data
  const [qr, setQr] = useState('')

  useEffect(() => {
    let active = true
    QRCode.toDataURL(BRAND.qrUrl, {
      margin: 1,
      width: 160,
      color: { dark: '#0a1128', light: '#ffffff' }
    })
      .then(url => { if (active) setQr(url) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const photoEl = photo
    ? <img src={photo} alt={`${name}'s photo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    : <span>YOUR PHOTO</span>

  const renderFuturistic = () => (
    <div className="style-final futuristic-final">
      <div className="tech-lines line-one" />
      <div className="tech-lines line-two" />
      <div className="tech-lines line-three" />
      <div className="tech-corner top-left" />
      <div className="tech-corner top-right" />
      <div className="tech-corner bottom-left" />
      <div className="tech-corner bottom-right" />

      <div className="sf-header">
        <strong>KRCT</strong>
        <span>ENGINEERING THE FUTURE</span>
      </div>

      <div className="sf-year">2026</div>

      <div className="sf-photo-circle">
        <div className="sf-hud-ring">
          <div className="sf-photo-inner">{photoEl}</div>
        </div>
      </div>

      <div className="sf-dept">{department}</div>

      <div className="sf-side-text">FUTURISTIC</div>

      <div className="sf-bottom">
        <p className="sf-welcome">WELCOME, FUTURE</p>
        <h2 className="sf-name">{name}!</h2>
        <p className="sf-quote">"{quote || 'The future is being built by you.'}"</p>
        <div className="sf-fields">
          <div className="sf-field"><span>Fun Fact:</span> {funFact}</div>
          <div className="sf-field"><span>Dream Job:</span> {dreamJob}</div>
        </div>
        <div className="sf-qr">
          {qr && <img src={qr} alt="QR" />}
          <span>#{cardId}</span>
        </div>
      </div>

      <div className="sf-building-line">▱ ▰ ▱ ▰ ▱ ▰ ▱</div>
    </div>
  )

  const renderDreamer = () => (
    <div className="style-final dreamer-final">
      <div className="df-stars">✦ · ✧ · ★</div>
      <div className="df-moon">☾</div>

      <div className="df-header">
        <strong>KRCT</strong>
        <span>DREAM • BELIEVE • ACHIEVE</span>
      </div>

      <div className="df-photo-ring">
        <div className="df-photo-inner">{photoEl}</div>
      </div>

      <div className="df-dept">{department}</div>

      <div className="df-side-text">The future is yours</div>

      <div className="df-bottom">
        <p className="df-welcome">WELCOME, FUTURE</p>
        <h2 className="df-name">{name}!</h2>
        <div className="df-divider">✦</div>
        <p className="df-quote">"{quote || 'Dream boldly. Your journey is just beginning.'}"</p>
        <div className="df-fields">
          <div className="df-field"><span>Fun Fact:</span> {funFact}</div>
          <div className="df-field"><span>Dream Job:</span> {dreamJob}</div>
        </div>
        <div className="df-qr">
          {qr && <img src={qr} alt="QR" />}
          <span>#{cardId}</span>
        </div>
      </div>

      <div className="df-cloud df-cloud-one" />
      <div className="df-cloud df-cloud-two" />
    </div>
  )

  const renderBold = () => (
    <div className="style-final bold-final">
      <div className="bf-dots" />
      <div className="bf-slash bf-slash-one" />
      <div className="bf-slash bf-slash-two" />

      <div className="bf-header">
        <strong>KRCT</strong>
        <span>RISE. FOCUS. CONQUER.</span>
      </div>

      <div className="bf-bg-text">RISE<br />FOCUS<br />CONQUER</div>

      <div className="bf-photo-frame">
        <div className="bf-photo-inner">{photoEl}</div>
      </div>

      <div className="bf-dept">{department}</div>

      <div className="bf-bottom">
        <p className="bf-welcome">WELCOME, FUTURE</p>
        <h2 className="bf-name">{name}!</h2>
        <p className="bf-quote">"{quote || 'Don\'t just chase the future. Create it.'}"</p>
        <div className="bf-fields">
          <div className="bf-field"><span>Fun Fact:</span> {funFact}</div>
          <div className="bf-field"><span>Dream Job:</span> {dreamJob}</div>
        </div>
        <div className="bf-strip">BUILD YOUR LEGACY</div>
        <div className="bf-qr">
          {qr && <img src={qr} alt="QR" />}
          <span>#{cardId}</span>
        </div>
      </div>
    </div>
  )

  const renderClassic = () => (
    <div className="style-final classic-final">
      <div className="cf-border" />

      <div className="cf-header">
        <div className="cf-logo">🎓</div>
        <div>
          <strong>KRCT</strong>
          <span>COLLEGE OF ENGINEERING</span>
          <small>AND TECHNOLOGY</small>
        </div>
      </div>

      <div className="cf-line">───── ✦ ─────</div>

      <div className="cf-photo-ring">
        <div className="cf-photo-inner">{photoEl}</div>
      </div>

      <div className="cf-dept">{department}</div>

      <div className="cf-leaves cf-left">❯❯❯</div>
      <div className="cf-leaves cf-right">❮❮❮</div>

      <div className="cf-bottom">
        <p className="cf-welcome">WELCOME, FUTURE</p>
        <h2 className="cf-name">{name}!</h2>
        <div className="cf-divider">─── ✦ ───</div>
        <p className="cf-quote">"{quote || 'Every great journey begins with a single step.'}"</p>
        <div className="cf-fields">
          <div className="cf-field"><span>Fun Fact:</span> {funFact}</div>
          <div className="cf-field"><span>Dream Job:</span> {dreamJob}</div>
        </div>
        <span className="cf-motto">LEARN • GROW • EXCEL</span>
        <div className="cf-qr">
          {qr && <img src={qr} alt="QR" />}
          <span>#{cardId}</span>
        </div>
      </div>
    </div>
  )

  const renderers = {
    futuristic: renderFuturistic,
    dreamer: renderDreamer,
    bold: renderBold,
    classic: renderClassic
  }

  return (
    <div>
      <div id="card-element" className={`style-card-final style-card-${selectedStyle || 'futuristic'}`}>
        {(renderers[selectedStyle] || renderFuturistic)()}
      </div>

      <div className="card-actions">
        <div className="card-actions-row">
          <button type="button" className="btn btn-gold" onClick={onDownload}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <button type="button" className="btn btn-primary" onClick={onShare}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
        </div>
        <div className="card-actions-row">
          <button type="button" className="btn btn-secondary" onClick={onWhatsApp}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp
          </button>
          <button type="button" className="btn btn-secondary" onClick={onInstagramStory}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            IG Story
          </button>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onMakeAnother}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: '4px' }}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Create Another
        </button>
      </div>
    </div>
  )
})

CardResult.displayName = 'CardResult'

export default CardResult
