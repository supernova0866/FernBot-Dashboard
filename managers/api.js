// managers/api.js — centralized API calls

const API = (() => {
  const BASE = '';  // same origin, serverless functions under /api/

  async function request(path, options = {}) {
    const token = localStorage.getItem('fern-token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(BASE + path, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
    return data;
  }

  // ── STATS ──
  async function getStats() {
    return request('/api/stats');
  }

  // ── USER ──
  async function getUser() {
    return request('/api/user');
  }

  // ── PING / KEEP ALIVE ──
  async function ping() {
    return request('/api/ping', { method: 'POST' });
  }

  // ── STAFF: HEAT ──
  async function heatAction(targetId, action, amount) {
    return request('/api/heat', {
      method: 'POST',
      body: JSON.stringify({ targetId, action, amount }),
    });
  }

  // ── STAFF: TIER ──
  async function setTier(targetId, tier) {
    return request('/api/tier', {
      method: 'POST',
      body: JSON.stringify({ targetId, tier }),
    });
  }

  // ── STAFF: BLACKLIST ──
  async function blacklistUser(targetId, reason) {
    return request('/api/blacklist', {
      method: 'POST',
      body: JSON.stringify({ targetId, reason, action: 'add' }),
    });
  }

  async function unblacklistUser(targetId) {
    return request('/api/blacklist', {
      method: 'POST',
      body: JSON.stringify({ targetId, action: 'remove' }),
    });
  }

  // ── STAFF: ACTION LOGS ──
  async function getLogs(limit = 20) {
    return request(`/api/logs?limit=${limit}`);
  }

  return {
    getStats,
    getUser,
    ping,
    heatAction,
    setTier,
    blacklistUser,
    unblacklistUser,
    getLogs,
  };
})();
