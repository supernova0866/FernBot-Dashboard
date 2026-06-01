'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from '@/lib/db';

const tierNames = ['Seedling', 'Sprout', 'Fern', 'Forest'];
const tierPerks = ['Text only', 'Text · Stickers', 'Text · Stickers · GIFs', 'Text · Stickers · GIFs · Attachments'];

const DiscordIcon = () => (
  <svg width="16" height="13" viewBox="0 0 71 55" fill="none">
    <path d="M60.1 4.9A58.6 58.6 0 0 0 45.7.7a40 40 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.2 0A39 39 0 0 0 26 .7 58.5 58.5 0 0 0 11.5 5C1.7 19.4-1 33.4.3 47.2a59 59 0 0 0 18 9.1 43.4 43.4 0 0 0 3.8-6.1 38.3 38.3 0 0 1-6-2.9l1.5-1.1a42 42 0 0 0 35.8 0l1.4 1.1a38.4 38.4 0 0 1-6 2.9 43.2 43.2 0 0 0 3.8 6.1 58.8 58.8 0 0 0 18-9.1C72 31.1 68.2 17.2 60.1 5ZM23.7 38.8c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.4 3.2 6.4 7.2c0 4-2.9 7.2-6.4 7.2Z" fill="white"/>
  </svg>
);

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    fetch('/api/user').then(r => r.json()).then(u => {
      setUser(u);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [session]);

  if (!session) {
    return (
      <div className="page-animate" style={{
        padding: '36px 40px 60px', textAlign: 'center', display: 'grid',
        gridColumn: '1/-1',
      }}>
        <div style={{ padding: '80px 40px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🌿</div>
          <div style={{
            fontFamily: 'Grandstander, cursive', fontSize: 32, fontWeight: 800,
            marginBottom: 10, color: 'var(--text)',
          }}>
            Login to view your profile
          </div>
          <div style={{
            fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28,
            maxWidth: 400, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Connect your Discord account to see your heat, tier, reputation, and badges.
          </div>
          <button onClick={() => signIn('discord')} style={{
            background: '#5865F2', border: 'none', borderRadius: 14, padding: '13px 22px',
            fontFamily: 'Grandstander, cursive', fontSize: 15, fontWeight: 800,
            color: 'white', cursor: 'pointer', transition: 'all 0.22s',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(88,101,242,0.25)',
          }}>
            <DiscordIcon /> Login with Discord
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="page-animate" style={{ padding: '36px 40px 60px' }}>Loading...</div>;
  }

  if (!user) {
    return <div className="page-animate" style={{ padding: '36px 40px 60px' }}>User not found</div>;
  }

  return (
    <div className="page-animate" style={{ padding: '36px 40px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--mint2)', marginBottom: 6 }}>
          Your account
        </div>
        <h1 style={{ fontFamily: 'Grandstander, cursive', fontSize: 40, fontWeight: 800, lineHeight: 1.05, color: 'var(--text)' }}>
          <em style={{ fontStyle: 'italic', color: 'var(--mint2)' }}>Profile</em>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Main card */}
          <div style={{
            background: 'var(--card)', border: '2px solid var(--border-strong)',
            borderRadius: 22, padding: 28, textAlign: 'center',
          }}>
            <div style={{
              width: 76, height: 76, borderRadius: '50%',
              background: 'var(--mint-pale)', border: '3px solid var(--border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, margin: '0 auto 14px', overflow: 'hidden',
            }}>
              {session.user?.image ? (
                <Image src={session.user.image} alt="avatar" width={76} height={76} style={{ borderRadius: '50%' }} />
              ) : '🌿'}
            </div>
            <div style={{
              fontFamily: 'Grandstander, cursive', fontSize: 22, fontWeight: 800,
              color: 'var(--text)', marginBottom: 3,
            }}>
              {user.username}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 16 }}>
              Fern User
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--yellow)', border: '2px solid rgba(253,230,138,0.5)',
              borderRadius: 14, padding: '10px 16px',
            }}>
              <div style={{
                fontFamily: 'Grandstander, cursive', fontSize: 28, fontWeight: 800,
                color: '#92400e', lineHeight: 1,
              }}>
                {user.tier}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', textAlign: 'left' }}>
                  Tier {user.tier} — {tierNames[user.tier]}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1, textAlign: 'left' }}>
                  {tierPerks[user.tier]}
                </div>
              </div>
            </div>
          </div>

          {/* Stats pills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { bg: 'var(--peach)', borderColor: 'var(--peach2)', numColor: '#e05a2b', n: user.heat, l: 'Heat' },
              { bg: 'var(--mint-pale)', borderColor: 'var(--border-strong)', numColor: 'var(--mint2)', n: user.reputation >= 0 ? '+' + user.reputation : user.reputation, l: 'Reputation' },
              { bg: 'var(--sky)', borderColor: 'rgba(120,180,255,0.3)', numColor: '#2563eb', n: user.msgsent, l: 'Messages' },
              { bg: 'var(--yellow)', borderColor: 'rgba(253,230,138,0.5)', numColor: '#92400e', n: user.tier, l: 'Tier' },
            ].map((p, i) => (
              <div key={i} style={{
                borderRadius: 18, padding: '16px 12px', textAlign: 'center',
                background: p.bg, border: `2px solid ${p.borderColor}`,
              }}>
                <span style={{
                  fontFamily: 'Grandstander, cursive', fontSize: 34, fontWeight: 800,
                  display: 'block', lineHeight: 1, marginBottom: 3, color: p.numColor,
                }}>
                  {p.n}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.07em', color: 'var(--soft)',
                }}>
                  {p.l}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Heat card */}
          <div style={{
            background: 'var(--card)', border: '2px solid var(--border)',
            borderRadius: 22, padding: 24, transition: 'border-color 0.25s',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.09em', color: 'var(--soft)', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              Heat Level <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8,
            }}>
              <span>Current heat</span>
              <span>{user.heat} / 100</span>
            </div>
            <div style={{
              height: 12, background: 'var(--peach)', borderRadius: 999,
              overflow: 'hidden', border: '1.5px solid var(--peach2)',
            }}>
              <div style={{
                height: '100%', width: `${Math.min(user.heat, 100)}%`,
                borderRadius: 999, transition: 'width 1s',
                background: 'linear-gradient(90deg, #fbbf24, #ef4444)',
              }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, fontWeight: 600 }}>
              Heat above 100 blocks you from calls. Decays 1 point every 30 minutes automatically.
            </div>
          </div>

          {/* Badges card */}
          <div style={{
            background: 'var(--card)', border: '2px solid var(--border)',
            borderRadius: 22, padding: 24, transition: 'border-color 0.25s',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.09em', color: 'var(--soft)', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              Badges <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {user.badges.length > 0 ? user.badges.map((b, i) => (
                <div key={i} style={{
                  background: 'var(--mint-pale)', border: '1.5px solid var(--border-strong)',
                  borderRadius: 999, padding: '6px 14px', fontSize: 12,
                  fontWeight: 700, color: 'var(--mint2)', transition: 'background 0.2s',
                }}>
                  {b}
                </div>
              )) : (
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>No badges yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
