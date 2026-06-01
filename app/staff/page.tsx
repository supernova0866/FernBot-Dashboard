'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { useToast } from '@/components/Toast';

export default function StaffPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const user = session?.user as Record<string, unknown> | undefined;
  const isStaff = user?.isStaff as boolean | undefined;
  const isAdmin = user?.isAdmin as boolean | undefined;

  const [heatUid, setHeatUid] = useState('');
  const [heatAmt, setHeatAmt] = useState('');
  const [tierUid, setTierUid] = useState('');
  const [selTier, setSelTier] = useState<number | null>(null);

  async function handleHeatAction(action: string) {
    if (!heatUid || !heatAmt) {
      showToast('Enter user ID and amount', 'error');
      return;
    }

    try {
      const res = await fetch('/api/staff/heat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: heatUid, action, amount: heatAmt }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed', 'error');
        return;
      }

      const data = await res.json();
      showToast(`${action === 'check' ? `${heatUid} has ${data.heat} heat` : `${action === 'add' ? 'Added' : 'Removed'} ${heatAmt} heat`}`, 'success');
    } catch {
      showToast('Error', 'error');
    }
  }

  async function handleTierSet() {
    if (!tierUid || selTier === null) {
      showToast('Enter user ID and select tier', 'error');
      return;
    }

    if (!isAdmin) {
      showToast('Admins only', 'error');
      return;
    }

    try {
      const res = await fetch('/api/staff/tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: tierUid, tier: selTier }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed', 'error');
        return;
      }

      showToast(`Set ${tierUid} to Tier ${selTier}`, 'success');
      setTierUid('');
      setSelTier(null);
    } catch {
      showToast('Error', 'error');
    }
  }

  if (!session) {
    return (
      <div className="page-animate" style={{ padding: '36px 40px 60px', textAlign: 'center' }}>
        <div style={{ padding: '80px 40px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔐</div>
          <div style={{ fontFamily: 'Grandstander, cursive', fontSize: 32, fontWeight: 800, marginBottom: 10, color: 'var(--text)' }}>
            Login to access staff panel
          </div>
          <button onClick={() => signIn('discord')} style={{
            background: '#5865F2', border: 'none', borderRadius: 14, padding: '13px 22px',
            fontFamily: 'Grandstander, cursive', fontSize: 15, fontWeight: 800,
            color: 'white', cursor: 'pointer', marginTop: 20,
          }}>
            Login with Discord
          </button>
        </div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="page-animate" style={{ padding: '36px 40px 60px', textAlign: 'center' }}>
        <div style={{ padding: '80px 40px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>⚔️</div>
          <div style={{ fontFamily: 'Grandstander, cursive', fontSize: 32, fontWeight: 800, marginBottom: 10, color: 'var(--text)' }}>
            Staff only
          </div>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>You don't have access to this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-animate" style={{ padding: '36px 40px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--mint2)', marginBottom: 6 }}>
          Staff only ⚔️
        </div>
        <h1 style={{ fontFamily: 'Grandstander, cursive', fontSize: 40, fontWeight: 800, lineHeight: 1.05, color: 'var(--text)' }}>
          Staff <em style={{ fontStyle: 'italic', color: 'var(--mint2)' }}>Panel</em>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8 }}>Moderation tools. Handle with care.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.09em', color: 'var(--soft)', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            Heat Management <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{
            background: 'var(--card)', border: '2px solid var(--peach2)',
            borderRadius: 22, padding: 24,
          }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input
                type="text"
                placeholder="User ID or username"
                value={heatUid}
                onChange={e => setHeatUid(e.target.value)}
                style={{
                  flex: 1, background: 'var(--input-bg)', border: '1.5px solid var(--border)',
                  borderRadius: 12, padding: '11px 16px', fontFamily: 'Nunito, sans-serif',
                  fontSize: 14, fontWeight: 600, color: 'var(--text)', transition: 'border-color 0.2s',
                }}
              />
              <input
                type="number"
                placeholder="Amt"
                value={heatAmt}
                onChange={e => setHeatAmt(e.target.value)}
                min="1"
                max="500"
                style={{
                  width: 90, background: 'var(--input-bg)', border: '1.5px solid var(--border)',
                  borderRadius: 12, padding: '11px 14px', fontFamily: 'Nunito, sans-serif',
                  fontSize: 14, fontWeight: 700, color: 'var(--text)', textAlign: 'center',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleHeatAction('add')} style={{
                flex: 1, background: 'var(--peach)', color: '#e05a2b',
                border: '1.5px solid var(--peach2)', borderRadius: 12, padding: 12,
                fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                + Add Heat
              </button>
              <button onClick={() => handleHeatAction('remove')} style={{
                flex: 1, background: 'var(--mint-pale)', color: 'var(--mint2)',
                border: '1.5px solid var(--border-strong)', borderRadius: 12, padding: 12,
                fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                - Remove
              </button>
              <button onClick={() => handleHeatAction('check')} style={{
                flex: 1, background: 'var(--sky)', color: '#2563eb',
                border: '1.5px solid rgba(120,180,255,0.4)', borderRadius: 12, padding: 12,
                fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                Check
              </button>
            </div>
          </div>

          {isAdmin && (
            <>
              <div style={{
                fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.09em', color: 'var(--soft)', marginBottom: 14,
                marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Tier Management <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{
                background: 'var(--card)', border: '2px solid rgba(253,230,138,0.5)',
                borderRadius: 22, padding: 24,
              }}>
                <input
                  type="text"
                  placeholder="User ID or username"
                  value={tierUid}
                  onChange={e => setTierUid(e.target.value)}
                  style={{
                    width: '100%', background: 'var(--input-bg)',
                    border: '1.5px solid var(--border)', borderRadius: 12,
                    padding: '11px 16px', fontFamily: 'Nunito, sans-serif',
                    fontSize: 14, fontWeight: 600, color: 'var(--text)',
                    marginBottom: 12, transition: 'border-color 0.2s',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
                  {[0, 1, 2, 3].map(t => (
                    <button
                      key={t}
                      onClick={() => setSelTier(t)}
                      style={{
                        background: selTier === t ? 'var(--yellow)' : 'var(--input-bg)',
                        border: selTier === t ? '1.5px solid rgba(253,230,138,0.7)' : '1.5px solid var(--border)',
                        borderRadius: 12, padding: 12,
                        fontFamily: 'Grandstander, cursive', fontSize: 18, fontWeight: 800,
                        color: selTier === t ? '#92400e' : 'var(--text)',
                        cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button onClick={handleTierSet} style={{
                  width: '100%', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  border: 'none', borderRadius: 12, padding: 13,
                  fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 800,
                  color: 'white', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 3px 10px rgba(245,158,11,0.2)',
                }}>
                  Set Tier
                </button>
              </div>
            </>
          )}
        </div>

        <div>
          <div style={{
            fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.09em', color: 'var(--soft)', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            Recent Actions <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{
            background: 'var(--card)', border: '2px solid var(--border)',
            borderRadius: 22, padding: '16px 20px',
          }}>
            {[
              { icon: '🌡️', text: 'Added 20 heat to user#1234', sub: 'by Nova', time: '2m ago' },
              { icon: '🏅', text: 'Set user#5678 to Tier 2', sub: 'by Nova', time: '14m ago' },
              { icon: '❄️', text: 'Removed 10 heat from user#9012', sub: 'by Nova', time: '1h ago' },
            ].map((log, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0, background: 'var(--mint-pale)',
                }}>
                  {log.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                    {log.text}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginTop: 1 }}>
                    {log.sub}
                  </div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--soft)', fontWeight: 600, flexShrink: 0 }}>
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
