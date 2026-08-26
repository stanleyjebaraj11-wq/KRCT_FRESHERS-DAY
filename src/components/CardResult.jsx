import { forwardRef, useImperativeHandle } from 'react'

const CardResult = forwardRef(({ data, onDownload, onCopyCaption, onMakeAnother }, ref) => {
  useImperativeHandle(ref, () => ({
    getElement: () => document.getElementById('card-element')
  }))

  const { cardId, name, department, funFact, dreamJob, photo, madeInSeconds } = data
  const isFast = madeInSeconds <= 60

  return (
    <div>
      <div id="card-element" className="krct-card">
        <div className="krct-card-glow" />

        <div className="krct-card-header">
          <div className="krct-college">
            <span className="krct-college-name">K.Ramakrishnan College of Technology</span>
            <span className="krct-college-sub">Autonomous · NAAC A+ · Anna University</span>
          </div>
          <span className="krct-card-id">#{cardId}</span>
        </div>

        <div className="krct-card-divider" />

        <div className="krct-photo-wrap">
          {photo ? (
            <img className="krct-photo" src={photo} alt={`${name}'s photo`} />
          ) : (
            <div className="krct-photo krct-photo-empty">No Photo</div>
          )}
          <span className={`krct-made-badge ${isFast ? 'fast' : 'slow'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Made in {madeInSeconds}s
          </span>
        </div>

        <h2 className="krct-name">{name}</h2>
        <p className="krct-dept">{department}</p>

        <div className="krct-fields">
          <div className="krct-field">
            <div className="krct-field-label">Fun Fact</div>
            <div className="krct-field-value">&ldquo;{funFact}&rdquo;</div>
          </div>
          <div className="krct-field">
            <div className="krct-field-label">Dream Job</div>
            <div className="krct-field-value krct-capitalize">{dreamJob}</div>
          </div>
        </div>

        <div className="krct-footer">
          <span className="krct-hashtag">#KRCT2026</span>
          <span className="krct-tagline">Where Ambition Meets Excellence</span>
        </div>
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
          <button type="button" className="btn btn-secondary" onClick={onCopyCaption}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Caption
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
