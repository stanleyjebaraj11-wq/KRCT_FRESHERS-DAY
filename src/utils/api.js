export async function submitForm(data) {
  // Dev-only mock so the full flow works in local preview without a database.
  if (import.meta.env.DEV) {
    await new Promise(r => setTimeout(r, 600))
    const num = Math.floor(Math.random() * 90000) + 10000
    return { cardId: `KRCT2026-${num}`, madeInSeconds: data.madeInSeconds ?? 0 }
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