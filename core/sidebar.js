// core/sidebar.js — injects sidebar + topbar into every page

const DISCORD_ICON = `<svg width="16" height="13" viewBox="0 0 71 55" fill="none"><path d="M60.1 4.9A58.6 58.6 0 0 0 45.7.7a40 40 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.2 0A39 39 0 0 0 26 .7 58.5 58.5 0 0 0 11.5 5C1.7 19.4-1 33.4.3 47.2a59 59 0 0 0 18 9.1 43.4 43.4 0 0 0 3.8-6.1 38.3 38.3 0 0 1-6-2.9l1.5-1.1a42 42 0 0 0 35.8 0l1.4 1.1a38.4 38.4 0 0 1-6 2.9 43.2 43.2 0 0 0 3.8 6.1 58.8 58.8 0 0 0 18-9.1C72 31.1 68.2 17.2 60.1 5ZM23.7 38.8c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.4 3.2 6.4 7.2c0 4-2.9 7.2-6.4 7.2Z" fill="white"/></svg>`;

const NAV_ITEMS = [
  { href: '/pages/home.html', label: 'Home',      icon: '🏠' },
  { href: '/pages/about.html', label: 'About',     icon: '🌿' },
  { href: '/pages/profile.html', label: 'Profile',   icon: '👤' },
  { href: '/pages/stats.html', label: 'Bot Stats',  icon: '📊' },
];

const PAGE_TITLES = {
  'home.html':    { pre: 'Home',   em: 'Dashboard' },
  'about.html':   { pre: 'About',  em: 'Fern' },
  'profile.html': { pre: 'Your',   em: 'Profile' },
  'stats.html':   { pre: 'Bot',    em: 'Stats' },
  'staff.html':   { pre: 'Staff',  em: 'Panel' },
};

function getCurrentPage() {
  const parts = window.location.pathname.split('/');
  return parts[parts.length - 1] || 'home.html';
}

function buildNavLinks(isStaff) {
  const current = getCurrentPage();
  let links = NAV_ITEMS.map(item => {
    const pageName = item.href.split('/').pop();
    const isActive = current === pageName;
    return `<a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}">
      <span class="icon">${item.icon}</span>${item.label}
    </a>`;
  }).join('');

  if (isStaff) {
    const isActive = current === 'staff.html';
    links += `<a href="/pages/staff.html" class="nav-link ${isActive ? 'active' : ''}">
      <span class="icon">⚔️</span>Staff Panel
      <span class="nav-badge">Staff</span>
    </a>`;
  }

  return links;
}

function buildUserCard(session) {
  if (!session) {
    return `<a href="/pages/profile.html" class="sidebar-user">
      <div class="sidebar-avatar">👤</div>
      <span style="font-size:13px;font-weight:600;color:var(--muted)">Not logged in</span>
    </a>`;
  }
  const avatarHtml = session.avatar
    ? `<img src="https://cdn.discordapp.com/avatars/${session.discordId}/${session.avatar}.png?size=80" alt="avatar">`
    : '👤';
  const role = session.isAdmin ? '👑 Admin' : session.isMod ? '⚔️ Moderator' : '🌱 User';
  return `<a href="/pages/profile.html" class="sidebar-user">
    <div class="sidebar-avatar">${avatarHtml}</div>
    <div>
      <div class="sidebar-username">${session.username}</div>
      <div class="sidebar-role">${role}</div>
    </div>
  </a>`;
}

function buildAuthButton(session) {
  if (!session) {
    return `<a href="/api/auth/login" class="btn-login">${DISCORD_ICON} Login with Discord</a>`;
  }
  return `<button class="btn-logout" onclick="Auth.logout()">Sign out</button>`;
}

function buildTopbarAvatar(session) {
  if (!session) return `<a href="/pages/profile.html" class="topbar-avatar">👤</a>`;
  const avatarHtml = session.avatar
    ? `<img src="https://cdn.discordapp.com/avatars/${session.discordId}/${session.avatar}.png?size=80" alt="avatar">`
    : '👤';
  return `<a href="/pages/profile.html" class="topbar-avatar">${avatarHtml}</a>`;
}

function injectBlobs() {
  const blobs = document.createElement('div');
  blobs.innerHTML = `
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
  `;
  document.body.prepend(...blobs.children);
}

function injectToast() {
  const toast = document.createElement('div');
  toast.id = 'toast';
  document.body.appendChild(toast);
}

function injectSidebar(session) {
  const isStaff = session?.isStaff;
  const mount = document.getElementById('sidebar-mount');
  if (!mount) return;

  mount.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <a href="/pages/home.html">fern 🌿</a>
        <p>Anonymous cross-server<br>conversations</p>
      </div>

      ${buildUserCard(session)}

      <p class="sidebar-section-label">Pages</p>
      <nav class="nav-links">
        ${buildNavLinks(isStaff)}
      </nav>

      <div class="sidebar-divider"></div>

      <div class="sidebar-bottom">
        <div class="keepalive-widget" id="keepalive-widget">
          <div class="keepalive-header">
            <span class="keepalive-label">Keep Alive</span>
            <span class="keepalive-status"><span class="pulse-dot"></span> Online</span>
          </div>
          <div class="keepalive-timer" id="ka-timer">15:00</div>
          <div class="keepalive-sublabel">until sleep</div>
          <div class="keepalive-bar-track">
            <div class="keepalive-bar-fill" id="ka-bar" style="width:100%"></div>
          </div>
        </div>

        <button class="btn-theme" id="theme-toggle">🌙 Dark Mode</button>
        ${buildAuthButton(session)}
      </div>
    </aside>
  `;
}

function injectTopbar(session) {
  const page = getCurrentPage();
  const title = PAGE_TITLES[page] || { pre: 'Fern', em: 'Dashboard' };
  const wrap = document.getElementById('main-wrap');
  if (!wrap) return;

  const topbar = document.createElement('div');
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <div class="topbar-title">${title.pre} <em>${title.em}</em></div>
    <div class="topbar-right">
      <button class="btn-wake" id="topbar-wake">🌿 Wake up Fern</button>
      ${buildTopbarAvatar(session)}
    </div>
  `;
  wrap.prepend(topbar);
}

function initTheme() {
  const saved = localStorage.getItem('fern-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);

  document.addEventListener('click', e => {
    if (e.target.closest('#theme-toggle')) {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('fern-theme', next);
      updateThemeBtn(next);
    }
  });
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  const session = Auth.getSession();

  injectBlobs();
  injectToast();
  injectSidebar(session);
  injectTopbar(session);
  initTheme();

  // Topbar wake button
  document.addEventListener('click', async e => {
    if (e.target.closest('#topbar-wake')) {
      await KeepAlive.ping();
    }
  });
});
