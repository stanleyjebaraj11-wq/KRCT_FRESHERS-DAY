import { forwardRef, useImperativeHandle } from 'react'
import { COLLEGES } from '../utils/constants'

const CardResult = forwardRef(({ data, onDownload, onCopyCaption, onShare, onWhatsApp, onInstagramStory, onMakeAnother, onChangeTemplate, hideActions }, ref) => {
  useImperativeHandle(ref, () => ({
    getElement: () => document.getElementById('card-element')
  }))

  const { cardId, name, department, college, photo, quote, selectedStyle } = data

  const collegeInfo = COLLEGES[college] || COLLEGES.KRCT

  const photoEl = photo
    ? <img className="krct-photo-img" src={photo} alt={`${name}'s photo`} />
    : <span className="krct-photo-placeholder">YOUR PHOTO</span>

  return (
    <div>
      <div id="card-element" className={`style-card-final krct-card ${selectedStyle || 'futuristic'}-final`}>
        <div className="krct-header">
          <img
            className={`krct-brand${collegeInfo.id === 'KRCT' ? ' krct-brand-lite' : ''}`}
            src={collegeInfo.logo}
            alt={collegeInfo.short}
          />
        </div>

        <div className="krct-identity">
          <div className="krct-photo">{photoEl}</div>
          <p className="krct-eyebrow">WELCOME, FRESHER</p>
          <h2 className="krct-name">{name}</h2>
          <p className="krct-dept">{department}</p>
        </div>

        <div className="krct-quote">
          <span className="krct-quote-icon" aria-hidden="true">❞</span>
          <p className="krct-quote-text">{quote || 'Make today count, tomorrow will thank you.'}</p>
        </div>

        <div className="krct-footer">
          <div className="krct-footer-row">
            <span className="krct-hashtag">FRESHERS DAY 2026</span>
            <span className="krct-card-id">{cardId}</span>
          </div>
        </div>
      </div>

      <div className="card-actions" style={hideActions ? { display: 'none' } : undefined}>
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
        {onChangeTemplate && (
          <button type="button" className="btn btn-ghost" onClick={onChangeTemplate}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a7.35 7.35 0 0 0 4.95 12.28 9.9 9.9 0 0 1 3.55-9.06" />
              <circle cx="8" cy="8" r="1" />
              <circle cx="16" cy="8" r="1" />
            </svg>
            Change Template
          </button>
        )}
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