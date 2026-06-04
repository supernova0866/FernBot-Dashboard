// api/heat.js — staff heat management

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

const STAFF_IDS_URL = 'https://raw.githubusercontent.com/supernova0866/FernBot/main/configdata.json';

async function getStaffIds() {
  const res = await fetch(STAFF_IDS_URL);
  const config = await res.json();
  return [...new Set([...config.admins, ...config.moderators])];
}

async function verifyStaff(req) {
  const auth = req.headers['authorization'];
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);

  const res = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const user = await res.json();

  const staffIds = await getStaffIds();
  if (!staffIds.includes(user.id)) return null;
  return user;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const staff = await verifyStaff(req);
  if (!staff) return res.status(403).json({ error: 'Forbidden' });

  const { targetId, action, amount } = req.body;
  if (!targetId || !action) return res.status(400).json({ error: 'Missing fields' });

  try {
    const result = await db.execute({
      sql: 'SELECT heat FROM users WHERE user_id = ?',
      args: [targetId],
    });

    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });

    const currentHeat = result.rows[0].heat;

    if (action === 'check') return res.status(200).json({ heat: currentHeat });

    const delta = action === 'add' ? Number(amount) : -Number(amount);
    const newHeat = Math.max(0, currentHeat + delta);

    await db.execute({
      sql: 'UPDATE users SET heat = ?, last_decay = ? WHERE user_id = ?',
      args: [newHeat, Date.now(), targetId],
    });

    return res.status(200).json({ success: true, newHeat, action, targetId });
  } catch (err) {
    console.error('Heat error:', err);
    return res.status(500).json({ error: 'Failed to update heat' });
  }
}
