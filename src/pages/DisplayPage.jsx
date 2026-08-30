import { useState, useEffect, useCallback, useRef } from 'react'
import CardResult from '../components/CardResult'
import { fetchDisplay } from '../utils/api'
import { getQuoteFor } from '../utils/constants'

const ROTATE_MS = 6000
const REFRESH_MS = 8000
const NEW_MS = 90000
const DISPLAY_KEY = 'krct_display_password'

function DisplayPage() {
  const [entries, setEntries] = useState([])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState(() => sessionStorage.getItem(DISPLAY_KEY) || '')
  const [unlocked, setUnlocked] = useState(() => !!sessionStorage.getItem(DISPLAY_KEY))
  const [error, setError] = useState('')
  const cardRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchDisplay(password, 80)
      setEntries(data)
      setError('')
    } catch (err) {
      // A 401 means the saved password is wrong/expired — drop back to the gate.
      if (String(err.message).includes('password')) {
        sessionStorage.removeItem(DISPLAY_KEY)
        setUnlocked(false)
        setPassword('')
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [password])

  const handleUnlock = useCallback((e) => {
    e.preventDefault()
    const pw = password.trim()
    if (!pw) return
    sessionStorage.setItem(DISPLAY_KEY, pw)
    setUnlocked(true)
    setError('')
    setLoading(true)
    load()
  }, [password, load])

  useEffect(() => {
    if (!unlocked) return
    load()
    const refresh = setInterval(load, REFRESH_MS)
    return () => clearInterval(refresh)
  }, [unlocked, load])

  useEffect(() => {
    if (entries.length <= 1 || paused) return
    const t = setInterval(() => {
      setIndex(i => (i + 1) % entries.length)
    }, ROTATE_MS)
    return () => clearInterval(t)
  }, [entries.length, paused])

  useEffect(() => {
    if (index >= entries.length && entries.length > 0) {
      setIndex(0)
    }
  }, [entries.length, index])

  const goNext = useCallback(() => {
    if (entries.length <= 1) return
    setIndex(i => (i + 1) % entries.length)
  }, [entries.length])

  const current = entries[index]
  const isNew = current && (Date.now() - new Date(current.created_at).getTime()) < NEW_MS

  if (!unlocked) {
    return (
      <div className="display-page">
        <form className="display-gate" onSubmit={handleUnlock}>
          <div className="display-brand" style={{ justifyContent: 'center', marginBottom: 8 }}>
            <span className="display-live">● ADMIN</span>
            <strong>KR Group Freshers Day 2026</strong>
          </div>
          <p className="subtitle" style={{ textAlign: 'center' }}>Enter admin password to open the live slideshow</p>
          <div className="field-group">
            <label htmlFor="display-password">Admin Password</label>
            <input
              id="display-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {error && <div className="field-error">{error}</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={!password.trim()}>
            Open Slideshow
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="display-page">
      <div className="display-topbar">
        <div className="display-brand">
          <span className="display-live">● LIVE</span>
          <strong>KR Group Freshers Day 2026</strong>
        </div>
        <div className="display-counter">
          {entries.length} card{entries.length === 1 ? '' : 's'} created
        </div>
      </div>

      <div className="display-controls">
        <button
          type="button"
          className={paused ? 'dc-btn dc-btn-active' : 'dc-btn'}
          onClick={() => setPaused(p => !p)}
        >
          {paused ? '▶ Resume' : '❚❚ Pause'}
        </button>
        <button type="button" className="dc-btn" onClick={goNext} disabled={entries.length <= 1}>
          Next ▶❘
        </button>
        {paused && <span className="dc-hint">Rotation paused — showing a fixed card</span>}
      </div>

      <div className="display-stage">
        {loading && entries.length === 0 && (
          <p className="display-loading">Loading fresher cards…</p>
        )}
        {!loading && entries.length === 0 && (
          <p className="display-loading">No cards yet — generate one to see it here! 🎉</p>
        )}
        {current && (
          <div className="display-card-wrap">
            <CardResult
              ref={cardRef}
              hideActions
              data={{
                cardId: current.card_id,
                name: current.name,
                department: current.department,
                college: current.college,
                photo: current.photo,
                quote: current.quote || getQuoteFor(current.name),
                selectedStyle: current.style
              }}
            />
            {isNew && <div className="display-new-badge">NEW</div>}
          </div>
        )}
      </div>

      <div className="display-footer">
        K. Ramakrishnan Group of Institutions · Where Ambition Meets Excellence
      </div>
    </div>
  )
}

export default DisplayPage
