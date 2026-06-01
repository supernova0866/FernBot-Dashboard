'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useToast } from '@/components/Toast';

const TOTAL = 15 * 60 * 1000;

const DiscordIcon = () => (
  <svg width="16" height="13" viewBox="0 0 71 55" fill="none">
    <path d="M60.1 4.9A58.6 58.6 0 0 0 45.7.7a40 40 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.2 0A39 39 0 0 0 26 .7 58.5 58.5 0 0 0 11.5 5C1.7 19.4-1 33.4.3 47.2a59 59 0 0 0 18 9.1 43.4 43.4 0 0 0 3.8-6.1 38.3 38.3 0 0 1-6-2.9l1.5-1.1a42 42 0 0 0 35.8 0l1.4 1.1a38.4 38.4 0 0 1-6 2.9 43.2 43.2 0 0 0 3.8 6.1 58.8 58.8 0 0 0 18-9.1C72 31.1 68.2 17.2 60.1 5ZM23.7 38.8c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.4 3.2 6.4 7.2c0 4-2.9 7.2-6.4 7.2Z" fill="white"/>
  </svg>
);

interface Stats {
  totalUsers: number;
  activeCalls: number;
  registeredServers: number;
}

export default function HomePage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [bumps, setBumps] = useState(0);
  const [lastBump, setLastBump] = useState<string>('never');
  const [deadline, setDeadline] = useState(Date.now() + TOTAL);
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [wakeLabel, setWakeLabel] = useState('🌿 Wake up Fern');

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const bumpBot = useCallback(async () => {
    setDeadline(Date.now() + TOTAL);
    setBumps(b => b + 1);
    setLastBump('just now');
    setWakeLabel('✅ Awake!');
    setTimeout(() => setWakeLabel('🌿 Wake up Fern'), 2200);
    try {
      await fetch('/api/ping', { method: 'POST' });
      showToast('Fern is awake!', 'success');
    } catch {
      showToast('Ping failed', 'error');
    }
  }, [showToast]);

  const m = Math.floor(timeLeft / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const pct = (timeLeft / TOTAL) * 100;
  const isWarn = timeLeft < 3 * 60000;
  const isDead = timeLeft === 0;
  const cdColor = isDead ? '#ef4444' : isWarn ? '#f59e0b' : 'var(--text)';

  return (
    <div className="page-animate" style={{ padding: '36px 40px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--mint2)', marginBottom: 6 }}>Dashboard</div>
        <h1 style={{ fontFamily: 'Grandstander, cursive', fontSize: 40, fontWeight: 800, lineHeight: 1.05, color: 'var(--text)' }}>
          Welcome back <em style={{ fontStyle: 'italic', color: 'var(--mint2)' }}>🌿</em>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.65 }}>
          Here is a quick look at what Fern is up to.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { bg: 'var(--mint-pale)', borderColor: 'var(--border-strong)', numColor: 'var(--mint2)', n: stats?.registeredServers ?? '...', l: 'Servers' },
              { bg: 'var(--sky)', borderColor: 'rgba(120,180,255,0.3)', numColor: '#2563eb', n: stats?.activeCalls ?? '...', l: 'Active Calls' },
              { bg: 'var(--lav)', borderColor: 'rgba(180,160,255,0.3)', numColor: '#7c3aed', n: stats?.totalUsers ?? '...', l: 'Users' },
            ].map((s, i) => (
              <div key={i} style={{
                borderRadius: 22, padding: '22px 18px', textAlign: 'center',
                background: s.bg, border: `2px solid ${s.borderColor}`,
                transition: 'all 0.25s',
              }}>
                <span style={{ fontFamily: 'Grandstander, cursive', fontSize: 40, fontWeight: 800, display: 'block', lineHeight: 1, marginBottom: 4, color: s.numColor }}>
                  {String(s.n)}
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--soft)' }}>
                  {s.l}
                </span>
              </div>
            ))}
          </div>

          {/* Login CTA */}
          {!session && (
            <div style={{
              background: 'linear-gradient(135deg, var(--mint-pale), var(--card))',
              border: '2px solid var(--border-strong)', borderRadius: 22, padding: 28, textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
              <div style={{ fontFamily: 'Grandstander, cursive', fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 7 }}>
                See your profile
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 18 }}>
                Log in with Discord to view your heat, tier, reputation, and badges.
              </div>
              <button onClick={() => signIn('discord')} style={{
                background: '#5865F2', border: 'none', borderRadius: 14, padding: '13px 22px',
                fontFamily: 'Grandstander, cursive', fontSize: 15, fontWeight: 800, color: 'white',
                cursor: 'pointer', transition: 'all 0.22s', display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(88,101,242,0.25)',
              }}>
                <DiscordIcon /> Login with Discord
              </button>
            </div>
          )}
        </div>

        {/* Keep Alive card */}
        <div style={{
          background: 'var(--card)', border: '2px solid var(--border-strong)',
          borderRadius: 22, overflow: 'hidden', boxShadow: '0 8px 32px rgba(78,204,163,0.08)',
        }}>
          <div style={{
            background: 'var(--mint-pale)', padding: '14px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mint2)' }}>
              Keep Fern alive
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 800, color: 'var(--mint2)' }}>
              <span style={{
                width: 7, height: 7, background: 'var(--mint)', borderRadius: '50%',
                animation: 'boop 1.8s infinite', boxShadow: '0 0 6px rgba(78,204,163,0.6)', display: 'inline-block',
              }} /> Online
            </span>
          </div>
          <div style={{ padding: '28px 20px 10px', textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Grandstander, cursive', fontSize: 88, fontWeight: 800,
              lineHeight: 1, color: cdColor, letterSpacing: '-0.04em', transition: 'color 0.4s',
            }}>
              {str}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
              minutes until sleep
            </div>
          </div>
          <div style={{ height: 5, background: 'rgba(78,204,163,0.12)', margin: '0 20px 18px' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--mint), var(--mint2))',
              borderRadius: 999, transition: 'width 1s linear',
            }} />
          </div>
          <button onClick={bumpBot} style={{
            display: 'block', width: 'calc(100% - 40px)', margin: '0 20px 20px',
            background: 'linear-gradient(135deg, var(--mint), var(--mint2))',
            border: 'none', borderRadius: 16, padding: 17,
            fontFamily: 'Grandstander, cursive', fontSize: 20, fontWeight: 800,
            color: 'white', cursor: 'pointer', transition: 'all 0.22s',
            boxShadow: '0 4px 16px rgba(78,204,163,0.28)',
          }}>
            {wakeLabel}
          </button>
          <div style={{
            background: 'var(--mint-pale)', padding: '12px 20px',
            fontSize: 12, color: 'var(--soft)', fontWeight: 700,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Woken <b style={{ color: 'var(--mint2)' }}>{bumps}</b>x today</span>
            <span>last: <b style={{ color: 'var(--mint2)' }}>{lastBump}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}
