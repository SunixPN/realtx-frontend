'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';
import { ROUTES } from '@/shared/const/routes';
import {
    IconBell,
    IconGitCompare,
    IconHeart,
    IconLoader,
    IconMenu,
    IconMonitor,
    IconMoon,
    IconSun,
    IconX,
} from '@/shared/ui/ui-icons';
import { useTheme } from '@/shared/theme';
import { UserMenu } from '@/widgets/header/_ui/user-menu/user-menu';
import { LocaleSwitcher } from '@/widgets/header/_ui/locale-switcher/locale-switcher';
import { MobileMenu } from '@/widgets/header/_ui/mobile-menu/mobile-menu';
import { useAuth } from '@/entities/me/api/auth-query';
export function Header() {
    const t = useTranslations('header');
    const { theme, resolvedTheme, setTheme } = useTheme();
    const { isLoading: isPending, data } = useAuth();
    const favCount = data?.user?.favoritesCount ?? 0;
    const freshCount = data?.user?.subscriptionsFreshCount ?? 0;
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const cycleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
    };
    const ThemeIcon = theme === 'system' ? IconMonitor : resolvedTheme === 'dark' ? IconSun : IconMoon;
    const totalBadge = favCount + freshCount;
    return (
        <>
            <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-raised px-3 sm:px-4">
                <Link href={ROUTES.ROOT} className="flex items-center hover:opacity-80" aria-label={t('logo_alt')}>
                    <Image
                        src="/logo.png"
                        alt={t('logo_alt')}
                        width={108}
                        height={32}
                        priority
                        className="block h-7 w-auto sm:h-8 dark:hidden"
                    />
                    <Image
                        src="/logo-dark.png"
                        alt={t('logo_alt')}
                        width={108}
                        height={32}
                        priority
                        className="hidden h-7 w-auto sm:h-8 dark:block"
                    />
                </Link>
                <div className="hidden items-center gap-1 md:flex">
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
                <button
                    type="button"
                    onClick={() => setIsMobileOpen((v) => !v)}
                    aria-label={isMobileOpen ? t('menu_close_aria') : t('menu_open_aria')}
                    aria-expanded={isMobileOpen}
                    className="relative flex size-10 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-subtle hover:text-text-base active:bg-surface-muted md:hidden"
                >
                    <span
                        className={cn(
                            'absolute inset-0 flex items-center justify-center transition-all duration-200',
                            isMobileOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100',
                        )}
                    >
                        <IconMenu size={22} />
                    </span>
                    <span
                        className={cn(
                            'absolute inset-0 flex items-center justify-center transition-all duration-200',
                            isMobileOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0',
                        )}
                    >
                        <IconX size={22} />
                    </span>
                    {!isMobileOpen && data?.user && totalBadge > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-brand ring-2 ring-surface-raised" />
                    )}
                </button>
            </header>
            <MobileMenu
                isOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
                user={data?.user ?? null}
                favCount={favCount}
                freshCount={freshCount}
            />
        </>
    );
}
