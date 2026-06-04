// api/stats.js — public stats endpoint

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const [activeCalls, totalCalls, msgs, users] = await Promise.all([
      db.execute("SELECT COUNT(*) as count FROM calls WHERE status = 'active'"),
      db.execute('SELECT COUNT(*) as count FROM calls'),
      db.execute('SELECT SUM(msgsent) as total FROM users'),
      db.execute('SELECT COUNT(*) as count FROM users'),
    ]);

    const botRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    });
    const botGuilds = await botRes.json();
    const serverCount = Array.isArray(botGuilds) ? botGuilds.length : 0;

    return res.status(200).json({
      totalUsers:        users.rows[0].count,
      activeCalls:       activeCalls.rows[0].count,
      totalCalls:        totalCalls.rows[0].count,
      totalMessages:     msgs.rows[0].total || 0,
      registeredServers: serverCount,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
