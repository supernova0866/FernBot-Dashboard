'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalUsers: number;
  activeCalls: number;
  registeredServers: number;
  totalMessages: number;
  totalCalls: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <div className="page-animate" style={{ padding: '36px 40px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--mint2)', marginBottom: 6 }}>
          Public
        </div>
        <h1 style={{ fontFamily: 'Grandstander, cursive', fontSize: 40, fontWeight: 800, lineHeight: 1.05, color: 'var(--text)' }}>
          Bot <em style={{ fontStyle: 'italic', color: 'var(--mint2)' }}>Stats</em>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.65 }}>
          Live snapshot — no login needed.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { bg: 'var(--mint-pale)', borderColor: 'var(--border-strong)', numColor: 'var(--mint2)', n: stats?.registeredServers ?? '...', l: 'Servers' },
          { bg: 'var(--sky)', borderColor: 'rgba(120,180,255,0.3)', numColor: '#2563eb', n: stats?.activeCalls ?? '...', l: 'Active Calls' },
          { bg: 'var(--lav)', borderColor: 'rgba(180,160,255,0.3)', numColor: '#7c3aed', n: stats?.totalUsers ?? '...', l: 'Total Users' },
          { bg: 'var(--yellow)', borderColor: 'rgba(253,230,138,0.5)', numColor: '#92400e', n: stats?.totalMessages ?? '...', l: 'Msgs Relayed' },
        ].map((s, i) => (
          <div key={i} style={{
            borderRadius: 22, padding: '24px 18px', textAlign: 'center',
            background: s.bg, border: `2px solid ${s.borderColor}`,
            transition: 'all 0.25s',
          }}>
            <span style={{
              fontFamily: 'Grandstander, cursive', fontSize: 44, fontWeight: 800,
              display: 'block', lineHeight: 1, marginBottom: 5, color: s.numColor,
            }}>
              {String(s.n)}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.07em', color: 'var(--soft)',
            }}>
              {s.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
