'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/helpers/cn';
import { ROUTES } from '@/shared/const/routes';
import { IconMoon, IconSun } from '@/shared/ui/ui-icons';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initial =
      stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-raised px-4">
      <Link href={ROUTES.ROOT} className="flex items-center gap-2 hover:opacity-100">
        <span className="flex size-8 items-center justify-center rounded-md bg-brand text-base font-bold text-white">
          R
        </span>
        <span className="text-base font-semibold tracking-tight text-text-base">
          RealtX
        </span>
      </Link>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Переключить тему"
          className="flex size-9 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle hover:text-text-base"
        >
          {mounted && theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
        </button>

        <button
          type="button"
          className="flex h-9 cursor-pointer items-center rounded-md px-2.5 text-sm font-medium text-text-muted hover:bg-surface-subtle hover:text-text-base"
        >
          RU
        </button>

        <span className="mx-1.5 h-6 w-px bg-border" />

        <Link
          href={ROUTES.SIGN_IN}
          className={cn(
            'flex h-9 items-center rounded-md bg-brand px-3.5 text-sm font-medium text-white',
            'hover:bg-brand-hover hover:opacity-100',
          )}
        >
          Войти
        </Link>
      </div>
    </header>
  );
}
