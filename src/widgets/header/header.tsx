'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';
import { ROUTES } from '@/shared/const/routes';
import { IconBell, IconGitCompare, IconHeart, IconLoader, IconMonitor, IconMoon, IconSun } from '@/shared/ui/ui-icons';
import { useTheme } from '@/shared/theme';
import { UserMenu } from '@/widgets/header/_ui/user-menu/user-menu';
import { LocaleSwitcher } from '@/widgets/header/_ui/locale-switcher/locale-switcher';
import { useAuth } from "@/entities/me/api/auth-query";
export function Header() {
  const t = useTranslations('header');
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { isLoading: isPending, data } = useAuth()
  const favCount = data?.user?.favoritesCount ?? 0
  const freshCount = data?.user?.subscriptionsFreshCount ?? 0
  const cycleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  };
  const ThemeIcon = theme === 'system' ? IconMonitor : resolvedTheme === 'dark' ? IconSun : IconMoon;
  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-raised px-4">
      <Link href={ROUTES.ROOT} className="flex items-center hover:opacity-80">
        <Image
          src="/logo.png"
          alt={t('logo_alt')}
          width={108}
          height={32}
          priority
          className="block dark:hidden"
        />
        <Image
          src="/logo-dark.png"
          alt={t('logo_alt')}
          width={108}
          height={32}
          priority
          className="hidden dark:block"
        />
      </Link>
      <div className="flex items-center gap-1">
        {data?.user && (
            <>
              <Link
                  href={ROUTES.FAVORITES}
                  aria-label={favCount ? t('favorites_aria_count', { count: favCount }) : t('favorites_aria')}
                  className="relative flex size-9 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle hover:text-text-base"
              >
                <IconHeart size={20} />
                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white leading-4">
                    {favCount}
                  </span>
                )}
              </Link>
              <Link
                  href={ROUTES.SUBSCRIPTIONS}
                  aria-label={freshCount ? t('subscriptions_aria_count', { count: freshCount }) : t('subscriptions_aria')}
                  className="relative flex size-9 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle hover:text-text-base"
              >
                <IconBell size={20} />
                {freshCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white leading-4">
                    {freshCount}
                  </span>
                )}
              </Link>
              <button
                  type="button"
                  aria-label={t('compare_aria')}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle hover:text-text-base"
              >
                <IconGitCompare size={20} />
              </button>
              <span className="mx-1.5 h-6 w-px bg-border" />
            </>
        )}
        <button
          type="button"
          onClick={cycleTheme}
          aria-label={t('theme_toggle_aria')}
          title={theme}
          className="flex size-9 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle hover:text-text-base"
        >
          <ThemeIcon size={20} />
        </button>
        <LocaleSwitcher />
        <span className="mx-1.5 h-6 w-px bg-border" />
        {isPending ? (
          <div
            aria-label={t('auth_checking_aria')}
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
            {t('sign_in')}
          </Link>
        )}
      </div>
    </header>
  );
}
