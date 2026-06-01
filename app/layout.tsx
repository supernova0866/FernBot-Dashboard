'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Toast from '@/components/Toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('fern-theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fern-theme', next);
  }

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <title>Fern Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Grandstander:ital,wght@0,400;0,600;0,800;1,400;1,800&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <SessionProvider>
          {/* Background blobs */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
            background: 'var(--bg)', transition: 'background 0.3s'
          }} />
          <div style={{
            position: 'fixed', width: 500, height: 400,
            background: 'var(--blob1)', top: -100, right: 80,
            borderRadius: '50%', filter: 'blur(90px)', zIndex: 0,
            animation: 'drift 16s ease-in-out infinite alternate', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'fixed', width: 350, height: 350,
            background: 'var(--blob2)', bottom: -60, left: 280,
            borderRadius: '50%', filter: 'blur(90px)', zIndex: 0,
            animation: 'drift 20s ease-in-out infinite alternate-reverse', pointerEvents: 'none'
          }} />

          <Sidebar theme={theme} onToggleTheme={toggleTheme} />
          <div style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
            <Topbar />
            <main>{children}</main>
          </div>
          <Toast />
        </SessionProvider>
      </body>
    </html>
  );
}
