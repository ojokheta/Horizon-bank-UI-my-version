'use client';

import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex size-10 items-center justify-center rounded-full border border-border bg-muted/70 text-foreground transition hover:bg-muted active:scale-95',
        className
      )}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
};

export default ThemeToggle;
