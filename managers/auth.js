// managers/auth.js — Discord OAuth flow, session storage, staff gating

const Auth = (() => {
  const CONFIG_URL = 'https://raw.githubusercontent.com/supernova0866/FernBot/main/configdata.json';
  const DISCORD_API = 'https://discord.com/api/v10';
  const CLIENT_ID = '1091624039287635988';
  const REDIRECT_URI = encodeURIComponent(window.location.origin + '/pages/callback.html');

  // ── SESSION ──
  function getSession() {
    try {
      const raw = localStorage.getItem('fern-session');
      if (!raw) return null;
      const session = JSON.parse(raw);
      // Expire after 7 days
      if (Date.now() > session.expiresAt) {
        clearSession();
        return null;
      }
      return session;
    } catch { return null; }
  }

  function setSession(data) {
    const session = {
      ...data,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem('fern-session', JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem('fern-session');
    localStorage.removeItem('fern-token');
  }

  // ── STAFF CHECK ──
  async function fetchStaffIds() {
    try {
      const cached = sessionStorage.getItem('fern-staff');
      if (cached) return JSON.parse(cached);

      const res = await fetch(CONFIG_URL);
      const config = await res.json();
      const staffIds = [...new Set([...config.admins, ...config.moderators])];
      const adminIds = config.admins;

      sessionStorage.setItem('fern-staff', JSON.stringify({ staffIds, adminIds }));
      return { staffIds, adminIds };
    } catch (e) {
      console.warn('Could not fetch staff config:', e);
      return { staffIds: [], adminIds: [] };
    }
  }

  function isStaff(discordId, staffIds) {
    return staffIds.includes(discordId);
  }

  function isAdmin(discordId, adminIds) {
    return adminIds.includes(discordId);
  }

  function isMod(discordId, staffIds, adminIds) {
    return staffIds.includes(discordId) && !adminIds.includes(discordId);
  }

  // ── OAUTH ──
  function login() {
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth-state', state);
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify&state=${state}`;
    window.location.href = url;
  }

  function logout() {
    clearSession();
    window.location.href = '/pages/home.html';
  }

  // ── FETCH USER FROM DISCORD API ──
  async function fetchDiscordUser(accessToken) {
    const res = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to fetch Discord user');
    return res.json();
  }

  // ── HANDLE CALLBACK (called from callback page) ──
  async function handleCallback(code, state) {
    const savedState = sessionStorage.getItem('oauth-state');
    if (state !== savedState) throw new Error('State mismatch');
    sessionStorage.removeItem('oauth-state');

    // Exchange code for token via serverless function
    const res = await fetch('/api/callback.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) throw new Error('Token exchange failed');
    const { access_token } = await res.json();

    localStorage.setItem('fern-token', access_token);

    // Fetch Discord user
    const discordUser = await fetchDiscordUser(access_token);

    // Fetch staff IDs from FernBot config
    const { staffIds, adminIds } = await fetchStaffIds();

    const session = {
      discordId: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      avatar: discordUser.avatar,
      isStaff: isStaff(discordUser.id, staffIds),
      isAdmin: isAdmin(discordUser.id, adminIds),
      isMod: isMod(discordUser.id, staffIds, adminIds),
    };

    setSession(session);
    return session;
  }

  // ── GATE HELPERS ──
  // Shows login gate if no session, calls cb if authed
  function requireAuth(cb) {
    const session = getSession();
    if (!session) {
      showLoginGate();
      return;
    }
    cb(session);
  }

  // Shows staff gate if not staff, calls cb if staff
  function requireStaff(cb) {
    const session = getSession();
    if (!session) { showLoginGate(); return; }
    if (!session.isStaff) { showStaffGate(); return; }
    cb(session);
  }

  function showLoginGate() {
    const main = document.getElementById('page-content');
    if (!main) return;
    main.innerHTML = `
      <div class="gate-screen">
        <div class="gate-icon">🔐</div>
        <div class="gate-title">Login to continue</div>
        <div class="gate-sub">Connect your Discord account to access this page.</div>
        <a href="#" onclick="Auth.login()" class="btn-discord">
          <svg width="16" height="13" viewBox="0 0 71 55" fill="none"><path d="M60.1 4.9A58.6 58.6 0 0 0 45.7.7a40 40 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.2 0A39 39 0 0 0 26 .7 58.5 58.5 0 0 0 11.5 5C1.7 19.4-1 33.4.3 47.2a59 59 0 0 0 18 9.1 43.4 43.4 0 0 0 3.8-6.1 38.3 38.3 0 0 1-6-2.9l1.5-1.1a42 42 0 0 0 35.8 0l1.4 1.1a38.4 38.4 0 0 1-6 2.9 43.2 43.2 0 0 0 3.8 6.1 58.8 58.8 0 0 0 18-9.1C72 31.1 68.2 17.2 60.1 5ZM23.7 38.8c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.4 3.2 6.4 7.2c0 4-2.9 7.2-6.4 7.2Z" fill="white"/></svg>
          Login with Discord
        </a>
      </div>
    `;
  }

  function showStaffGate() {
    const main = document.getElementById('page-content');
    if (!main) return;
    main.innerHTML = `
      <div class="gate-screen">
        <div class="gate-icon">⚔️</div>
        <div class="gate-title">Staff only</div>
        <div class="gate-sub">You don't have access to this panel.</div>
      </div>
    `;
  }

  return {
    getSession,
    setSession,
    clearSession,
    fetchStaffIds,
    login,
    logout,
    handleCallback,
    requireAuth,
    requireStaff,
    showLoginGate,
    showStaffGate,
  };
})();
