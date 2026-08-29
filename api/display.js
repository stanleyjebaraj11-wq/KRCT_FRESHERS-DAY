import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Public, read-only feed for the freshers-day monitor slideshow.
// It returns the latest entries (including the photo) so a big screen can
// rotate through cards as they are created. No organizer password required
// because this is intended for an on-stage/stall display. If you want to lock
// it down, set DISPLAY_PASSWORD and pass ?password=... from the display page.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Admin-only: reuse the organizer password so there's a single credential.
  const { password } = req.query
  if (!password || password !== process.env.ORGANIZER_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 60, 200)

  try {
    const rows = await sql`
      SELECT card_id, name, college, department, fun_fact, dream_job, photo, style, made_in_seconds, created_at
      FROM fresher_entries
      WHERE photo IS NOT NULL
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return res.status(200).json(rows)
  } catch (err) {
    console.error('Display error:', err)
    return res.status(500).json({ error: 'Database error' })
  }
}
