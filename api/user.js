// api/user.js — fetch logged-in user from DB

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

async function verifyToken(req) {
  const auth = req.headers['authorization'];
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);

  const res = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const discordUser = await verifyToken(req);
  if (!discordUser) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE user_id = ?',
      args: [discordUser.id],
    });

    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });

    const row = result.rows[0];
    return res.status(200).json({
      userID:    row.user_id,
      username:  row.username,
      tier:      row.tier,
      badges:    JSON.parse(row.badges || '[]'),
      msgsent:   row.msgsent,
      heat:      row.heat,
      reputation: row.reputation,
      xp:        row.xp,
      level:     row.level,
    });
  } catch (err) {
    console.error('User error:', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}
