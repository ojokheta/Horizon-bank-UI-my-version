'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, InfoCircle, X, XCircle } from 'reicon-react';
import type { IconComponent } from 'reicon-react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ToastTone = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastTone, IconComponent> = {
  success: CheckCircle,
  error: XCircle,
  info: InfoCircle,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, tone = 'success' }: ToastInput) => {
      const id = `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      setToasts((current) => [...current, { id, title, description, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-4 z-[80] flex w-[min(100%-2rem,360px)] flex-col gap-3 md:bottom-6 md:right-6">
        {toasts.map((item) => {
          const Icon = ICONS[item.tone];
          return (
            <div
              key={item.id}
              className={cn(
                'pointer-events-auto flex gap-3 rounded-2xl border bg-card p-4 text-card-foreground shadow-lift animate-in slide-in-from-bottom-2 fade-in-0',
                item.tone === 'success' && 'border-forest/20',
                item.tone === 'error' && 'border-destructive/30',
                item.tone === 'info' && 'border-border'
              )}
            >
              <Icon
                className={cn(
                  'mt-0.5 size-5 shrink-0',
                  item.tone === 'success' && 'text-forest dark:text-sage',
                  item.tone === 'error' && 'text-destructive',
                  item.tone === 'info' && 'text-muted-foreground'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{item.title}</p>
                {item.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Dismiss notification"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
