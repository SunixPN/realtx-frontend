"use client";
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';
import { AuthUserType } from '@/entities/me/types/me-type';
import { IconClock, IconLogOut, IconUser } from '@/shared/ui/ui-icons';
import { useLogout } from '@/features/logout-feature/_hooks/use-logout';
import {ROUTES} from "@/shared/const/routes";
import useRouter from '@/shared/lib/use-router';
const CLOSE_MS = 120;
type UserMenuProps = {
    user: AuthUserType;
};
function getInitials(user: AuthUserType): string {
    const source = user.name ?? user.email ?? '?';
    return source
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0]?.toUpperCase() ?? '')
        .join('') || '?';
}
export function UserMenu({ user }: UserMenuProps) {
    const t = useTranslations('user_menu');
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { logout, isPending } = useLogout();
    function startClose() {
        setClosing(true);
        setTimeout(() => {
            setOpen(false);
            setClosing(false);
        }, CLOSE_MS);
    }
    function toggle() {
        if (open) {
            startClose();
        } else {
            setOpen(true);
        }
    }
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setClosing(true);
                setTimeout(() => { setOpen(false); setClosing(false); }, CLOSE_MS);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);
    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-label={t('profile_aria')}
                aria-expanded={open}
                onClick={toggle}
                className={cn(
                    'flex size-9 cursor-pointer items-center justify-center rounded-xl bg-brand/10 text-sm font-semibold text-brand hover:bg-brand/20',
                    open && 'ring-2 ring-brand/30',
                )}
            >
                {getInitials(user)}
            </button>
            {(open || closing) && (
                <div
                    role="menu"
                    style={{
                        animation: closing
                            ? `dropdown-out ${CLOSE_MS}ms ease-in forwards`
                            : 'dropdown-in 160ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
                        transformOrigin: 'top right',
                    }}
                    className="absolute top-full right-0 z-50 mt-2 w-72 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-lg"
                >
                    <div className="flex items-center gap-3 border-b border-border p-4">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-base font-semibold text-brand">
                            {getInitials(user)}
                        </span>
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-text-base">
                                {user.name ?? t('no_name')}
                            </div>
                            {user.email && (
                                <div className="truncate text-xs text-text-muted">
                                    {user.email}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col py-1">
                        <MenuItem onClick={() => { startClose(); router.push(ROUTES.PROFILE); }} icon={<IconUser size={16} />} label={t('profile')} />
                        <MenuItem onClick={() => router.push(ROUTES.VIEWED)} icon={<IconClock size={16} />} label={t('viewed')} />
                    </div>
                    <div className="border-t border-border">
                        <MenuItem
                            icon={<IconLogOut size={16} />}
                            label={t('logout')}
                            tone="danger"
                            disabled={isPending}
                            onClick={() => { startClose(); logout(); }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
type MenuItemProps = {
    icon: React.ReactNode;
    label: string;
    tone?: 'neutral' | 'danger';
    disabled?: boolean;
    onClick?: () => void;
};
function MenuItem({ icon, label, tone = 'neutral', disabled, onClick }: MenuItemProps) {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-surface-subtle',
                'disabled:cursor-not-allowed disabled:opacity-50',
                tone === 'danger' ? 'text-danger' : 'text-text-base',
            )}
        >
            <span className={tone === 'danger' ? 'text-danger' : 'text-text-muted'}>{icon}</span>
            <span className="flex-1">{label}</span>
        </button>
    );
}
