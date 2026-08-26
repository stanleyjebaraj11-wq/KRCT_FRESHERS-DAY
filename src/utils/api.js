export async function submitForm(data) {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || 'Submission failed')
  }

  return result
}

export async function fetchEntries(password) {
  const res = await fetch(`/api/list?password=${encodeURIComponent(password)}`)
  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || 'Failed to fetch entries')
  }

  return result
}