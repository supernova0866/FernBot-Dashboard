// api/stats.js — public stats endpoint

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const [users, activeCalls, totalCalls, msgs, guilds] = await Promise.all([
      db.execute('SELECT COUNT(*) as count FROM users'),
      db.execute("SELECT COUNT(*) as count FROM calls WHERE status = 'active'"),
      db.execute('SELECT COUNT(*) as count FROM calls'),
      db.execute('SELECT SUM(msgsent) as total FROM users'),
      db.execute('SELECT guild1_id, guild2_id FROM calls'),
    ]);

    const guildSet = new Set();
    for (const row of guilds.rows) {
      if (row.guild1_id) guildSet.add(row.guild1_id);
      if (row.guild2_id) guildSet.add(row.guild2_id);
    }

    return res.status(200).json({
      totalUsers:        users.rows[0].count,
      activeCalls:       activeCalls.rows[0].count,
      totalCalls:        totalCalls.rows[0].count,
      totalMessages:     msgs.rows[0].total || 0,
      registeredServers: guildSet.size,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
