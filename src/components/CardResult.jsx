import { forwardRef, useImperativeHandle } from 'react'

const CardResult = forwardRef(({ data, onDownload, onCopyCaption, onMakeAnother }, ref) => {
  useImperativeHandle(ref, () => ({
    getElement: () => document.getElementById('card-element')
  }))

  const { cardId, name, department, funFact, dreamJob, photo, madeInSeconds } = data
  const isFast = madeInSeconds <= 60

  return (
    <div id="card-element" className="card-preview" style={{ position: 'relative' }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #0a1128 0%, #111a35 100%)',
        padding: '28px 24px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60%',
          right: '-60%',
          width: '140%',
          height: '140%',
          background: 'radial-gradient(ellipse at center, rgba(0,212,170,0.06) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#fff',
              lineHeight: 1.1
            }}>
              K.Ramakrishnan College of Technology
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#ffc845',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-mono)'
            }}>
              FRESHER CARD 2026
            </div>
          </div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#8b95a6',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em',
            textAlign: 'right'
          }}>
            #{cardId}
          </div>
        </div>

        <div style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#000',
          marginTop: 'auto',
          marginBottom: '24px',
          border: '2px solid #1e2d4a',
          flexShrink: 0,
          boxShadow: '0 12px 32px -8px rgba(0,0,0,0.4)'
        }}>
          {photo && (
            <img
              src={photo}
              alt={`${name}'s photo`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '4px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            {name}
          </h2>
          <p style={{
            fontSize: '0.9375rem',
            color: '#8b95a6',
            marginBottom: '20px',
            fontWeight: 500
          }}>
            {department}
          </p>

          <div className="card-field">
            <div className="card-field-label">Fun Fact</div>
            <div className="card-field-value">"{funFact}"</div>
          </div>

          <div className="card-field">
            <div className="card-field-label">Dream Job</div>
            <div className="card-field-value" style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#fff', textTransform: 'capitalize' }}>
              {dreamJob}
            </div>
          </div>

          <div className={`made-in-badge ${isFast ? 'fast' : 'slow'}`} style={{ marginTop: '8px' }}>
            Made in {madeInSeconds}s
          </div>
        </div>
      </div>

      <div className="card-actions" style={{ position: 'relative', zIndex: 1 }}>
        <button
          type="button"
          className="btn btn-gold"
          onClick={onDownload}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Card
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCopyCaption}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy Caption
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onMakeAnother}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: '4px' }}>
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          Create Another
        </button>
      </div>
    </div>
  )
})

CardResult.displayName = 'CardResult'

export default CardResult