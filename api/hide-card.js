import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password, cardId, hidden } = req.body || {}

  if (!password || password !== process.env.ORGANIZER_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  if (!cardId || !/^(KRFRESHER|KRGRP2026)-\d{5}$/.test(String(cardId).trim())) {
    return res.status(400).json({ error: 'Invalid card id' })
  }

  const isHidden = hidden === true

  try {
    await sql`
      UPDATE fresher_entries
      SET hidden = ${isHidden}
      WHERE card_id = ${String(cardId).trim()}
    `
    return res.status(200).json({ ok: true, hidden: isHidden })
  } catch (err) {
    console.error('Hide card error:', err)
    return res.status(500).json({ error: 'Database error' })
  }
}