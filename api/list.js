import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.query

  if (!password || password !== process.env.ORGANIZER_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  try {
    const rows = await sql`
      SELECT id, card_id, name, department, mobile_number AS mobile, email, made_in_seconds, consent_given, created_at
      FROM fresher_entries
      ORDER BY created_at DESC
    `

    return res.status(200).json(rows)
  } catch (err) {
    console.error('List error:', err)
    return res.status(500).json({ error: 'Database error' })
  }
}