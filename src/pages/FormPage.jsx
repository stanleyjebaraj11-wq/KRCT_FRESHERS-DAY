import { useState, useRef, useEffect, useCallback } from 'react'
import { toPng } from 'html-to-image'
import CardResult from '../components/CardResult'
import StyleSelector from '../components/StyleSelector'
import BackgroundFX from '../components/BackgroundFX'
import PhotoEditor from '../components/PhotoEditor'
import { useTimer } from '../hooks/useTimer'
import { useCamera } from '../hooks/useCamera'
import { showToast } from '../utils/toast'
import { submitForm, updateCardStyle } from '../utils/api'
import { COLLEGE_DEPARTMENTS, COLLEGES, getQuoteFor } from '../utils/constants'
import { BRAND } from '../utils/brand'
import logo from '../assets/logo.png'

function FormPage() {
  const [step, setStep] = useState('form')
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: '',
    mobile: '',
    email: '',
    consent: false
  })
  const [errors, setErrors] = useState({})
  const [photo, setPhoto] = useState(null)
  const [photoMode, setPhotoMode] = useState('camera')
  const [pendingPhoto, setPendingPhoto] = useState(null)
  const [cardId, setCardId] = useState(null)
  const [madeInSeconds, setMadeInSeconds] = useState(null)
  const [quote, setQuote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focused, setFocused] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState(null)

  const timer = useTimer(focused)
  const { stream, startCamera, stopCamera, capturePhoto, error: cameraError, starting: cameraStarting } = useCamera()

  const cameraBlocked = cameraError && /denied|permission/i.test(String(cameraError))
  const cameraHint = cameraBlocked
    ? 'Camera permission is blocked. Allow camera access in your browser settings, or upload a photo from the gallery below.'
    : cameraError
      ? 'Camera unavailable. You can still upload a photo from the gallery below.'
      : 'Camera not available. Use the upload button below.'

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cardRef = useRef(null)

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'college' ? { department: '' } : {})
    }))
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
    if (!formData.college) newErrors.college = 'College is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!formData.consent) newErrors.consent = 'You must agree to continue'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleContinue = useCallback(() => {
    if (!validateForm()) return
    setStep('photo')
  }, [validateForm])

  const compressPhoto = useCallback((dataUrl, maxDim = 600, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => resolve(dataUrl)
      img.src = dataUrl
    })
  }, [])

  const submitCard = useCallback(async (photoDataUrl) => {
    if (!photoDataUrl) return

    // Compress a small copy for the DB slideshow (full-res stays local for
    // download/share). Keeps ~1000 cards well under Neon's 0.5 GB free limit.
    const compressedPhoto = await compressPhoto(photoDataUrl, 600, 0.7)

    setIsSubmitting(true)
    try {
      const result = await submitForm({
        name: formData.name.trim(),
        college: formData.college,
        department: formData.department,
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        photo: compressedPhoto,
        style: selectedStyle || 'futuristic',
        madeInSeconds: timer.current,
        consentGiven: formData.consent
      })
      setPhoto(photoDataUrl)
      setCardId(result.cardId)
      setMadeInSeconds(result.madeInSeconds)
      setQuote(getQuoteFor(formData.name))
      setStep('style')
    } catch (err) {
      showToast(err.message || 'Failed to generate card', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, timer, validateForm])

  const readFileAsDataUrl = useCallback((file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null)
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(file)
    })
  }, [])

  const handleCaptured = useCallback((dataUrl) => {
    if (!dataUrl) return
    stopCamera()
    setPendingPhoto(dataUrl)
    setPhotoMode('edit')
  }, [stopCamera])

  const handleMakeAnother = useCallback(() => {
    setStep('form')
    setFormData({ name: '', college: '', department: '', mobile: '', email: '', consent: false })
    setPhoto(null)
    setPhotoMode('camera')
    setPendingPhoto(null)
    setCardId(null)
    setMadeInSeconds(null)
    setQuote('')
    setSelectedStyle(null)
    setErrors({})
    setFocused(false)
    stopCamera()
  }, [stopCamera])

  const handleStyleSelect = useCallback(async (style) => {
    if (cardId) {
      try {
        await updateCardStyle(cardId, style)
      } catch (err) {
        showToast(err.message || 'Could not save template on server', 'error')
      }
    }
    setSelectedStyle(style)
    setStep('result')
    showToast('Card generated! 🎉', 'success')
  }, [cardId])

  const handleChangeTemplate = useCallback(() => {
    setStep('style')
    showToast('Pick another template', 'info')
  }, [])

  const getCardBlob = useCallback(async () => {
    const srcEl = cardRef.current?.getElement?.() || cardRef.current
    if (!srcEl) {
      console.error('Card element not found')
      return null
    }
    try {
      // Wait for Inter + card images so the capture is fully laid out and
      // pixel-identical to what is on screen.
      if (document.fonts?.ready) await document.fonts.ready

      // Build an off-screen 1350px-wide copy of the card so the browser lays
      // it out naturally with the real stylesheet + fonts (no subpixel overlap).
      const clone = srcEl.cloneNode(true)
      clone.removeAttribute('id')
      clone.style.width = '1350px'
      clone.style.height = 'auto'
      clone.style.margin = '0'
      clone.style.touchAction = 'auto'

      const holder = document.createElement('div')
      holder.style.cssText =
        'position:fixed;left:-20000px;top:0;width:1350px;z-index:-9999;pointer-events:none;'
      holder.appendChild(clone)
      document.body.appendChild(holder)

      try {
        // Let layout settle: a couple of frames + image decodes.
        await new Promise(r => setTimeout(r, 120))
        await Promise.all(
          Array.from(clone.querySelectorAll('img')).map((img) =>
            img.decode ? img.decode().catch(() => {}) : Promise.resolve()
          )
        )
        const rect = clone.getBoundingClientRect()
        const w = rect.width || 1350
        const h = rect.height || Math.round((w * 16) / 9)

        const dataUrl = await toPng(clone, {
          backgroundColor: '#0a1128',
          width: w,
          height: h,
          pixelRatio: 1,
          skipAutoScale: true,
          cacheBust: true
        })
        const res = await fetch(dataUrl)
        return await res.blob()
      } finally {
        holder.remove()
      }
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
      link.download = `KR-Group-Fresher-Card-${cardId}.png`
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
      const file = new File([blob], `KR-Group-Fresher-Card-${cardId}.png`, { type: 'image/png' })
      const shareData = { title: 'My KR Group Fresher Card', text: BRAND.shareText }

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
          link.download = `KR-Group-Fresher-Card-${cardId}.png`
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
    const caption = `Just got my KR Group Fresher Card! 🎓\n\n${formData.name} | ${formData.department}\n\n#KRGroup2026 #FreshersDay #WhereAmbitionMeetsExcellence`
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
      const file = new File([blob], `KR-Group-Fresher-Card-${cardId}.png`, { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'My KR Group Fresher Card', files: [file] })
        showToast('Shared! Select Instagram from the share menu.', 'success')
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `KR-Group-Fresher-Card-${cardId}.png`
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
    if (step === 'photo' && photoMode === 'camera') {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [step, photoMode, startCamera, stopCamera])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const isFormComplete = formData.name.trim() &&
    formData.college &&
    formData.department &&
    /^\d{10}$/.test(formData.mobile.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
    formData.consent

  return (
    <>
      {step === 'form' && <BackgroundFX />}
      <div className="container">
        <div className="page">
        <header className="header">
          <img className="header-logo" src={logo} alt="KR Logo" />
          <div className="logo">
            <h1>K. RAMAKRISHNAN</h1>
            <h2>Group of Institutions</h2>
            <h2 className="logo-tag">FRESHER CARD</h2>
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
                autoFocus
                maxLength={60}
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="college">College *</label>
              <select
                id="college"
                value={formData.college}
                onChange={e => updateField('college', e.target.value)}
              >
                <option value="">Choose your college</option>
                {Object.values(COLLEGES).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.college && <div className="field-error">{errors.college}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                value={formData.department}
                onChange={e => updateField('department', e.target.value)}
                disabled={!formData.college}
              >
                <option value="">
                  {formData.college ? 'Choose your department' : 'Select a college first'}
                </option>
                {(COLLEGE_DEPARTMENTS[formData.college] || []).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <div className="field-error">{errors.department}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="mobile">Mobile Number *</label>
              <input
                id="mobile"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={e => updateField('mobile', e.target.value.replace(/\D/g, ''))}
                autoComplete="tel"
              />
              {errors.mobile && <div className="field-error">{errors.mobile}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                maxLength={100}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                autoComplete="email"
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
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
                  I agree KR Group can use my photo and details for this event and official social media.
                </span>
              </label>
              {errors.consent && <div className="field-error">{errors.consent}</div>}
            </div>

            <div className="btn-sticky-wrap">
            <button
              type="button"
              className="btn btn-primary btn-sticky"
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
          </div>
          </form>
        )}

        {step === 'photo' && (photoMode === 'edit' && pendingPhoto ? (
          <PhotoEditor
            src={pendingPhoto}
            busy={isSubmitting}
            onConfirm={(croppedDataUrl) => submitCard(croppedDataUrl)}
            onRetake={() => {
              setPendingPhoto(null)
              setPhotoMode('camera')
              startCamera()
            }}
            onChooseAnother={async (file) => {
              const dataUrl = await readFileAsDataUrl(file)
              if (dataUrl) setPendingPhoto(dataUrl)
            }}
            onBack={() => {
              stopCamera()
              setPendingPhoto(null)
              setPhotoMode('camera')
              setStep('form')
            }}
          />
        ) : (
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
                        handleCaptured(dataUrl)
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
              {!stream && cameraStarting && (
                <div className="camera-error" style={{ border: '2px dashed var(--border)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', marginBottom: '8px', animation: 'spin 1.2s linear infinite' }}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p style={{ fontSize: '1.0625rem', fontWeight: 500 }}>Starting camera…</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Allow camera access if your browser asks</p>
                </div>
              )}
              {!stream && !cameraStarting && (
                <div className="camera-error" style={{ border: '2px dashed var(--border)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p style={{ fontSize: '1.0625rem', fontWeight: 500 }}>{cameraBlocked ? 'Camera permission denied' : 'Camera not available'}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{cameraHint}</p>
                  <button type="button" className="btn btn-secondary" onClick={() => startCamera()} style={{ width: 'auto', minHeight: 46, padding: '12px 20px' }}>
                    ↻ Retry Camera
                  </button>
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
                    const file = e.target.files && e.target.files[0]
                    e.target.value = ''
                    if (file) {
                      const dataUrl = await readFileAsDataUrl(file)
                      handleCaptured(dataUrl)
                    }
                  }}
                />
              </label>
              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8125rem', margin: '0' }}>
                {isSubmitting
                  ? 'Generating your card...'
                  : stream
                    ? 'Tap green circle to capture, or upload from gallery'
                    : cameraStarting
                      ? 'Starting camera…'
                      : 'Select a photo from your gallery'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { stopCamera(); setPendingPhoto(null); setPhotoMode('camera'); setStep('form'); }}
              style={{ marginTop: 16 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}>
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Form
            </button>
          </div>
        ))}

        {step === 'style' && (
          <StyleSelector
            onContinue={handleStyleSelect}
            onBack={() => setStep('photo')}
            studentData={{ name: formData.name, photo }}
          />
        )}

        {step === 'result' && (
          <CardResult
            ref={cardRef}
            data={{
              cardId,
              name: formData.name,
              department: formData.department,
              college: formData.college,
              photo,
              quote,
              madeInSeconds,
              selectedStyle
            }}
            onDownload={handleDownload}
            onCopyCaption={handleCopyCaption}
            onShare={handleShare}
            onWhatsApp={handleWhatsApp}
            onInstagramStory={handleInstagramStory}
            onMakeAnother={handleMakeAnother}
            onChangeTemplate={handleChangeTemplate}
          />
        )}
      </div>
    </div>
    </>
  )
}

export default FormPage