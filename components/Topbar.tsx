'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from './Toast';

const pageTitles: Record<string, { pre: string; em: string }> = {
  '/': { pre: 'Home', em: 'Dashboard' },
  '/about': { pre: 'About', em: 'Fern' },
  '/profile': { pre: 'Your', em: 'Profile' },
  '/stats': { pre: 'Bot', em: 'Stats' },
  '/staff': { pre: 'Staff', em: 'Panel' },
};

export default function Topbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const title = pageTitles[pathname] || { pre: 'Fern', em: 'Dashboard' };
  const { showToast } = useToast();

  async function bumpBot() {
    try {
      const res = await fetch('/api/ping', { method: 'POST' });
      if (res.ok) {
        showToast('Fern is awake!', 'success');
      } else {
        showToast('Ping failed', 'error');
      }
    } catch {
      showToast('Ping failed', 'error');
    }
  }

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--topbar-bg)', backdropFilter: 'blur(20px)',
      borderBottom: '1.5px solid var(--border)',
      padding: '0 40px', height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      <div style={{ fontFamily: 'Grandstander, cursive', fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
        {title.pre} <em style={{ fontStyle: 'italic', color: 'var(--mint2)' }}>{title.em}</em>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={bumpBot} style={{
          background: 'linear-gradient(135deg, var(--mint), var(--mint2))',
          border: 'none', borderRadius: 12, padding: '9px 18px',
          fontFamily: 'Grandstander, cursive', fontSize: 14, fontWeight: 800,
          color: 'white', cursor: 'pointer', transition: 'all 0.22s',
          boxShadow: '0 3px 12px rgba(78,204,163,0.2)',
        }}>
          🌿 Wake up Fern
        </button>
        <Link href="/profile" style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--mint-pale)', border: '2px solid var(--border-strong)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, cursor: 'pointer', transition: 'border-color 0.2s',
          textDecoration: 'none', overflow: 'hidden',
        }}>
          {user?.image ? (
            <Image src={user.image as string} alt="avatar" width={36} height={36} style={{ borderRadius: '50%' }} />
          ) : '👤'}
        </Link>
      </div>
    </div>
  );
}
