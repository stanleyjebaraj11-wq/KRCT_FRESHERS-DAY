import { useState, useCallback, useMemo, useEffect } from 'react'
import { fetchEntries, setCardHidden, deleteEntry } from '../utils/api'
import { showToast } from '../utils/toast'

const inputStyle = {
  padding: '12px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--bg-elevated)',
  color: 'var(--fg)',
  fontSize: '0.95rem',
  outline: 'none'
}

function OrganizerPage() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [viewPhoto, setViewPhoto] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [collegeFilter, setCollegeFilter] = useState('')
  const [hiddenFilter, setHiddenFilter] = useState('')

  const loadEntries = useCallback(async () => {
    const data = await fetchEntries(password)
    setEntries(data)
    return data
  }, [password])

  const handleUnlock = useCallback(async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loadEntries()
      setUnlocked(true)
      showToast(`Loaded ${data.length} entries`, 'success')
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [loadEntries])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const data = await loadEntries()
      showToast(`Loaded ${data.length} entries`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setRefreshing(false)
    }
  }, [loadEntries])

  const handleExport = useCallback(() => {
    if (entries.length === 0) return

    const headers = ['Card ID', 'Name', 'College', 'Department', 'Mobile', 'Email', 'Time (s)', 'Consent', 'Hidden', 'Created At']
    const rows = entries.map(e => [
      e.card_id,
      e.name,
      e.college || '',
      e.department,
      e.mobile,
      e.email,
      e.made_in_seconds ?? '',
      e.consent_given ? 'Yes' : 'No',
      e.hidden ? 'Yes' : 'No',
      new Date(e.created_at).toLocaleString()
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `krct-fresher-entries-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    showToast('CSV downloaded!', 'success')
  }, [entries])

  const handleToggleHidden = useCallback(async (entry) => {
    const next = !entry.hidden
    setUpdatingId(entry.id)
    try {
      await setCardHidden(entry.card_id, next, password)
      setEntries(prev => prev.map(e => (e.id === entry.id ? { ...e, hidden: next } : e)))
      showToast(next ? `Hidden ${entry.card_id} from display` : `Shown ${entry.card_id} on display`, 'success')
    } catch (err) {
      showToast(err.message || 'Update failed', 'error')
    } finally {
      setUpdatingId(null)
    }
  }, [password])

  const handleDelete = useCallback(async (entry) => {
    if (!window.confirm(`Delete ${entry.card_id} (${entry.name})? This permanently removes the entry and photo.`)) return
    setDeletingId(entry.id)
    try {
      await deleteEntry(entry.card_id, password)
      setEntries(prev => prev.filter(e => e.id !== entry.id))
      showToast('Entry deleted', 'success')
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error')
    } finally {
      setDeletingId(null)
    }
  }, [password])

  useEffect(() => {
    if (!viewPhoto) return
    const onKey = (e) => {
      if (e.key === 'Escape') setViewPhoto(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewPhoto])

  const stats = useMemo(() => ({
    total: entries.length,
    krct: entries.filter(e => e.college === 'KRCT').length,
    krce: entries.filter(e => e.college === 'KRCE').length,
    hidden: entries.filter(e => e.hidden).length,
    today: entries.filter(e => new Date(e.created_at).toDateString() === new Date().toDateString()).length
  }), [entries])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter(e => {
      const matchQ = !q || [e.card_id, e.name, e.department, e.mobile, e.email]
        .some(v => (v || '').toLowerCase().includes(q))
      const matchC = !collegeFilter || e.college === collegeFilter
      const matchH = hiddenFilter === '' || (hiddenFilter === 'hidden' ? !!e.hidden : !e.hidden)
      return matchQ && matchC && matchH
    })
  }, [entries, search, collegeFilter, hiddenFilter])

  if (!unlocked) {
    return (
      <div className="container">
        <div className="page" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '70vh' }}>
          <div className="header">
            <div className="logo">
              K. Ramakrishnan Group of Institutions

              <span>ORGANIZER PORTAL</span>
            </div>
            <p className="subtitle">Enter password to access fresher entries</p>
          </div>

          <form className="password-form" onSubmit={handleUnlock}>
            <div className="field-group" style={{ textAlign: 'left' }}>
              <label htmlFor="org-password">Organizer Password</label>
              <input
                id="org-password"
                type="password"
                placeholder="Enter organizer password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                disabled={loading}
              />
              {error && <div className="field-error" style={{ color: 'var(--error)' }}>{error}</div>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading || !password} style={{ maxWidth: '280px', margin: '0 auto' }}>
              {loading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                  </svg>
                  Unlocking...
                </>
              ) : 'Unlock Portal'}
              <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner { animation: spin 1s linear infinite; }
              `}</style>
            </button>
          </form>
        </div>
      </div>
    )
  }

  const statCardStyle = {
    flex: 1,
    minWidth: 120,
    padding: '16px 18px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--bg-elevated)',
    textAlign: 'center'
  }

  return (
    <div className="container">
      <div className="page">
        <div className="header">
          <div className="logo">
            K. Ramakrishnan Group of Institutions

            <span>ENTRIES</span>
          </div>
          <p className="subtitle">Freshers Day 2026 • All Submissions</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 22 }}>
          <div style={statCardStyle}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>{stats.total}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>TOTAL</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>{stats.krct}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>KRCT</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>{stats.krce}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>KRCE</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--error)' }}>{stats.hidden}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>HIDDEN</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold)' }}>{stats.today}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>TODAY</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 20 }}>
          <input
            type="search"
            placeholder="Search name / ID / dept / mobile / email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 220 }}
          />
          <select value={collegeFilter} onChange={e => setCollegeFilter(e.target.value)} style={inputStyle}>
            <option value="">All colleges</option>
            <option value="KRCT">KRCT</option>
            <option value="KRCE">KRCE</option>
          </select>
          <select value={hiddenFilter} onChange={e => setHiddenFilter(e.target.value)} style={inputStyle}>
            <option value="">All display status</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
          <button type="button" className="btn btn-secondary" onClick={handleRefresh} disabled={refreshing} style={{ width: 'auto', minHeight: 46, padding: '12px 20px' }}>
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table className="organizer-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Card ID</th>
                <th>Name</th>
                <th>College</th>
                <th>Department</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Time</th>
                <th>Consent</th>
                <th>Display</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', color: 'var(--muted)', padding: '28px 0' }}>
                    No entries match your filters.
                  </td>
                </tr>
              )}
              {filtered.map(entry => (
                <tr key={entry.id} style={entry.hidden ? { opacity: 0.55 } : undefined}>
                  <td>
                    {entry.photo ? (
                      <button
                        type="button"
                        onClick={() => setViewPhoto(entry)}
                        title="View photo"
                        style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'zoom-in', display: 'block' }}
                      >
                        <img
                          src={entry.photo}
                          alt=""
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', display: 'block', border: '1px solid var(--border)' }}
                        />
                      </button>
                    ) : (
                      <span style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>none</span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{entry.card_id}</td>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{entry.name}</td>
                  <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{entry.college || '-'}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{entry.department}</td>
                  <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{entry.mobile}</td>
                  <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{entry.email}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: entry.made_in_seconds <= 60 ? 'var(--success)' : 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {entry.made_in_seconds ?? '-'}s
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {entry.consent_given ? (
                      <span style={{ color: 'var(--success)' }}>✓</span>
                    ) : (
                      <span style={{ color: 'var(--error)' }}>✗</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleHidden(entry)}
                      disabled={updatingId === entry.id}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: updatingId === entry.id ? 'wait' : 'pointer',
                        border: `1px solid ${entry.hidden ? 'var(--accent)' : 'var(--border)'}`,
                        background: entry.hidden ? 'rgba(0,212,170,0.08)' : 'transparent',
                        color: entry.hidden ? 'var(--accent)' : 'var(--muted)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {updatingId === entry.id ? '…' : entry.hidden ? 'Show' : 'Hide'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry)}
                      disabled={deletingId === entry.id}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: deletingId === entry.id ? 'wait' : 'pointer',
                        border: '1px solid rgba(255,92,92,0.5)',
                        background: 'rgba(255,92,92,0.08)',
                        color: 'var(--error)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {deletingId === entry.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {entries.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" onClick={handleExport} style={{ flex: 1, minWidth: '200px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>
            <button className="btn btn-secondary" onClick={() => { setUnlocked(false); setPassword(''); setEntries([]); setError(''); }} style={{ flex: 1, minWidth: '200px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: '8px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Lock Portal
            </button>
          </div>
        )}
      </div>

      {viewPhoto && (
        <div className="photo-viewer" role="dialog" aria-modal="true" onClick={() => setViewPhoto(null)}>
          <div className="photo-viewer-card" onClick={e => e.stopPropagation()}>
            {viewPhoto.photo ? (
              <img src={viewPhoto.photo} alt={viewPhoto.name} />
            ) : (
              <p style={{ color: 'var(--muted)' }}>No photo saved for this entry.</p>
            )}
            <div className="photo-viewer-info">
              <h3>{viewPhoto.name}</h3>
              <p>{viewPhoto.card_id} · {viewPhoto.department} · {viewPhoto.college || ''}</p>
            </div>
            <div className="photo-viewer-actions">
              <a
                className="btn btn-primary"
                href={viewPhoto.photo || '#'}
                download={viewPhoto.card_id ? `${viewPhoto.card_id}.jpg` : 'photo.jpg'}
                onClick={() => showToast(`${viewPhoto.card_id} photo saved!`, 'success')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Photo
              </a>
              <button type="button" className="btn btn-secondary" onClick={() => setViewPhoto(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizerPage