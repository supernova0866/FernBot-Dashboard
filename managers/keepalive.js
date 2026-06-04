// managers/keepalive.js — countdown timer + ping

const KeepAlive = (() => {
  const TOTAL = 15 * 60 * 1000;
  let deadline = Date.now() + TOTAL;
  let interval = null;

  function formatTime(ms) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function tick() {
    const timeLeft = Math.max(0, deadline - Date.now());
    const pct = (timeLeft / TOTAL) * 100;

    const timerEl = document.getElementById('ka-timer');
    const barEl = document.getElementById('ka-bar');

    if (timerEl) {
      timerEl.textContent = formatTime(timeLeft);
      const isDead = timeLeft === 0;
      const isWarn = timeLeft < 3 * 60000;
      timerEl.style.color = isDead ? '#ef4444' : isWarn ? '#f59e0b' : 'var(--text)';
    }

    if (barEl) barEl.style.width = `${pct}%`;
  }

  function start() {
    if (interval) clearInterval(interval);
    interval = setInterval(tick, 1000);
    tick();
  }

  async function ping() {
    deadline = Date.now() + TOTAL;
    tick();

    // Update topbar wake button temporarily
    const wakeBtn = document.getElementById('topbar-wake');
    if (wakeBtn) {
      wakeBtn.textContent = '✅ Awake!';
      setTimeout(() => { wakeBtn.textContent = '🌿 Wake up Fern'; }, 2200);
    }

    try {
      await API.ping();
      Toast.success('Fern is awake!');
    } catch {
      Toast.error('Ping failed');
    }
  }

  // Auto-ping every 14 minutes to keep bot alive
  function startAutoPing() {
    setInterval(async () => {
      try { await API.ping(); } catch {}
    }, 14 * 60 * 1000);
  }

  return { start, ping, startAutoPing };
})();

// Start timer once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  KeepAlive.start();
  KeepAlive.startAutoPing();
});
