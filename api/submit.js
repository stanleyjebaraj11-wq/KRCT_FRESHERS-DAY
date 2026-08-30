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
  return `KRFRESHER-${num}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests, please wait a moment' })
  }

  const { name, college, department, mobile, email, photo, style, madeInSeconds, consentGiven } = req.body

  if (!name?.trim() || !department?.trim()) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (consentGiven !== true) {
    return res.status(400).json({ error: 'Consent is required' })
  }

  const mobileDigits = String(mobile || '').replace(/\D/g, '')
  if (mobileDigits.length !== 10) {
    return res.status(400).json({ error: 'Enter a valid 10-digit mobile number' })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    return res.status(400).json({ error: 'Enter a valid email address' })
  }

  // Store the photo as a data URL (used by the live slideshow monitor).
  if (photo && (!photo.startsWith('data:image/') || photo.length > 3_000_000)) {
    return res.status(400).json({ error: 'Photo is too large or invalid' })
  }

  const safeCollege = college === 'KRCE' ? 'KRCE' : 'KRCT'
  const safeStyle = ['futuristic', 'dreamer', 'bold', 'classic'].includes(style) ? style : 'futuristic'

  try {
    const cardId = generateCardId()

    await sql`
      INSERT INTO fresher_entries (card_id, name, college, department, mobile_number, email, photo, style, made_in_seconds, consent_given)
      VALUES (${cardId}, ${name.trim()}, ${safeCollege}, ${department.trim()}, ${mobileDigits}, ${String(email).trim()}, ${photo || null}, ${safeStyle}, ${madeInSeconds}, ${consentGiven})
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