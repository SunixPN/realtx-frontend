'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { AlertTriangle, Bell, ChevronRight, Clock, GitCompare, Heart, Mail, Phone, User } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { ROUTES } from '@/shared/const/routes'
import { UIButton } from '@/shared/ui/ui-button'
import type { AuthUserType } from '@/entities/me/types/me-type'
import { formatPhone } from '@/shared/helpers/format-phone'

function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')
}

export function ProfileHeader({ user }: { user: AuthUserType }) {
    const t = useTranslations('profile')
    const locale = useLocale()
    // Контакты уже есть строкой ниже — в заголовок их не дублируем
    const name = user.name?.trim()
    const since = new Date(user.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    return (
        <div className="flex items-center gap-4 border-b border-border pb-5 sm:gap-5 sm:pb-6">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-bg text-lg font-semibold text-brand sm:size-16 sm:text-xl">
                {name ? initials(name) : <User className="size-6 sm:size-7" aria-hidden />}
            </span>
            <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-semibold text-text-base sm:text-2xl">{name || t('no_name')}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
                    {user.email && (
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                            <Mail className="size-4 shrink-0 text-text-faint" aria-hidden />
                            <span className="truncate">{user.email}</span>
                        </span>
                    )}
                    {user.phone && (
                        <span className="inline-flex items-center gap-1.5 tabular-nums">
                            <Phone className="size-4 shrink-0 text-text-faint" aria-hidden />
                            {formatPhone(user.phone)}
                        </span>
                    )}
                    <span className="text-text-faint">
                        <span className="hidden sm:inline" aria-hidden>· </span>
                        {t('member_since', { date: since })}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function UnverifiedEmailBanner({ email, onConfirm }: { email: string; onConfirm: () => void }) {
    const t = useTranslations('profile')
    return (
        <Banner
            tone="warning"
            icon={<AlertTriangle className="size-5" aria-hidden />}
            title={t('banner_unverified_title')}
            text={t.rich('banner_unverified_text', {
                email: () => <span className="font-medium break-all">{email}</span>,
            })}
            action={t('confirm')}
            onAction={onConfirm}
        />
    )
}

export function MissingEmailBanner({ onAdd }: { onAdd: () => void }) {
    const t = useTranslations('profile')
    return (
        <Banner
            tone="brand"
            icon={<Mail className="size-5" aria-hidden />}
            title={t('banner_missing_title')}
            text={t('banner_missing_text')}
            action={t('add')}
            onAction={onAdd}
        />
    )
}

function Banner({
    tone,
    icon,
    title,
    text,
    action,
    onAction,
}: {
    tone: 'warning' | 'brand'
    icon: ReactNode
    title: string
    text: ReactNode
    action: string
    onAction: () => void
}) {
    return (
        <div
            className={cn(
                'flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center',
                tone === 'warning' ? 'border-warning/25 bg-warning-bg' : 'border-brand/20 bg-brand-bg',
            )}
        >
            <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className={cn('mt-0.5 shrink-0', tone === 'warning' ? 'text-warning' : 'text-brand')}>{icon}</span>
                <div className="min-w-0">
                    <div className={cn('text-sm font-medium', tone === 'warning' ? 'text-warning' : 'text-brand')}>
                        {title}
                    </div>
                    <p className="mt-0.5 text-xs text-text-muted">{text}</p>
                </div>
            </div>
            <UIButton size="sm" onClick={onAction} className="self-start sm:self-auto">
                {action}
            </UIButton>
        </div>
    )
}

const TILE_TONE = {
    danger: 'bg-error-bg text-error',
    brand: 'bg-brand-bg text-brand',
    neutral: 'bg-surface-muted text-text-muted',
} as const

export function ActivityTiles({ user }: { user: AuthUserType }) {
    const t = useTranslations('profile')
    const tiles = [
        { href: ROUTES.FAVORITES, icon: <Heart className="size-5" />, label: t('activity_favorites'), count: user.favoritesCount, tone: 'danger' as const },
        { href: ROUTES.SUBSCRIPTIONS, icon: <Bell className="size-5" />, label: t('activity_subscriptions'), count: user.subscriptionsCount, tone: 'brand' as const },
        { href: ROUTES.COMPARE, icon: <GitCompare className="size-5" />, label: t('activity_compare'), count: user.compareCount, tone: 'neutral' as const },
    ]
    return (
        <div className="flex flex-col gap-3 sm:gap-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {tiles.map((tile) => (
                    <Link
                        key={tile.href}
                        href={tile.href}
                        className="group flex flex-col items-start gap-2 rounded-lg border border-border bg-surface-page p-3 transition-shadow hover:border-border-strong hover:shadow-md sm:flex-row sm:items-center sm:gap-3 sm:p-4"
                    >
                        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-md sm:size-10', TILE_TONE[tile.tone])}>
                            {tile.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="text-xl font-semibold text-text-base tabular-nums sm:text-2xl">{tile.count}</div>
                            <div className="truncate text-xs text-text-faint">{tile.label}</div>
                        </div>
                        <ChevronRight
                            className="hidden size-4 text-text-faint transition-colors group-hover:text-text-base sm:block"
                            aria-hidden
                        />
                    </Link>
                ))}
            </div>
            <Link
                href={ROUTES.VIEWED}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-muted px-4 py-3 transition-shadow hover:bg-surface-page hover:shadow-md"
            >
                <div className="flex items-center gap-3">
                    <Clock className="size-4 shrink-0 text-text-faint" aria-hidden />
                    <div>
                        <div className="text-sm font-medium text-text-base">{t('activity_viewed')}</div>
                        <div className="text-xs text-text-faint">{t('activity_viewed_count', { count: user.viewedCount })}</div>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-brand group-hover:underline">
                    {t('open')}
                    <ChevronRight className="size-3.5" />
                </div>
            </Link>
        </div>
    )
}
