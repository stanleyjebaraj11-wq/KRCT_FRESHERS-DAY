import { useState, useRef, useEffect, useCallback } from 'react'
import { toPng } from 'html-to-image'
import CardResult from '../components/CardResult'
import { useTimer } from '../hooks/useTimer'
import { useCamera } from '../hooks/useCamera'
import { showToast } from '../utils/toast'
import { submitForm } from '../utils/api'
import { DEPARTMENTS, getRandomQuote } from '../utils/constants'
import { BRAND } from '../utils/brand'
import logo from '../assets/logo.png'

function FormPage() {
  const [step, setStep] = useState('form')
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    funFact: '',
    dreamJob: '',
    consent: false
  })
  const [errors, setErrors] = useState({})
  const [photo, setPhoto] = useState(null)
  const [cardId, setCardId] = useState(null)
  const [madeInSeconds, setMadeInSeconds] = useState(null)
  const [quote, setQuote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focused, setFocused] = useState(false)

  const timer = useTimer(focused)
  const { stream, startCamera, stopCamera, capturePhoto, error: cameraError } = useCamera()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cardRef = useRef(null)

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (!focused && field !== 'consent') {
      setFocused(true)
    }
  }, [errors, focused])

  const validateForm = useCallback(() => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.funFact.trim()) newErrors.funFact = 'Fun fact is required'
    if (formData.funFact.length > 50) newErrors.funFact = 'Fun fact must be 50 characters or less'
    if (!formData.dreamJob.trim()) newErrors.dreamJob = 'Dream job is required'
    if (formData.dreamJob.length > 20) newErrors.dreamJob = 'Dream job must be 20 characters or less (one word)'
    if (formData.dreamJob.trim().includes(' ')) newErrors.dreamJob = 'Dream job must be one word'
    if (!formData.consent) newErrors.consent = 'You must agree to continue'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleContinue = useCallback(() => {
    if (!validateForm()) return
    setStep('photo')
  }, [validateForm])

  const submitCard = useCallback(async (photoDataUrl) => {
    if (!photoDataUrl) return

    setIsSubmitting(true)
    try {
      const result = await submitForm({
        name: formData.name.trim(),
        department: formData.department,
        funFact: formData.funFact.trim(),
        dreamJob: formData.dreamJob.trim(),
        madeInSeconds: timer.current,
        consentGiven: formData.consent
      })
      setPhoto(photoDataUrl)
      setCardId(result.cardId)
      setMadeInSeconds(result.madeInSeconds)
      setQuote(getRandomQuote())
      setStep('result')
      showToast('Card generated! 🎉', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to generate card', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, timer, validateForm])

  const handleRetake = useCallback(() => {
    setPhoto(null)
    setStep('photo')
    startCamera()
  }, [startCamera])

  const handleMakeAnother = useCallback(() => {
    setStep('form')
    setFormData({ name: '', department: '', funFact: '', dreamJob: '', consent: false })
    setPhoto(null)
    setCardId(null)
    setMadeInSeconds(null)
    setQuote('')
    setErrors({})
    setFocused(false)
    stopCamera()
  }, [stopCamera])

  const getCardBlob = useCallback(async () => {
    const el = cardRef.current?.getElement?.() || cardRef.current
    if (!el) {
      console.error('Card element not found')
      return null
    }
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: '#0a1128',
        pixelRatio: 2,
        quality: 0.95,
        skipAutoScale: true,
        cacheBust: true,
        skipFonts: true,
        filter: (node) => {
          if (node.tagName === 'STYLE') return false
          return true
        }
      })
      const res = await fetch(dataUrl)
      return await res.blob()
    } catch (err) {
      console.error('toPng failed:', err)
      throw err
    }
  }, [])

  const handleDownload = useCallback(async () => {
    try {
      const blob = await getCardBlob()
      if (!blob) {
        showToast('Could not generate card image', 'error')
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `KRCT-Fresher-Card-${cardId}.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      showToast('Saved to downloads!', 'success')
    } catch (err) {
      console.error('Download error:', err)
      showToast('Download failed: ' + (err.message || 'Unknown error'), 'error')
    }
  }, [cardId, getCardBlob])

  const handleShare = useCallback(async () => {
    try {
      const blob = await getCardBlob()
      if (!blob) return
      const file = new File([blob], `KRCT-Fresher-Card-${cardId}.png`, { type: 'image/png' })
      const shareData = { title: 'My KRCT Fresher Card', text: BRAND.shareText }

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ ...shareData, files: [file] })
        return
      }
      if (navigator.share) {
        // Text/url share (desktop Chrome, etc.) — no file support
        await navigator.share(shareData)
        return
      }
      throw new Error('no-share')
    } catch (err) {
      if (err && err.name === 'AbortError') return
      // Fallback: download the card + copy the caption
      try {
        const blob = await getCardBlob()
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `KRCT-Fresher-Card-${cardId}.png`
          link.href = url
          link.click()
          URL.revokeObjectURL(url)
        }
        await navigator.clipboard.writeText(BRAND.shareText).catch(() => {})
        showToast('Card downloaded & caption copied!', 'success')
      } catch {
        showToast('Sharing is not supported here. Use WhatsApp or Download.', 'error')
      }
    }
  }, [cardId, getCardBlob])

  const handleWhatsApp = useCallback(() => {
    const text = encodeURIComponent(`${BRAND.shareText}\n${BRAND.qrUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener')
  }, [])

  const handleCopyCaption = useCallback(async () => {
    const caption = `Just got my KRCT Fresher Card! 🎓\n\n${formData.name} | ${formData.department}\n"${formData.funFact}"\nDream job: ${formData.dreamJob}\n\n#KRCT2026 #FreshersDay #WhereAmbitionMeetsExcellence`
    try {
      await navigator.clipboard.writeText(caption)
      showToast('Caption copied!', 'success')
    } catch {
      const fallback = prompt('Copy this caption:', caption)
      if (fallback !== null) {
        showToast('Copied!', 'success')
      }
    }
  }, [formData])

  const handleInstagramStory = useCallback(async () => {
    try {
      const blob = await getCardBlob()
      if (!blob) {
        showToast('Could not generate card image', 'error')
        return
      }
      const file = new File([blob], `KRCT-Fresher-Card-${cardId}.png`, { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'My KRCT Fresher Card', files: [file] })
        showToast('Shared! Select Instagram from the share menu.', 'success')
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `KRCT-Fresher-Card-${cardId}.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      showToast('Image saved! Open Instagram → Story → pick from gallery.', 'success')
    } catch (err) {
      if (err && err.name === 'AbortError') return
      console.error('Instagram share error:', err)
      showToast('Could not share. Try downloading instead.', 'error')
    }
  }, [cardId, getCardBlob])

  useEffect(() => {
    if (step === 'photo') {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [step, startCamera, stopCamera])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const isFormComplete = formData.name.trim() &&
    formData.department &&
    formData.funFact.trim() &&
    formData.dreamJob.trim() &&
    formData.consent

  return (
    <div className="container">
      <div className="page">
        <header className="header">
          <img className="header-logo" src={logo} alt="KRCT Logo" />
          <div className="logo">
            K.Ramakrishnan College of Technology
            <small>Autonomous • NAAC A+ • Anna University Affiliated</small>
            <span>FRESHER CARD</span>
          </div>
          <p className="subtitle">Where Ambition Meets Excellence</p>
        </header>

        {step === 'form' && (
          <form onSubmit={e => e.preventDefault()} noValidate>
            <div className="field-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                onBlur={() => { if (formData.name && errors.name) validateForm() }}
                autoComplete="name"
                maxLength={60}
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                value={formData.department}
                onChange={e => updateField('department', e.target.value)}
              >
                <option value="">Choose your department</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <div className="field-error">{errors.department}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="funFact">Fun Fact * (max 50 chars)</label>
              <input
                id="funFact"
                type="text"
                placeholder="Something interesting about you"
                value={formData.funFact}
                onChange={e => updateField('funFact', e.target.value)}
                maxLength={50}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span className={formData.funFact.length > 45 ? 'field-error' : ''}>
                  {formData.funFact.length}/50
                </span>
              </div>
              {errors.funFact && <div className="field-error">{errors.funFact}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="dreamJob">Dream Job * (one word, max 20 chars)</label>
              <input
                id="dreamJob"
                type="text"
                placeholder="e.g., Astronaut"
                value={formData.dreamJob}
                onChange={e => updateField('dreamJob', e.target.value)}
                maxLength={20}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span className={formData.dreamJob.length > 18 ? 'field-error' : ''}>
                  {formData.dreamJob.length}/20
                </span>
              </div>
              {errors.dreamJob && <div className="field-error">{errors.dreamJob}</div>}
            </div>

            <div className="field-group">
              <label className="consent-label">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={e => updateField('consent', e.target.checked)}
                  required
                />
                <span>
                  I agree KRCT can use my photo and details for this event and official social media.
                </span>
              </label>
              {errors.consent && <div className="field-error">{errors.consent}</div>}
            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={!isFormComplete || isSubmitting}
              onClick={handleContinue}
            >
              {isSubmitting ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                  </svg>
                  Generating...
                </>
              ) : (
                'Continue to Photo →'
              )}
              <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner { animation: spin 1s linear infinite; }
              `}</style>
            </button>
          </form>
        )}

        {step === 'photo' && (
          <div>
            <div className="photo-capture" role="region" aria-label="Camera preview" style={{ position: 'relative' }}>
              {stream && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        videoRef.current.play().catch(() => {})
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="capture-btn"
                    onClick={async () => {
                      const dataUrl = await capturePhoto(videoRef.current, canvasRef.current)
                      if (dataUrl) {
                        stopCamera()
                        await submitCard(dataUrl)
                      }
                    }}
                    disabled={!stream || isSubmitting}
                    aria-label="Capture photo"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="4"/>
                    </svg>
                  </button>
                </>
              )}
              {!stream && (
                <div className="camera-error" style={{ border: '2px dashed var(--border)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p style={{ fontSize: '1.0625rem', fontWeight: 500 }}>Camera not available</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Use the upload button below</p>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <label className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isSubmitting ? 0.6 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                Upload from Gallery
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                      onChange={async e => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () => {
                            const img = new Image()
                            img.onload = async () => {
                              const canvas = document.createElement('canvas')
                              const size = Math.min(img.width, img.height)
                              canvas.width = size
                              canvas.height = size
                              const ctx = canvas.getContext('2d')
                              const x = (img.width - size) / 2
                              const y = (img.height - size) / 2
                              ctx.drawImage(img, x, y, size, size, 0, 0, size, size)
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
                              stopCamera()
                              await submitCard(dataUrl)
                            }
                            img.src = reader.result
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                />
              </label>
              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8125rem', margin: '0' }}>
                {isSubmitting
                  ? 'Generating your card...'
                  : stream
                    ? 'Tap green circle to capture, or upload from gallery'
                    : 'Select a photo from your gallery'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { stopCamera(); setStep('form'); }}
              style={{ marginTop: 16 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}>
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Form
            </button>
          </div>
        )}

        {step === 'result' && (
          <CardResult
            ref={cardRef}
            data={{
              cardId,
              name: formData.name,
              department: formData.department,
              funFact: formData.funFact,
              dreamJob: formData.dreamJob,
              photo,
              quote,
              madeInSeconds
            }}
            onDownload={handleDownload}
            onCopyCaption={handleCopyCaption}
            onShare={handleShare}
            onWhatsApp={handleWhatsApp}
            onInstagramStory={handleInstagramStory}
            onMakeAnother={handleMakeAnother}
          />
        )}
      </div>
    </div>
  )
}

export default FormPage