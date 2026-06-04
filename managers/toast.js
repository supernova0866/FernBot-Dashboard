// managers/toast.js — toast notifications

const Toast = (() => {
  let timer = null;

  function show(msg, type = 'info') {
    const el = document.getElementById('toast');
    if (!el) return;

    el.textContent = msg;
    el.className = `show ${type}`;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      el.className = el.className.replace('show', '').trim();
    }, 3000);
  }

  return {
    success: (msg) => show(msg, 'success'),
    error:   (msg) => show(msg, 'error'),
    info:    (msg) => show(msg, 'info'),
  };
})();
