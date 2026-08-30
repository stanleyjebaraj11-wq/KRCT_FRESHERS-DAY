import { DEPARTMENTS } from './constants'

export async function submitForm(data) {
  // Dev-only mock so the full flow works in local preview without a database.
  if (import.meta.env.DEV) {
    await new Promise(r => setTimeout(r, 600))
    const num = Math.floor(Math.random() * 90000) + 10000
    return { cardId: `KRGRP2026-${num}`, madeInSeconds: data.madeInSeconds ?? 0 }
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
      card_id: `KRGRP2026-${10000 + i}`,
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