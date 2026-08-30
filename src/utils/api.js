import { DEPARTMENTS } from './constants'

export async function submitForm(data) {
  // Dev-only mock so the full flow works in local preview without a database.
  if (import.meta.env.DEV) {
    await new Promise(r => setTimeout(r, 600))
    const num = Math.floor(Math.random() * 90000) + 10000
    return { cardId: `KRFRESHER-${num}`, madeInSeconds: data.madeInSeconds ?? 0 }
  }

  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  let result
  try {
    result = await res.json()
  } catch {
    throw new Error('Server returned an invalid response. Please try again.')
  }

  if (!res.ok) {
    throw new Error(result.error || 'Submission failed')
  }

  return result
}

// Hide/unhide a card from the live slideshow only (it stays in the organizer
// entries). Requires the organizer password.
export async function setCardHidden(cardId, hidden, password) {
  if (import.meta.env.DEV) {
    await new Promise(r => setTimeout(r, 150))
    return { ok: true, hidden }
  }

  const res = await fetch('/api/hide-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, hidden, password })
  })

  let result
  try {
    result = await res.json()
  } catch {
    throw new Error('Server returned an invalid response. Please try again.')
  }

  if (!res.ok) {
    throw new Error(result.error || 'Update failed')
  }

  return result
}

export async function fetchEntries(password) {
  const res = await fetch(`/api/list?password=${encodeURIComponent(password)}`)
  let result
  try {
    result = await res.json()
  } catch {
    throw new Error('Server returned an invalid response. Please try again.')
  }

  if (!res.ok) {
    throw new Error(result.error || 'Failed to fetch entries')
  }

  return result
}

// Persists the chosen template against the card already inserted at the photo
// step. In dev this is a no-op because there is no database.
export async function updateCardStyle(cardId, style) {
  if (import.meta.env.DEV) {
    await new Promise(r => setTimeout(r, 200))
    return { ok: true }
  }

  const res = await fetch('/api/update-style', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, style })
  })

  let result
  try {
    result = await res.json()
  } catch {
    throw new Error('Server returned an invalid response. Please try again.')
  }

  if (!res.ok) {
    throw new Error(result.error || 'Could not apply template')
  }

  return result
}

// Feed for the live slideshow monitor. Falls back to a few sample cards in dev
// so the display page works without a database connection.
export async function fetchDisplay(password, limit = 60) {
  if (import.meta.env.DEV) {
    await new Promise(r => setTimeout(r, 400))
    const samplePhotos = [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%230a1128"/><circle cx="200" cy="200" r="120" fill="%2300d4aa"/></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%231a1030"/><circle cx="200" cy="200" r="120" fill="%23ff6b9d"/></svg>'
    ]
    return Array.from({ length: 6 }).map((_, i) => ({
      card_id: `KRFRESHER-${10000 + i}`,
      name: ['Aarav', 'Bhavana', 'Charan', 'Divya', 'Karthik', 'Isha'][i],
      college: i % 2 ? 'KRCE' : 'KRCT',
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      photo: samplePhotos[i % 2],
      style: ['futuristic', 'dreamer', 'bold', 'classic'][i % 4],
      made_in_seconds: 42 + i,
      created_at: new Date().toISOString()
    }))
  }

  const res = await fetch(`/api/display?limit=${encodeURIComponent(limit)}&password=${encodeURIComponent(password || '')}`)
  let result
  try {
    result = await res.json()
  } catch {
    throw new Error('Server returned an invalid response. Please try again.')
  }

  if (!res.ok) {
    throw new Error(result.error || 'Failed to load display')
  }

  return result
}