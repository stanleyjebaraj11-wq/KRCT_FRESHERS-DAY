import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

const RATE_LIMIT_WINDOW = 5000
const ipTimestamps = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const timestamps = ipTimestamps.get(ip) || []
  const recent = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)
  if (recent.length >= 2) {
    return false
  }
  recent.push(now)
  ipTimestamps.set(ip, recent)
  return true
}

function generateCardId() {
  const num = Math.floor(Math.random() * 90000) + 10000
  return `KRCT2026-${num}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests, please wait a moment' })
  }

  const { name, department, funFact, dreamJob, madeInSeconds, consentGiven } = req.body

  if (!name?.trim() || !department?.trim() || !funFact?.trim() || !dreamJob?.trim()) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (consentGiven !== true) {
    return res.status(400).json({ error: 'Consent is required' })
  }

  if (funFact.length > 50) {
    return res.status(400).json({ error: 'Fun fact must be 50 characters or less' })
  }

  if (dreamJob.length > 20 || dreamJob.includes(' ')) {
    return res.status(400).json({ error: 'Dream job must be one word, 20 characters or less' })
  }

  try {
    const cardId = generateCardId()

    await sql`
      INSERT INTO fresher_entries (card_id, name, department, fun_fact, dream_job, made_in_seconds, consent_given)
      VALUES (${cardId}, ${name.trim()}, ${department.trim()}, ${funFact.trim()}, ${dreamJob.trim()}, ${madeInSeconds}, ${consentGiven})
    `

    return res.status(200).json({ cardId, madeInSeconds })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Duplicate entry, please try again' })
    }
    console.error('Submit error:', err)
    return res.status(500).json({ error: 'Database error' })
  }
}