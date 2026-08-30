import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

const VALID_STYLES = ['futuristic', 'dreamer', 'bold', 'classic', 'royal', 'spiderman', 'batman', 'onepiece', 'anime']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { cardId, style } = req.body || {}
  const safeStyle = VALID_STYLES.includes(style) ? style : null

  if (!cardId || !/^KRFRESHER-\d{5}$/.test(String(cardId).trim()) || !safeStyle) {
    return res.status(400).json({ error: 'Invalid style or card id' })
  }

  try {
    await sql`
      UPDATE fresher_entries
      SET style = ${safeStyle}
      WHERE card_id = ${String(cardId).trim()}
    `
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Update style error:', err)
    return res.status(500).json({ error: 'Database error' })
  }
}