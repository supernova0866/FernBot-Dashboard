'use client';

export default function AboutPage() {
  return (
    <div className="page-animate" style={{ padding: '36px 40px 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--mint2)', marginBottom: 6 }}>
          What is Fern?
        </div>
        <h1 style={{ fontFamily: 'Grandstander, cursive', fontSize: 40, fontWeight: 800, lineHeight: 1.05, color: 'var(--text)' }}>
          About <em style={{ fontStyle: 'italic', color: 'var(--mint2)' }}>Fern</em>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 48 }}>
        <div>
          <h2 style={{ fontFamily: 'Grandstander, cursive', fontSize: 52, fontWeight: 800, lineHeight: 1.05, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Talk to <em style={{ fontStyle: 'italic', color: 'var(--mint2)' }}>any</em><br />server
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28 }}>
            FernBot connects Discord servers for anonymous real-time text conversations. Like Omegle, but for Discord communities. Your server stays hidden — your display name comes through. Just type f.call and you are in.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{
              background: 'linear-gradient(135deg, var(--mint), var(--mint2))',
              border: 'none', borderRadius: 18, padding: '14px 26px',
              fontFamily: 'Grandstander, cursive', fontSize: 16, fontWeight: 800,
              color: 'white', cursor: 'pointer', transition: 'all 0.22s',
              boxShadow: '0 4px 18px rgba(78,204,163,0.3)',
            }}>
              Add Fern to Discord
            </button>
            <button style={{
              background: 'var(--card)', border: '2px solid var(--border-strong)',
              borderRadius: 18, padding: '14px 26px', fontFamily: 'Grandstander, cursive',
              fontSize: 16, fontWeight: 800, color: 'var(--text)',
              cursor: 'pointer', transition: 'all 0.22s',
            }}>
              Support Server
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: '🔒', title: 'Server Anonymous', desc: 'Your server is never revealed. Messages relay via webhooks using your display name or nickname.' },
            { icon: '🌐', title: 'Cross-server', desc: 'Bridges any two Discord channels in real time, no matter where they are from.' },
            { icon: '🌱', title: 'Community Made', desc: 'No ads, no paywalls. Built and kept alive by the community.' },
          ].map((c, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '2px solid var(--border)',
              borderRadius: 20, padding: 20, display: 'flex', gap: 14,
              alignItems: 'flex-start', transition: 'all 0.25s',
            }}>
              <div style={{
                fontSize: 22, flexShrink: 0, width: 44, height: 44,
                background: 'var(--mint-pale)', borderRadius: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, color: 'var(--text)' }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--soft)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          Features <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { icon: '📞', name: 'Cross-server Calls', desc: 'Connect with a random server instantly. Skip with f.skip if the vibe is off.' },
            { icon: '🔁', name: 'Reconnect System', desc: 'Loved your last chat? Send a reconnect within 5 minutes to pick back up.' },
            { icon: '👥', name: 'Friend Requests', desc: 'Click with someone? Send f.friend mid-call to stay connected.' },
            { icon: '🌡️', name: 'Heat System', desc: 'Mods add heat to bad actors. Over 100 blocks calls. Decays 1pt per 30 min.' },
            { icon: '⭐', name: 'Reputation & Tiers', desc: 'Good behaviour earns rep. Tiers unlock richer content in calls.' },
            { icon: '🚩', name: 'Report System', desc: 'Reply with f.report. Logs hit mod channels instantly with full context.' },
          ].map((f, i) => (
            <div key={i} style={{
              background: i % 2 === 1 ? (i % 4 === 1 ? 'var(--yellow)' : 'var(--peach)') : i % 6 === 5 ? 'var(--lav)' : 'var(--card)',
              border: '2px solid var(--border)', borderRadius: 22, padding: 22,
              transition: 'all 0.25s',
            }}>
              <div style={{
                fontSize: 26, width: 50, height: 50,
                background: 'var(--mint-pale)', borderRadius: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>{f.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--soft)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          Tiers <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { num: '0', name: 'Seedling', perks: ['Text messages'] },
            { num: '1', name: 'Sprout', perks: ['Text messages', 'Stickers'] },
            { num: '2', name: 'Fern', perks: ['Text messages', 'Stickers', 'GIFs'] },
            { num: '3', name: 'Forest', perks: ['Text messages', 'Stickers', 'GIFs', 'Attachments'] },
          ].map((t, i) => (
            <div key={i} style={{
              border: '2px solid var(--border)', borderRadius: 22, padding: 22,
              background: 'var(--card)', transition: 'all 0.25s',
            }}>
              <div style={{
                fontFamily: 'Grandstander, cursive', fontSize: 40, fontWeight: 800,
                lineHeight: 1, marginBottom: 6,
                color: i === 0 ? '#94a3b8' : i === 1 ? '#22c55e' : i === 2 ? '#f59e0b' : 'var(--mint2)',
              }}>
                {t.num}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--soft)', marginBottom: 12,
              }}>
                {t.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {t.perks.map((p, pi) => (
                  <div key={pi} style={{
                    fontSize: 12.5, color: 'var(--muted)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ color: 'var(--mint2)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
