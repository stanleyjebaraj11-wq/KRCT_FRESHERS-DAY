import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import QRCode from 'qrcode'
import logo from '../assets/logo.png'
import { BRAND } from '../utils/brand'

const CardResult = forwardRef(({ data, onDownload, onCopyCaption, onShare, onMakeAnother }, ref) => {
  useImperativeHandle(ref, () => ({
    getElement: () => document.getElementById('card-element')
  }))

  const { cardId, name, department, funFact, dreamJob, photo } = data
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

  return (
    <div>
      <div id="card-element" className="krct-card">
        <div className="krct-card-glow" />

        <div className="krct-card-header">
          <div className="krct-brand">
            <img className="krct-logo" src={logo} alt="KRCT logo" />
            <div className="krct-college">
              <span className="krct-college-name">{BRAND.collegeName}</span>
              <span className="krct-college-sub">Autonomous · NAAC A+ · Anna University</span>
            </div>
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
          <div className="krct-qr">
            {qr && <img src={qr} alt="Scan to visit KRCT" />}
            <span className="krct-qr-label">Scan me</span>
          </div>
          <div className="krct-footer-text">
            <span className="krct-hashtag">{BRAND.hashtag}</span>
            <span className="krct-tagline">{BRAND.tagline}</span>
          </div>
        </div>

        <div className="krct-watermark">{BRAND.watermark}</div>
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
        <button type="button" className="btn btn-secondary" onClick={onCopyCaption}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy Caption
        </button>
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
