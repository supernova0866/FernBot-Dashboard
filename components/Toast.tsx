'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastContextType {
  showToast: (msg: string, type?: 'success' | 'error' | '') => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: string; visible: boolean }>({
    msg: '', type: '', visible: false,
  });

  const showToast = useCallback((msg: string, type: 'success' | 'error' | '' = '') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 999,
        background: toast.type === 'success' ? 'var(--mint2)' : toast.type === 'error' ? '#e05a2b' : 'var(--text)',
        color: toast.type ? 'white' : 'var(--bg)',
        borderRadius: 16, padding: '13px 22px', fontSize: 13, fontWeight: 700,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        opacity: toast.visible ? 1 : 0,
        transform: toast.visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.3s', pointerEvents: 'none',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {toast.msg}
      </div>
    </ToastContext.Provider>
  );
}

export default function Toast() {
  return null;
}
