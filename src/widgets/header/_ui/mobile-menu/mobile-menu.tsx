'use client';
import { useEffect, useRef, useTransition } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';
import { ROUTES } from '@/shared/const/routes';
import {
    IconBell,
    IconCheck,
    IconClock,
    IconGitCompare,
    IconHeart,
    IconLogOut,
    IconMonitor,
    IconMoon,
    IconSun,
    IconUser,
    IconX,
} from '@/shared/ui/ui-icons';
import { useTheme, type Theme } from '@/shared/theme';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/shared/i18n/config';
import { setLocale } from '@/shared/i18n/actions';
import type { AuthUserType } from '@/entities/me/types/me-type';
import { useLogout } from '@/features/logout-feature/_hooks/use-logout';
import {beginTopLoader, doneTopLoader} from "@/shared/lib/begin-top-loader";
const DURATION = 320;
type MobileMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    user: AuthUserType | null | undefined;
    favCount: number;
    freshCount: number;
};
function getInitials(user: AuthUserType): string {
    const source = user.name ?? user.email ?? '?';
    return (
        source
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase() ?? '')
            .join('') || '?'
    );
}
export function MobileMenu({ isOpen, onClose, user, favCount, freshCount }: MobileMenuProps) {
    const t = useTranslations('header');
    const tUserMenu = useTranslations('user_menu');
    const { theme, setTheme } = useTheme();
    const currentLocale = useLocale() as Locale;
    const [isPending, startTransition] = useTransition();
    const { logout, isPending: isLoggingOut } = useLogout();
    const backdropRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);
    useEffect(() => {
        if (typeof document === 'undefined') return;
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    function pickLocale(locale: Locale) {
        if (locale === currentLocale) {
            onClose();
            return;
        }
        beginTopLoader();
        startTransition(async () => {
            try {
                await setLocale(locale);
                onClose();
            } finally {
                doneTopLoader();
            }
        });
    }
    const THEMES: { key: Theme; label: string; icon: React.ReactNode }[] = [
        { key: 'light', label: t('menu_theme_light'), icon: <IconMoon size={18} /> },
        { key: 'dark', label: t('menu_theme_dark'), icon: <IconSun size={18} /> },
        { key: 'system', label: t('menu_theme_system'), icon: <IconMonitor size={18} /> },
    ];
    if (typeof document === 'undefined') return null;
    const content = (
        <>
            <CSSTransition
                nodeRef={backdropRef}
                in={isOpen}
                timeout={DURATION}
                classNames="drawer-backdrop"
                unmountOnExit
            >
                <div
                    ref={backdropRef}
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                />
            </CSSTransition>
            <CSSTransition
                nodeRef={panelRef}
                in={isOpen}
                timeout={DURATION}
                classNames="drawer-panel"
                unmountOnExit
            >
                <aside
                    ref={panelRef}
                    aria-label={t('menu_title')}
                    className={cn(
                        'fixed inset-y-0 right-0 z-50 flex w-[min(320px,100vw)] flex-col',
                        'border-l border-border bg-surface-page',
                        'shadow-[0_12px_32px_-8px_rgb(15_23_42/0.16)]',
                    )}
                >
                    <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
                        <h2 className="text-sm font-semibold text-text-base">{t('menu_title')}</h2>
                        <button
                            type="button"
                            aria-label={t('menu_close_aria')}
                            onClick={onClose}
                            className="flex size-10 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-subtle active:bg-surface-muted"
                        >
                            <IconX size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {user && (
                            <div className="flex items-center gap-3 border-b border-border p-4">
                                <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-base font-semibold text-brand">
                                    {getInitials(user)}
                                </span>
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-medium text-text-base">
                                        {user.name ?? tUserMenu('no_name')}
                                    </div>
                                    {user.email && (
                                        <div className="truncate text-xs text-text-muted">
                                            {user.email}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {user && (
                            <nav className="flex flex-col border-b border-border py-2">
                                <MenuLink
                                    href={ROUTES.FAVORITES}
                                    icon={<IconHeart size={18} />}
                                    label={t('menu_favorites')}
                                    badge={favCount}
                                    onClose={onClose}
                                />
                                <MenuLink
                                    href={ROUTES.SUBSCRIPTIONS}
                                    icon={<IconBell size={18} />}
                                    label={t('menu_subscriptions')}
                                    badge={freshCount}
                                    onClose={onClose}
                                />
                                <MenuButton
                                    icon={<IconGitCompare size={18} />}
                                    label={t('menu_compare')}
                                    onClick={onClose}
                                />
                                <MenuLink
                                    href={ROUTES.PROFILE}
                                    icon={<IconUser size={18} />}
                                    label={tUserMenu('profile')}
                                    onClose={onClose}
                                />
                                <MenuButton
                                    icon={<IconClock size={18} />}
                                    label={tUserMenu('viewed')}
                                    onClick={onClose}
                                />
                            </nav>
                        )}
                        <section className="border-b border-border px-4 py-4">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-faint">
                                {t('menu_theme')}
                            </h3>
                            <div className="flex gap-2">
                                {THEMES.map((themeOpt) => {
                                    const active = theme === themeOpt.key;
                                    return (
                                        <button
                                            key={themeOpt.key}
                                            type="button"
                                            onClick={() => setTheme(themeOpt.key)}
                                            aria-pressed={active}
                                            className={cn(
                                                'flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md border py-2.5 text-xs font-medium transition-all',
                                                'active:scale-[0.97]',
                                                active
                                                    ? 'border-brand bg-brand/10 text-brand'
                                                    : 'border-border text-text-muted hover:border-border-strong hover:bg-surface-subtle',
                                            )}
                                        >
                                            {themeOpt.icon}
                                            <span>{themeOpt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                        <section className="border-b border-border px-4 py-4">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-faint">
                                {t('menu_language')}
                            </h3>
                            <div className="flex flex-col gap-1">
                                {LOCALES.map((locale) => {
                                    const active = locale === currentLocale;
                                    return (
                                        <button
                                            key={locale}
                                            type="button"
                                            onClick={() => pickLocale(locale)}
                                            disabled={isPending}
                                            className={cn(
                                                'flex items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors',
                                                active
                                                    ? 'bg-brand/10 text-brand font-medium'
                                                    : 'text-text-base hover:bg-surface-subtle active:bg-surface-muted',
                                                isPending && 'opacity-60',
                                            )}
                                        >
                                            <span>{LOCALE_LABELS[locale]}</span>
                                            {active && <IconCheck size={16} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                        {!user && (
                            <div className="p-4">
                                <Link
                                    href={ROUTES.SIGN_IN}
                                    onClick={onClose}
                                    className="flex h-12 items-center justify-center rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-hover active:opacity-90"
                                >
                                    {t('sign_in')}
                                </Link>
                            </div>
                        )}
                        {user && (
                            <div className="p-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        logout();
                                    }}
                                    disabled={isLoggingOut}
                                    className={cn(
                                        'flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border text-sm font-medium text-error transition-colors',
                                        'hover:bg-error-bg active:opacity-90',
                                        'disabled:cursor-not-allowed disabled:opacity-50',
                                    )}
                                >
                                    <IconLogOut size={18} />
                                    {tUserMenu('logout')}
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            </CSSTransition>
        </>
    );
    return createPortal(content, document.body);
}
type MenuLinkProps = {
    href: string;
    icon: React.ReactNode;
    label: string;
    badge?: number;
    onClose: () => void;
};
function MenuLink({ href, icon, label, badge, onClose }: MenuLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-sm text-text-base transition-colors hover:bg-surface-subtle active:bg-surface-muted"
        >
            <span className="text-text-muted">{icon}</span>
            <span className="flex-1">{label}</span>
            {typeof badge === 'number' && badge > 0 && (
                <span className="flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white leading-5">
                    {badge}
                </span>
            )}
        </Link>
    );
}
type MenuButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
};
function MenuButton({ icon, label, onClick }: MenuButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 text-left text-sm text-text-base transition-colors hover:bg-surface-subtle active:bg-surface-muted"
        >
            <span className="text-text-muted">{icon}</span>
            <span className="flex-1">{label}</span>
        </button>
    );
}
