'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import KeepAlive from './KeepAlive';

const DiscordIcon = () => (
  <svg width="16" height="13" viewBox="0 0 71 55" fill="none">
    <path d="M60.1 4.9A58.6 58.6 0 0 0 45.7.7a40 40 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.2 0A39 39 0 0 0 26 .7 58.5 58.5 0 0 0 11.5 5C1.7 19.4-1 33.4.3 47.2a59 59 0 0 0 18 9.1 43.4 43.4 0 0 0 3.8-6.1 38.3 38.3 0 0 1-6-2.9l1.5-1.1a42 42 0 0 0 35.8 0l1.4 1.1a38.4 38.4 0 0 1-6 2.9 43.2 43.2 0 0 0 3.8 6.1 58.8 58.8 0 0 0 18-9.1C72 31.1 68.2 17.2 60.1 5ZM23.7 38.8c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.4 3.2 6.4 7.2c0 4-2.9 7.2-6.4 7.2Z" fill="white"/>
  </svg>
);

interface SidebarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const navItems = [
  { href: '/', label: 'Home', icon: '🏠', id: 'home' },
  { href: '/about', label: 'About', icon: '🌿', id: 'about' },
  { href: '/profile', label: 'Profile', icon: '👤', id: 'profile' },
  { href: '/stats', label: 'Bot Stats', icon: '📊', id: 'stats' },
];

export default function Sidebar({ theme, onToggleTheme }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user as Record<string, unknown> | undefined;
  const isStaff = user?.isStaff as boolean | undefined;

  return (
    <aside style={{
      width: 260, flexShrink: 0, height: '100vh', position: 'relative', zIndex: 10,
      background: 'var(--sidebar-bg)', backdropFilter: 'blur(24px)',
      borderRight: '1.5px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {/* Brand */}
      <div style={{ padding: '28px 20px 0' }}>
        <Link href="/" style={{
          fontFamily: 'Grandstander, cursive', fontSize: 26, fontWeight: 800,
          color: 'var(--mint2)', display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none', marginBottom: 4,
        }}>
          fern 🌿
        </Link>
        <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, lineHeight: 1.5, marginBottom: 22 }}>
          Anonymous cross-server<br />conversations
        </p>
      </div>

      {/* User card */}
      <Link href="/profile" style={{
        margin: '0 14px 20px',
        background: 'var(--mint-pale)', border: '1.5px solid var(--border-strong)',
        borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', textDecoration: 'none', transition: 'background 0.2s',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--card)', border: '2px solid var(--border-strong)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0, overflow: 'hidden',
        }}>
          {user?.image ? (
            <Image src={user.image as string} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
          ) : '👤'}
        </div>
        {user ? (
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>
              {user.name as string}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mint2)', marginTop: 1 }}>
              {isStaff ? '⚔️ Staff' : '🌱 User'}
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>Not logged in</span>
        )}
      </Link>

      {/* Nav */}
      <p style={{
        fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'var(--soft)', padding: '0 20px', marginBottom: 6,
      }}>Pages</p>
      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
        {navItems.map(item => (
          <Link key={item.id} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            color: pathname === item.href ? 'var(--mint2)' : 'var(--muted)',
            fontSize: 14, fontWeight: 700, padding: '11px 14px', borderRadius: 16,
            background: pathname === item.href ? 'var(--mint-pale)' : 'none',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 17, width: 22, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        {isStaff && (
          <Link href="/staff" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            color: pathname === '/staff' ? 'var(--mint2)' : 'var(--muted)',
            fontSize: 14, fontWeight: 700, padding: '11px 14px', borderRadius: 16,
            background: pathname === '/staff' ? 'var(--mint-pale)' : 'none',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 17, width: 22, textAlign: 'center', flexShrink: 0 }}>⚔️</span>
            Staff Panel
            <span style={{
              marginLeft: 'auto', fontSize: 10, fontWeight: 800,
              background: 'var(--mint)', color: 'white',
              borderRadius: 999, padding: '2px 8px', flexShrink: 0,
            }}>Staff</span>
          </Link>
        )}
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '4px 20px 16px' }} />

      {/* Bottom */}
      <div style={{ marginTop: 'auto', padding: '16px 14px 24px' }}>
        <KeepAlive />

        <button onClick={onToggleTheme} style={{
          width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--border)',
          borderRadius: 14, padding: '11px 14px', fontFamily: 'Nunito, sans-serif',
          fontSize: 13, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer',
          transition: 'all 0.2s', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, marginBottom: 10,
        }}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>

        {!session ? (
          <button onClick={() => signIn('discord')} style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--mint), var(--mint2))',
            border: 'none', borderRadius: 14, padding: 13,
            fontFamily: 'Grandstander, cursive', fontSize: 15, fontWeight: 800,
            color: 'white', cursor: 'pointer', transition: 'all 0.22s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(78,204,163,0.25)',
          }}>
            <DiscordIcon /> Login with Discord
          </button>
        ) : (
          <button onClick={() => signOut()} style={{
            width: '100%', background: 'var(--red-pale)',
            border: '1.5px solid var(--red-border)', borderRadius: 14, padding: 11,
            fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 700,
            color: '#c0392b', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
}
