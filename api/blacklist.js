// api/blacklist.js — admin-only blacklist management

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

  const { targetId, action, reason } = req.body;
  if (!targetId || !action) return res.status(400).json({ error: 'Missing fields' });

  try {
    if (action === 'add') {
      await db.execute({
        sql: 'UPDATE users SET blacklisted = 1, blacklist_reason = ? WHERE user_id = ?',
        args: [reason || '', targetId],
      });
      return res.status(200).json({ success: true, action: 'blacklisted', targetId });
    } else {
      await db.execute({
        sql: 'UPDATE users SET blacklisted = 0, blacklist_reason = NULL WHERE user_id = ?',
        args: [targetId],
      });
      return res.status(200).json({ success: true, action: 'unblacklisted', targetId });
    }
  } catch (err) {
    console.error('Blacklist error:', err);
    return res.status(500).json({ error: 'Failed to update blacklist' });
  }
}
