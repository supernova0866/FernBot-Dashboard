'use client';

import { useEffect, useState, useCallback } from 'react';

const TOTAL = 15 * 60 * 1000;

export default function KeepAlive() {
  const [deadline, setDeadline] = useState(Date.now() + TOTAL);
  const [timeLeft, setTimeLeft] = useState(TOTAL);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const bump = useCallback(async () => {
    setDeadline(Date.now() + TOTAL);
    try { await fetch('/api/ping', { method: 'POST' }); } catch {}
  }, []);

  const m = Math.floor(timeLeft / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const pct = (timeLeft / TOTAL) * 100;
  const isWarn = timeLeft < 3 * 60000;
  const isDead = timeLeft === 0;
  const cdColor = isDead ? '#ef4444' : isWarn ? '#f59e0b' : 'var(--text)';

  return (
    <div style={{
      background: 'var(--mint-pale)', border: '1.5px solid var(--border-strong)',
      borderRadius: 16, padding: '12px 14px', marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mint2)' }}>
          Keep Alive
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--mint2)' }}>
          <span style={{
            width: 6, height: 6, background: 'var(--mint)', borderRadius: '50%',
            animation: 'boop 1.8s ease-in-out infinite',
            boxShadow: '0 0 5px rgba(78,204,163,0.5)',
            display: 'inline-block',
          }} />
          Online
        </span>
      </div>
      <div style={{
        fontFamily: 'Grandstander, cursive', fontSize: 28, fontWeight: 800,
        color: cdColor, lineHeight: 1, transition: 'color 0.4s',
      }}>
        {str}
      </div>
      <div style={{ fontSize: 10, color: 'var(--soft)', fontWeight: 700, marginTop: 2 }}>until sleep</div>
      <div style={{
        height: 4, background: 'rgba(78,204,163,0.15)',
        borderRadius: 999, overflow: 'hidden', marginTop: 8,
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--mint), var(--mint2))',
          borderRadius: 999, transition: 'width 1s linear',
        }} />
      </div>
    </div>
  );
}
