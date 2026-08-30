import { useState, useCallback } from 'react'
import { fetchEntries, setCardHidden } from '../utils/api'
import { showToast } from '../utils/toast'

function OrganizerPage() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')

  const handleUnlock = useCallback(async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await fetchEntries(password)
      setEntries(data)
      setUnlocked(true)
      showToast(`Loaded ${data.length} entries`, 'success')
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [password])

  const handleExport = useCallback(() => {
    if (entries.length === 0) return

    const headers = ['Card ID', 'Name', 'Department', 'Mobile', 'Email', 'Time (s)', 'Consent', 'Created At']
    const rows = entries.map(e => [
      e.card_id,
      e.name,
      e.department,
      e.mobile,
      e.email,
      e.made_in_seconds ?? '',
      e.consent_given ? 'Yes' : 'No',
      new Date(e.created_at).toLocaleString()
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `krct-fresher-entries-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
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

        <div className="count-badge">
          <span>{entries.length}</span> total entries
        </div>

        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table className="organizer-table">
            <thead>
              <tr>
                <th>Card ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Time</th>
                <th>Consent</th>
                <th>Display</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>{entry.card_id}</td>
                  <td style={{ fontWeight: 600 }}>{entry.name}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{entry.department}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{entry.mobile}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{entry.email}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: entry.made_in_seconds <= 60 ? 'var(--success)' : 'var(--muted)' }}>
                    {entry.made_in_seconds ?? '-'}s
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {entry.consent_given ? (
                      <span style={{ color: 'var(--success)' }}>✓ Yes</span>
                    ) : (
                      <span style={{ color: 'var(--error)' }}>✗ No</span>
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
                        border: `1px solid ${entry.hidden ? 'var(--error)' : 'var(--accent)'}`,
                        background: entry.hidden ? 'rgba(255,92,92,0.08)' : 'rgba(0,212,170,0.08)',
                        color: entry.hidden ? 'var(--error)' : 'var(--accent)'
                      }}
                    >
                      {updatingId === entry.id ? '…' : entry.hidden ? 'Show' : 'Hide'}
                    </button>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {new Date(entry.created_at).toLocaleString()}
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
    </div>
  )
}

export default OrganizerPage