// api/ping.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const url = process.env.RENDER_PING_URL;
  if (!url) return res.status(500).json({ error: 'RENDER_PING_URL not set' });
  try {
    await fetch(`${url}/ping`);
    return res.status(200).json({ success: true, pingedAt: Date.now() });
  } catch {
    return res.status(500).json({ error: 'Failed to ping bot' });
  }
}
