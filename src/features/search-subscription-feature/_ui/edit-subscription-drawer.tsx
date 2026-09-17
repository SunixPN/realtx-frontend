'use client'

import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { AlertTriangle, Check, Mail, MapPin, Send, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/const/routes'
import { UIButton } from '@/shared/ui/ui-button'
import { UIInput } from '@/shared/ui/ui-input'
import { UISwitch } from '@/shared/ui/ui-switch'
import { cn } from '@/shared/helpers/cn'
import { showToast } from '@/shared/helpers/show-toast'
import {
    fromBackendFilters,
    useCreateSubscription,
    useDeleteSubscription,
    useUpdateSubscription,
    type SearchSubscriptionType,
    type SubscriptionChannel,
    type SubscriptionFrequency,
    type SubscriptionTrigger,
} from '@/entities/search-subscription'
import type { MapFiltersType } from '@/entities/estate'
import { useAuth } from '@/entities/me/api/auth-query'
import { FiltersDrawer } from '@/features/main-map-filters-feature/_ui/filters-drawer'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { useDescribeFiltersClient } from '../_helpers/describe-filters-client'

const DURATION = 320

type Mode =
    | { kind: 'create'; initialFilters: MapFiltersType }
    | { kind: 'edit'; subscription: SearchSubscriptionType }

type Props = {
    isOpen: boolean
    mode: Mode | null
    onClose: () => void
    onSaved?: (s: SearchSubscriptionType) => void
    onDeleted?: (id: string) => void
}

export function EditSubscriptionDrawer({ isOpen, mode, onClose, onSaved, onDeleted }: Props) {
    const t = useTranslations('subscriptions')
    const describeFilters = useDescribeFiltersClient()

    const FREQ_OPTIONS: { key: SubscriptionFrequency; title: string; note: string }[] = [
        { key: 'instant', title: t('freq_instant_title'), note: t('freq_instant_note') },
        { key: 'daily', title: t('freq_daily_title'), note: t('freq_daily_note') },
        { key: 'weekly', title: t('freq_weekly_title'), note: t('freq_weekly_note') },
    ]

    const TRIGGER_OPTIONS: { key: SubscriptionTrigger; label: string; note: string }[] = [
        { key: 'new', label: t('trigger_new_label'), note: t('trigger_new_note') },
        { key: 'price-down', label: t('trigger_price_label'), note: t('trigger_price_note') },
    ]

    const backdropRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLElement>(null)

    const { data: auth } = useAuth()

    const [name, setName] = useState('')
    const [filters, setFilters] = useState<MapFiltersType>({})
    const [frequency, setFrequency] = useState<SubscriptionFrequency>('instant')
    const [triggers, setTriggers] = useState<SubscriptionTrigger[]>(['new', 'price-down'])
    const [channels] = useState<SubscriptionChannel[]>(['email'])
    const [quietHours, setQuietHours] = useState(false)
    const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false)

    // При смене mode перезаливаем форму. Не хочется хранить старые значения
    // от предыдущего открытия.
    useEffect(() => {
        if (!mode) return
        if (mode.kind === 'create') {
            const defaultName = describeFilters(mode.initialFilters).summary
            setName(defaultName.length > 100 ? defaultName.slice(0, 100) : defaultName)
            setFilters(mode.initialFilters)
            setFrequency('instant')
            setTriggers(['new', 'price-down'])
            setQuietHours(false)
        } else {
            const s = mode.subscription
            setName(s.name)
            setFilters(fromBackendFilters(s.filters))
            setFrequency(s.frequency)
            setTriggers(s.triggers.length ? s.triggers : ['new'])
            setQuietHours(s.quietHours)
        }
    }, [mode])

    // ESC → закрыть
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (filtersDrawerOpen) setFiltersDrawerOpen(false)
                else onClose()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, filtersDrawerOpen, onClose])

    // Body scroll lock — окно поверх страницы.
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    const { trigger: create, isMutating: isCreating } = useCreateSubscription()
    const { trigger: update, isMutating: isUpdating } = useUpdateSubscription()
    const { trigger: remove, isMutating: isRemoving } = useDeleteSubscription()

    const busy = isCreating || isUpdating || isRemoving
    const currency: DisplayCurrency = filters.currency ?? 'USD'
    const summary = describeFilters(filters).summary

    const toggleTrigger = (t: SubscriptionTrigger) => {
        setTriggers(cur =>
            cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t],
        )
    }

    const handleSave = async () => {
        const trimmed = name.trim()
        if (!trimmed) {
            showToast({ status: 'error', text: t('toast_name_required') })
            return
        }
        if (triggers.length === 0) {
            showToast({ status: 'error', text: t('toast_triggers_required') })
            return
        }
        try {
            if (mode?.kind === 'create') {
                const created = await create(
                    { name: trimmed, filters, frequency, triggers, channels, quietHours },
                    { throwOnError: true },
                )
                showToast({ status: 'success', text: t('toast_created') })
                onSaved?.(created)
            } else if (mode?.kind === 'edit') {
                const updated = await update(
                    {
                        id: mode.subscription.id,
                        patch: { name: trimmed, filters, frequency, triggers, channels, quietHours },
                    },
                    { throwOnError: true },
                )
                showToast({ status: 'success', text: t('toast_updated') })
                onSaved?.(updated)
            }
            onClose()
        } catch {
            showToast({ status: 'error', text: t('toast_save_error') })
        }
    }

    const handleDelete = async () => {
        if (mode?.kind !== 'edit') return
        try {
            await remove(mode.subscription.id, { throwOnError: true })
            showToast({ status: 'success', text: t('toast_deleted') })
            onDeleted?.(mode.subscription.id)
            onClose()
        } catch {
            showToast({ status: 'error', text: t('toast_delete_error') })
        }
    }

    return (
        <>
            {/* Backdrop */}
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
                    className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
                />
            </CSSTransition>

            {/* Panel */}
            <CSSTransition
                nodeRef={panelRef}
                in={isOpen}
                timeout={DURATION}
                classNames="drawer-panel"
                unmountOnExit
            >
                <aside
                    ref={panelRef}
                    aria-label={t('drawer_aria')}
                    className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[460px] flex-col border-l border-border bg-surface-page shadow-[0_12px_32px_-8px_rgb(15_23_42/0.16)]"
                >
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
                        <div className="min-w-0">
                            <h2 className="truncate text-[0.9375rem] font-semibold text-text-base">
                                {mode?.kind === 'edit' ? mode.subscription.name : t('drawer_new_title')}
                            </h2>
                            {summary && (
                                <p className="mt-0.5 truncate text-xs text-text-muted">{summary}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            aria-label={t('drawer_close_aria')}
                            onClick={onClose}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-subtle"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto">
                        <Section title={t('form_name_title')}>
                            <UIInput
                                value={name}
                                onChange={e => setName(e.target.value)}
                                maxLength={120}
                                placeholder={t('form_name_placeholder')}
                                hint={t('form_name_hint')}
                            />
                        </Section>

                        <Section title={t('form_criteria_title')}>
                            <div className="flex items-start gap-3 rounded-sm border border-border bg-surface-subtle p-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-text-muted" aria-hidden />
                                <div className="min-w-0 text-sm text-text-muted">{summary}</div>
                                <button
                                    type="button"
                                    onClick={() => setFiltersDrawerOpen(true)}
                                    className="ml-auto shrink-0 cursor-pointer text-sm font-medium text-brand hover:underline"
                                >
                                    {t('form_criteria_edit')}
                                </button>
                            </div>
                        </Section>

                        <Section title={t('form_when_title')}>
                            <div className="flex flex-col gap-2">
                                {FREQ_OPTIONS.map(f => (
                                    <RadioTile
                                        key={f.key}
                                        title={f.title}
                                        note={f.note}
                                        selected={frequency === f.key}
                                        onClick={() => setFrequency(f.key)}
                                    />
                                ))}
                            </div>
                        </Section>

                        <Section title={t('form_what_title')}>
                            <div className="flex flex-col gap-2">
                                {TRIGGER_OPTIONS.map(t => {
                                    const on = triggers.includes(t.key)
                                    return (
                                        <label
                                            key={t.key}
                                            className="flex cursor-pointer items-start gap-3 rounded-sm border border-border p-3 transition-colors hover:bg-surface-subtle"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={on}
                                                onChange={() => toggleTrigger(t.key)}
                                                className="sr-only"
                                            />
                                            <span
                                                className={cn(
                                                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-xs border transition-colors',
                                                    on
                                                        ? 'border-brand bg-brand text-white'
                                                        : 'border-border-strong bg-surface-page',
                                                )}
                                            >
                                                {on && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                                            </span>
                                            <span>
                                                <span className="block text-sm font-medium text-text-base">{t.label}</span>
                                                <span className="mt-0.5 block text-xs text-text-muted">{t.note}</span>
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        </Section>

                        <Section title={t('form_where_title')}>
                            <div className="flex flex-col gap-2">
                                <EmailChannelRow
                                    email={auth?.user?.email ?? null}
                                    verified={!!auth?.user?.emailVerified}
                                    t={t}
                                />
                                <ChannelRow
                                    icon={<Send className="size-5" />}
                                    title="Telegram"
                                    address={t('channel_coming_soon')}
                                    enabled={false}
                                    verified={false}
                                />
                            </div>
                        </Section>

                        <Section title={t('form_quiet_title')}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-base text-text-base">{t('form_quiet_label')}</div>
                                    <div className="mt-0.5 text-xs text-text-muted">
                                        {t('form_quiet_note')}
                                    </div>
                                </div>
                                <UISwitch checked={quietHours} onChange={e => setQuietHours(e.target.checked)} />
                            </div>
                        </Section>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface-page px-5 py-4">
                        {mode?.kind === 'edit' ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={busy}
                                className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-error transition-opacity hover:opacity-80 disabled:opacity-50"
                            >
                                <Trash2 className="size-4" />
                                {t('delete_button')}
                            </button>
                        ) : (
                            <span />
                        )}
                        <div className="flex gap-2">
                            <UIButton variant="secondary" size="md" onClick={onClose} disabled={busy}>
                                {t('cancel_button')}
                            </UIButton>
                            <UIButton size="md" onClick={handleSave} loading={busy}>
                                {t('save_button')}
                            </UIButton>
                        </div>
                    </div>
                </aside>
            </CSSTransition>

            {/* Панель фильтров поверх формы. Держим её ВНУТРИ EditSubscriptionDrawer,
                чтобы у неё был доступ к тому же слою (fixed + z-index выше). */}
            <FiltersDrawer
                isOpen={filtersDrawerOpen}
                filters={filters}
                onChange={updater => setFilters(prev => updater(prev))}
                onClear={() => setFilters(cur => ({ currency: cur.currency }))}
                onClose={() => setFiltersDrawerOpen(false)}
                total={0}
                currency={currency}
                onCurrencyChange={c => setFilters(f => ({ ...f, currency: c }))}
                applyLabel={t('filters_done')}
                zIndexOffset={40}
            />
        </>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-3 border-b border-border px-5 py-5">
            <h3 className="text-base font-semibold text-text-base">{title}</h3>
            {children}
        </section>
    )
}

function RadioTile({
    title,
    note,
    selected,
    onClick,
}: {
    title: string
    note: string
    selected: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex cursor-pointer items-start gap-3 rounded-sm border p-3 text-left transition-colors',
                selected
                    ? 'border-brand bg-brand/5'
                    : 'border-border bg-surface-page hover:bg-surface-subtle',
            )}
        >
            <span
                className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    selected ? 'border-brand bg-brand' : 'border-border-strong bg-surface-page',
                )}
            >
                {selected && <span className="size-2 rounded-full bg-white" />}
            </span>
            <span>
                <span className={cn('block text-sm font-medium', selected ? 'text-brand' : 'text-text-base')}>
                    {title}
                </span>
                <span className="mt-0.5 block text-xs text-text-muted">{note}</span>
            </span>
        </button>
    )
}

function EmailChannelRow({ email, verified, t }: { email: string | null; verified: boolean; t: (key: string) => string }) {
    const missing = !email
    const problem = missing || !verified
    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-sm border p-3',
                problem ? 'border-warning/40 bg-warning/5' : 'border-border',
            )}
        >
            <div
                className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-sm',
                    problem ? 'bg-warning/10 text-warning' : 'bg-brand/10 text-brand',
                )}
            >
                <Mail className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-text-base">
                    Email
                    {verified && <Check className="size-3.5 text-success" aria-label={t('email_verified_aria')} />}
                    {problem && (
                        <span className="inline-flex items-center gap-1 rounded-xs bg-warning/15 px-1.5 py-0.5 text-xs font-medium text-warning">
                            <AlertTriangle className="size-3" aria-hidden />
                            {missing ? t('email_not_set') : t('email_not_verified')}
                        </span>
                    )}
                </div>
                <div className="mt-0.5 truncate text-xs text-text-muted">
                    {missing ? t('email_missing_note') : email}
                </div>
                {problem && (
                    <Link
                        href={ROUTES.PROFILE}
                        className="mt-1 inline-block text-xs font-medium text-brand hover:underline"
                    >
                        {missing ? t('email_add_link') : t('email_verify_link')}
                    </Link>
                )}
            </div>
            <UISwitch checked={!problem} disabled />
        </div>
    )
}

function ChannelRow({
    icon,
    title,
    address,
    enabled,
    verified,
}: {
    icon: React.ReactNode
    title: string
    address: string
    enabled: boolean
    verified: boolean
}) {
    const t = useTranslations('subscriptions')
    return (
        <div className="flex items-center gap-3 rounded-sm border border-border p-3">
            <div
                className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-sm',
                    enabled ? 'bg-brand/10 text-brand' : 'bg-surface-muted text-text-muted',
                )}
            >
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-text-base">
                    {title}
                    {verified && <Check className="size-3.5 text-success" aria-label={t('email_verified_aria')} />}
                </div>
                <div className="truncate text-xs text-text-muted">{address}</div>
            </div>
            {enabled ? (
                <UISwitch checked disabled />
            ) : (
                <span className="rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-text-muted">
                    скоро
                </span>
            )}
        </div>
    )
}
