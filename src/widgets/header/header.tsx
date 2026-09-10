'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/helpers/cn';
import { ROUTES } from '@/shared/const/routes';
import { IconLoader, IconMoon, IconSun } from '@/shared/ui/ui-icons';
import { UserMenu } from '@/widgets/header/_ui/user-menu/user-menu';
import {useQuery} from "@tanstack/react-query";
import {authQuery} from "@/entities/me/api/auth-query";

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  const { isLoading: isPending, data } = useQuery(authQuery)

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
      <Link href={ROUTES.ROOT} className="flex items-center hover:opacity-80">
        <Image src="/logo.png" alt="RealtX" width={108} height={32} priority />
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

        {isPending ? (
          <div
            aria-label="Проверка авторизации"
            className="flex size-9 items-center justify-center rounded-xl text-text-muted"
          >
            <IconLoader size={18} />
          </div>
        ) : data?.user ? (
          <UserMenu user={data.user} />
        ) : (
          <Link
            href={ROUTES.SIGN_IN}
            className={cn(
              'flex h-9 items-center rounded-md bg-brand px-3.5 text-sm font-medium text-white',
              'hover:bg-brand-hover hover:opacity-100',
            )}
          >
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
