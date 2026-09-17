'use client'

import Link from 'next/link'
import {
    Bell,
    BellOff,
    ChevronRight,
    Mail,
    Pencil,
    Trash2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import {
    fromBackendFilters,
    useDeleteSubscription,
    useMarkSeenSubscription,
    useTogglePauseSubscription,
    type SearchSubscriptionType,
} from '@/entities/search-subscription'
import { serializeFiltersToSearchParams } from '@/entities/estate'
import { ROUTES } from '@/shared/const/routes'
import { showToast } from '@/shared/helpers/show-toast'
import { useFormatFrequency } from '../_helpers/format-frequency'
import { useFormatLastCheck } from '../_helpers/format-last-check'

type Props = {
    subscription: SearchSubscriptionType
    onEdit: (s: SearchSubscriptionType) => void
}

export function SubscriptionRow({ subscription: s, onEdit }: Props) {
    const t = useTranslations('subscriptions')
    const formatFrequency = useFormatFrequency()
    const formatLastCheck = useFormatLastCheck()
    const { trigger: togglePause, isMutating: isTogglingPause } = useTogglePauseSubscription()
    const { trigger: remove, isMutating: isRemoving } = useDeleteSubscription()
    const { trigger: markSeen } = useMarkSeenSubscription()

    const handlePauseToggle = async () => {
        try {
            await togglePause({ id: s.id, paused: !s.paused }, { throwOnError: true })
            showToast({ status: 'success', text: s.paused ? t('toast_resumed') : t('toast_paused') })
        } catch {
            showToast({ status: 'error', text: t('toast_pause_error') })
        }
    }

    const handleDelete = async () => {
        try {
            await remove(s.id, { throwOnError: true })
            showToast({ status: 'success', text: t('toast_deleted') })
        } catch {
            showToast({ status: 'error', text: t('toast_delete_error') })
        }
    }

    const busy = isTogglingPause || isRemoving

    const searchHref = (() => {
        const qs = serializeFiltersToSearchParams(fromBackendFilters(s.filters)).toString()
        return qs ? `${ROUTES.ROOT}?${qs}` : ROUTES.ROOT
    })()

    return (
        <article
            className={cn(
                'flex flex-col gap-3 rounded-lg border p-4 transition-colors',
                s.paused ? 'border-border bg-surface-subtle' : 'border-border bg-surface-raised',
                busy && 'opacity-60',
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h2
                            className={cn(
                                'truncate text-base font-semibold',
                                s.paused ? 'text-text-muted' : 'text-text-base',
                            )}
                        >
                            {s.name}
                        </h2>
                        {s.paused && (
                            <span className="inline-flex items-center gap-1 rounded-xs bg-surface-muted px-1.5 py-0.5 text-xs text-text-muted">
                                <BellOff className="size-3" aria-hidden />
                                {t('row_paused')}
                            </span>
                        )}
                        {s.fresh > 0 && !s.paused && (
                            <span className="rounded-xs bg-brand/10 px-1.5 py-0.5 text-xs font-medium text-brand">
                                {t('row_fresh', { count: s.fresh })}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-text-muted">{s.summary}</p>
                    {s.chips.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {s.chips.map(c => (
                                <span
                                    key={c}
                                    className="rounded-xs bg-surface-muted px-1.5 py-0.5 text-xs text-text-muted"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <IconButton label={t('row_edit_aria')} onClick={() => onEdit(s)}>
                        <Pencil className="size-4" />
                    </IconButton>
                    <IconButton
                        label={s.paused ? t('row_resume_aria') : t('row_pause_aria')}
                        onClick={handlePauseToggle}
                        disabled={busy}
                    >
                        {s.paused ? <Bell className="size-4" /> : <BellOff className="size-4" />}
                    </IconButton>
                    <IconButton label={t('row_delete_aria')} onClick={handleDelete} disabled={busy}>
                        <Trash2 className="size-4" />
                    </IconButton>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-text-muted">
                <span className="tabular-nums">{t('row_total', { count: s.total })}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                    <Mail className="size-3.5" aria-hidden /> Email
                </span>
                <span aria-hidden>·</span>
                <span>{formatFrequency(s.frequency)}</span>
                <span aria-hidden>·</span>
                <span>{t('row_last_check', { when: formatLastCheck(s.lastCheckedAt) })}</span>
                <Link
                    href={searchHref}
                    onClick={() => {
                        if (s.fresh > 0) void markSeen(s.id).catch(() => {})
                    }}
                    className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                >
                    {t('row_view_link', { count: s.total })}
                    <ChevronRight className="size-3.5" />
                </Link>
            </div>
        </article>
    )
}

function IconButton({
    label,
    children,
    onClick,
    disabled,
}: {
    label: string
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
}) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            disabled={disabled}
            className="flex size-9 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-subtle hover:text-text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
            {children}
        </button>
    )
}
