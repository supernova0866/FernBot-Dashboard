// api/tier.js — admin-only tier management

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

const CONFIG_URL = 'https://raw.githubusercontent.com/supernova0866/FernBot/main/configdata.json';

async function verifyAdmin(req) {
  const auth = req.headers['authorization'];
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);

  const res = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const user = await res.json();

  const config = await fetch(CONFIG_URL).then(r => r.json());
  if (!config.admins.includes(user.id)) return null;
  return user;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const admin = await verifyAdmin(req);
  if (!admin) return res.status(403).json({ error: 'Forbidden — admins only' });

  const { targetId, tier } = req.body;
  if (!targetId || tier === undefined) return res.status(400).json({ error: 'Missing fields' });

  const newTier = Number(tier);
  if (newTier < 0 || newTier > 3 || isNaN(newTier)) {
    return res.status(400).json({ error: 'Invalid tier — must be 0 to 3' });
  }

  try {
    const check = await db.execute({
      sql: 'SELECT user_id FROM users WHERE user_id = ?',
      args: [targetId],
    });
    if (!check.rows[0]) return res.status(404).json({ error: 'User not found' });

    await db.execute({
      sql: 'UPDATE users SET tier = ? WHERE user_id = ?',
      args: [newTier, targetId],
    });

    return res.status(200).json({ success: true, targetId, newTier });
  } catch (err) {
    console.error('Tier error:', err);
    return res.status(500).json({ error: 'Failed to update tier' });
  }
}
