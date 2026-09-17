'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import type { TransitionStatus } from 'react-transition-group/Transition'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTranslations, useLocale } from 'next-intl'
import {
    ArrowLeft,
    Bell,
    Building2,
    Check,
    ChevronRight,
    Copy,
    ExternalLink,
    GitCompare,
    Heart,
    Phone,
    PhoneOff,
    Ruler,
    Share2,
    Train,
    X,
} from 'lucide-react'
import {
    useEstateById,
    useWallMaterialLabels,
    useRepairStateLabels,
    useFormatRooms,
    useFormatArea,
    type EstateType,
    type PriceHistoryPoint,
} from '@/entities/estate'
import { useAuth } from '@/entities/me/api/auth-query'
import { useToggleFavorite } from '@/features/favorite-toggle-feature'
import { IconLoader } from '@/shared/ui/ui-icons'
import { useDisplayCurrency, type DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { PhotoSlider } from '@/features/estate-drawer-feature/_ui/photo-slider'
import { PriceDisplay, PricePerM2Display } from '@/features/estate-drawer-feature/_ui/price-display'
import { PriceChangeBadge } from '@/features/estate-drawer-feature/_ui/price-change-badge'
import { formatStorey, formatNumber } from '@/features/estate-drawer-feature/_ui/format'
import { cn } from '@/shared/helpers/cn'

const PropertyMiniMap = dynamic(
    () => import('./property-mini-map').then((m) => m.PropertyMiniMap),
    { ssr: false },
)

type Props = {
    id: number
}

function daysBetween(a: string, b = new Date().toISOString()): number {
    return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)))
}

function pickHistoryValue(p: PriceHistoryPoint, currency: DisplayCurrency): number | null {
    return currency === 'USD' ? p.usd : currency === 'BYN' ? p.byn : p.eur
}

export function PropertyDetailWidget({ id }: Props) {
    const t = useTranslations('estate')
    const { currency } = useDisplayCurrency()
    const { data: estate, error } = useEstateById(id, currency)
    const isError = !!error

    if (isError) {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-[1520px] items-center justify-center px-6 py-12">
                <div className="rounded-md bg-[var(--error-bg)] p-4 text-sm text-[var(--error)]">
                    {t('error_load')}
                </div>
            </div>
        )
    }

    if (!estate) {
        return (
            <div className="mx-auto w-full max-w-[1520px] px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 aspect-[4/3] animate-shimmer rounded-lg" />
                    <div className="col-span-4 h-96 animate-shimmer rounded-lg" />
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-8 px-6 py-6">
            <Breadcrumbs estate={estate} />

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                    <Gallery estate={estate} currency={currency} />
                </div>
                <div className="col-span-4">
                    <PriceCard estate={estate} currency={currency} />
                    <aside className="col-span-4 flex flex-col gap-6 mt-6">
                        <SellerCard estate={estate} />
                        <SafetyNote />
                    </aside>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 flex flex-col gap-6">
                    <KeyFacts estate={estate} />
                    <PriceHistoryBlock estate={estate} currency={currency} />
                    <Description estate={estate} />
                    <SpecsGrid estate={estate} />
                    <LocationSection estate={estate} currency={currency} />
                </div>
            </div>

            <Disclaimer estate={estate} />
        </div>
    )
}

function Breadcrumbs({ estate }: { estate: EstateType }) {
    const t = useTranslations('estate')
    const formatRooms = useFormatRooms()

    const parts = [
        estate.townName ?? t('default_town'),
        estate.districtName ? t('district_suffix', { name: estate.districtName }) : null,
        t('title_flat', { rooms: formatRooms(estate.rooms) }),
    ].filter(Boolean) as string[]

    return (
        <nav aria-label={t('breadcrumbs_aria')} className="flex items-center gap-2 text-sm text-text-muted">
            <Link
                href="/"
                aria-label={t('back_to_map_aria')}
                className="flex size-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-muted"
            >
                <ArrowLeft className="size-4" />
            </Link>
            {parts.map((p, i) => (
                <span key={p} className="flex items-center gap-2">
                    {i > 0 && <ChevronRight className="size-3.5 text-text-faint" aria-hidden />}
                    <span className={i === parts.length - 1 ? 'text-text-base' : ''}>{p}</span>
                </span>
            ))}
        </nav>
    )
}

function isNew(estate: EstateType): boolean {
    if (!estate.publishedAt) return false
    return daysBetween(estate.publishedAt) <= 3
}

function Gallery({ estate, currency }: { estate: EstateType; currency: DisplayCurrency }) {
    const t = useTranslations('estate')
    const isAgency = estate.sellerType === 0 && !!estate.agencyName
    const priceDown = estate.priceChange && (
        currency === 'USD' ? (estate.priceChange.deltaUsd ?? 0) < 0 :
        currency === 'BYN' ? (estate.priceChange.deltaByn ?? 0) < 0 :
        (estate.priceChange.deltaEur ?? 0) < 0
    )

    return (
        <div className="relative overflow-hidden rounded-lg">
            <PhotoSlider photos={estate.photos} />
            <div className="pointer-events-none absolute top-3 left-3 z-10 flex gap-1.5">
                {isNew(estate) && (
                    <span className="rounded-xs bg-brand px-2 py-0.5 text-xs font-semibold text-text-on-brand">
                        {t('badge_new')}
                    </span>
                )}
                <span className="rounded-xs bg-surface-page/95 px-2 py-0.5 text-xs font-semibold text-text-base">
                    {isAgency ? t('badge_agency') : t('badge_owner')}
                </span>
                {priceDown && estate.priceChange && (
                    <PriceChangeBadge change={estate.priceChange} currency={currency} variant="compact" />
                )}
            </div>
        </div>
    )
}

function FavoriteIconAction({ estateId, serverIsFavorite }: { estateId: number; serverIsFavorite: boolean }) {
    const t = useTranslations('estate')
    const { isFavorite, toggle, isPending } = useToggleFavorite(estateId, serverIsFavorite)
    return (
        <button
            type="button"
            disabled={isPending}
            onClick={toggle}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-md border border-border bg-surface-page py-2.5 text-xs font-medium transition-colors hover:bg-surface-muted disabled:opacity-70"
        >
            {isPending
                ? <IconLoader size={20} className="animate-spin text-text-muted" />
                : <Heart className={cn('size-5', isFavorite ? 'fill-error text-error' : 'text-text-muted')} />
            }
            <span className={isFavorite && !isPending ? 'text-error' : 'text-text-muted'}>
                {isPending ? t('fav_saving') : isFavorite ? t('fav_in') : t('fav_add')}
            </span>
        </button>
    )
}

function PriceCard({ estate, currency }: { estate: EstateType; currency: DisplayCurrency }) {
    const t = useTranslations('estate')
    const locale = useLocale()
    const { data: auth, isLoading: isAuthLoading } = useAuth()
    const isAuthed = !!auth?.user

    const formatDate = (iso: string | null) => {
        if (!iso) return '—'
        return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    const formatDays = (days: number) => t('days_n', { count: days })

    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface-page p-5 shadow-lg">
            <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                    <PriceDisplay
                        price={estate.price}
                        currency={currency}
                        className="text-3xl font-semibold text-text-base tabular-nums"
                    />
                    {estate.priceChange && (
                        <PriceChangeBadge change={estate.priceChange} currency={currency} variant="compact" />
                    )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-text-muted">
                    <PricePerM2Display price={estate.pricePerM2} currency={currency} className="tabular-nums" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {isAuthLoading ? (
                    <>
                        <IconActionSkeleton />
                        <IconActionSkeleton />
                        <IconActionSkeleton />
                    </>
                ) : (
                    <>
                        {isAuthed && (
                            <>
                                <FavoriteIconAction estateId={estate.id} serverIsFavorite={estate.isFavorite} />
                                <IconAction label={t('action_compare')} icon={<GitCompare className="size-5" />} />
                            </>
                        )}
                        <IconAction label={t('action_share')} icon={<Share2 className="size-5" />} />
                    </>
                )}
            </div>

            {estate.sourceUrl && (
                <a
                    href={estate.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-md border border-border py-2 text-sm font-medium text-text-muted hover:bg-surface-muted"
                >
                    <ExternalLink className="size-4" />
                    {t('source_link_full')}
                </a>
            )}

            {estate.publishedAt && (
                <p className="text-xs text-text-faint">
                    {t('published_info', {
                        date: formatDate(estate.publishedAt),
                        days: formatDays(daysBetween(estate.publishedAt)),
                    })}
                </p>
            )}
        </div>
    )
}

function IconAction({ label, icon }: { label: string; icon: React.ReactNode }) {
    return (
        <button
            type="button"
            className="flex cursor-pointer flex-col items-center gap-1 rounded-md border border-border bg-surface-page py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-muted"
        >
            {icon}
            {label}
        </button>
    )
}

function IconActionSkeleton() {
    return (
        <div
            aria-hidden
            className="h-[68px] animate-shimmer rounded-md"
        />
    )
}

const BACKDROP_STYLE: Record<TransitionStatus, React.CSSProperties> = {
    entering: { opacity: 0 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:   { opacity: 0 },
    unmounted: { opacity: 0 },
}

const CARD_STYLE: Record<TransitionStatus, React.CSSProperties> = {
    entering: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    entered:  { opacity: 1, transform: 'scale(1) translateY(0)' },
    exiting:  { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    exited:   { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    unmounted: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
}

function ContactButton({
    phone,
    sourceUrl,
    sellerLabel,
    sellerName,
    size,
}: {
    phone: string | null
    sourceUrl: string | null
    sellerLabel: string
    sellerName: string
    size: 'lg' | 'md'
}) {
    const t = useTranslations('estate')
    const [open, setOpen] = useState(false)
    const nodeRef = useRef<HTMLDivElement>(null)
    const close = useCallback(() => setOpen(false), [])
    const h = size === 'lg' ? 'h-11' : 'h-10'
    const text = size === 'lg' ? 'text-sm font-semibold' : 'text-sm font-medium'
    const iconSize = size === 'lg' ? 'size-5' : 'size-4'

    useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [open, close])

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`flex ${h} cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-4 ${text} text-text-on-brand hover:bg-[var(--brand-hover)]`}
            >
                <Phone className={iconSize} /> {t('contact_show')}
            </button>
            <Transition nodeRef={nodeRef} in={open} timeout={220} unmountOnExit mountOnEnter>
                {(state) => (
                    <ContactModal
                        nodeRef={nodeRef}
                        transitionState={state}
                        phone={phone}
                        sourceUrl={sourceUrl}
                        sellerLabel={sellerLabel}
                        sellerName={sellerName}
                        onClose={close}
                    />
                )}
            </Transition>
        </>
    )
}

function ContactModal({
    nodeRef,
    transitionState,
    phone,
    sourceUrl,
    sellerLabel,
    sellerName,
    onClose,
}: {
    nodeRef: React.RefObject<HTMLDivElement | null>
    transitionState: TransitionStatus
    phone: string | null
    sourceUrl: string | null
    sellerLabel: string
    sellerName: string
    onClose: () => void
}) {
    const t = useTranslations('estate')
    const [copied, setCopied] = useState(false)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const agencyLabel = t('seller_agency')

    return createPortal(
        <div ref={nodeRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                style={{ ...BACKDROP_STYLE[transitionState], transition: 'opacity 220ms ease-out' }}
                className="absolute inset-0 bg-surface-overlay backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                style={{ ...CARD_STYLE[transitionState], transition: 'opacity 220ms ease-out, transform 220ms cubic-bezier(0.34, 1.4, 0.64, 1)' }}
                className="relative w-full max-w-[380px] rounded-xl border border-border bg-surface-page p-6 shadow-xl"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-text-base">{t('contact_modal_title')}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-muted"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3 border-b border-border pb-4">
                    <div className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold',
                        sellerLabel === agencyLabel
                            ? 'bg-brand-bg text-brand'
                            : 'bg-[var(--success-bg,#f0fdf4)] text-[var(--success-700,#15803d)]',
                    )}>
                        {sellerLabel[0]}
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-text-faint">{sellerLabel}</div>
                        <div className="truncate text-sm font-medium text-text-base">{sellerName}</div>
                    </div>
                </div>

                <div className="pt-4">
                    {phone ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 rounded-lg bg-surface-subtle px-4 py-3">
                                <Phone className="size-5 shrink-0 text-brand" />
                                <span className="text-lg font-semibold tabular-nums tracking-wide text-text-base">
                                    {phone}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                                    className="flex h-10 items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-text-on-brand hover:bg-[var(--brand-hover)]"
                                >
                                    <Phone className="size-4" /> {t('contact_call')}
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(phone)}
                                    className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-border text-sm font-medium text-text-base hover:bg-surface-muted"
                                >
                                    {copied
                                        ? <Check className="size-4 text-[var(--success-700,#15803d)]" />
                                        : <Copy className="size-4" />
                                    }
                                    {copied ? t('contact_copied') : t('contact_copy')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3 rounded-lg bg-surface-subtle px-4 py-3">
                                <PhoneOff className="mt-0.5 size-4 shrink-0 text-text-faint" />
                                <div>
                                    <p className="text-sm font-medium text-text-base">{t('contact_no_phone_title')}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-text-faint">
                                        {t('contact_no_phone_body')}
                                    </p>
                                </div>
                            </div>
                            {sourceUrl && (
                                <div className="grid grid-cols-2 gap-2">
                                    <a
                                        href={sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-3 text-sm font-medium text-text-on-brand hover:bg-[var(--brand-hover)]"
                                    >
                                        <ExternalLink className="size-4" /> realt.by
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(sourceUrl)}
                                        className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-border text-sm font-medium text-text-base hover:bg-surface-muted"
                                    >
                                        {copied
                                            ? <Check className="size-4 text-[var(--success-700,#15803d)]" />
                                            : <Copy className="size-4" />
                                        }
                                        {copied ? t('contact_copied') : t('contact_copy')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <p className="mt-5 text-xs text-text-faint">
                    {t('contact_safety_note')}
                </p>
            </div>
        </div>,
        document.body,
    )
}

function KeyFacts({ estate }: { estate: EstateType }) {
    const t = useTranslations('estate')
    const formatRooms = useFormatRooms()
    const formatArea = useFormatArea()

    const items = [
        { label: t('spec_rooms'), value: String(estate.rooms ?? '—') },
        { label: t('spec_area_total'), value: formatArea(estate.areaTotal) },
        { label: t('spec_storey'), value: formatStorey(estate.storey, estate.storeys) },
        { label: t('spec_year'), value: String(estate.buildingYear ?? '—') },
    ]
    return (
        <section>
            <h1 className="text-2xl font-semibold text-text-base">
                {t('title_flat', { rooms: formatRooms(estate.rooms) })}
                {estate.areaTotal ? `, ${formatArea(estate.areaTotal)}` : ''}
            </h1>
            {estate.address && (
                <div className="mt-1 text-base text-text-muted">{estate.address}</div>
            )}

            <dl className="mt-4 grid grid-cols-4 divide-x divide-border overflow-hidden rounded-lg border border-border bg-surface-page">
                {items.map((i) => (
                    <div key={i.label} className="flex flex-col gap-1 px-4 py-3">
                        <dt className="text-xs text-text-faint">{i.label}</dt>
                        <dd className="text-lg font-semibold text-text-base tabular-nums">{i.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    )
}

function PriceHistoryBlock({ estate, currency }: { estate: EstateType; currency: DisplayCurrency }) {
    const t = useTranslations('estate')
    const locale = useLocale()

    if (estate.priceHistory.length < 2) return null
    const firstDate = estate.priceHistory[0]?.date
    const formattedDate = firstDate
        ? new Date(firstDate).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
        : ''

    return (
        <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface-page p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-text-base">{t('price_history_title')}</h2>
                    <p className="mt-0.5 text-xs text-text-faint">
                        {t('price_history_records', { count: estate.priceHistory.length, date: formattedDate })}
                    </p>
                </div>
                {estate.priceChange && (
                    <div className="shrink-0">
                        <PriceChangeBadge change={estate.priceChange} currency={currency} variant="full" />
                    </div>
                )}
            </div>

            <PriceHistoryChart history={estate.priceHistory} currency={currency} />

            <div className="mt-2 grid max-h-40 grid-cols-2 gap-x-6 gap-y-1.5 overflow-y-auto pr-2">
                {[...estate.priceHistory]
                    .reverse()
                    .slice(0, 8)
                    .map((h, i, arr) => {
                        const prev = pickHistoryValue(arr[i + 1] ?? { date: '', usd: null, byn: null, eur: null }, currency)
                        const cur = pickHistoryValue(h, currency)
                        const delta = prev !== null && cur !== null ? cur - prev : 0
                        return (
                            <div
                                key={h.date + i}
                                className="flex items-baseline justify-between border-b border-border pb-1.5 text-sm"
                            >
                                <span className="text-text-faint tabular-nums">
                                    {new Date(h.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </span>
                                <span className="flex items-baseline gap-2">
                                    <PriceDisplay price={cur} currency={currency} className="text-text-base tabular-nums" />
                                    {delta !== 0 && (
                                        <span
                                            className={cn(
                                                'text-xs font-medium tabular-nums',
                                                delta < 0
                                                    ? 'text-[var(--success-700,#15803d)]'
                                                    : 'text-[var(--danger-700,#be123c)]',
                                            )}
                                        >
                                            {delta < 0 ? '−' : '+'}
                                            {formatNumber(Math.abs(delta))}
                                        </span>
                                    )}
                                </span>
                            </div>
                        )
                    })}
            </div>
        </section>
    )
}

function PriceHistoryChart({ history, currency }: { history: PriceHistoryPoint[]; currency: DisplayCurrency }) {
    const t = useTranslations('estate')
    const locale = useLocale()
    const width = 640
    const height = 160
    const padL = 48, padR = 12, padT = 10, padB = 22

    const points = history
        .map((h) => ({ date: h.date, v: pickHistoryValue(h, currency) }))
        .filter((p): p is { date: string; v: number } => p.v !== null)

    if (points.length < 2) return null

    const min = Math.min(...points.map((p) => p.v))
    const max = Math.max(...points.map((p) => p.v))
    const span = max - min || 1
    const chartW = width - padL - padR
    const chartH = height - padT - padB
    const stepX = chartW / (points.length - 1)

    const coords = points.map((p, i) => ({
        x: padL + i * stepX,
        y: padT + chartH - ((p.v - min) / span) * chartH,
        v: p.v,
    }))

    const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')
    const area = `${line} L${coords[coords.length - 1].x},${padT + chartH} L${coords[0].x},${padT + chartH} Z`
    const down = points[points.length - 1].v < points[0].v
    const stroke = down ? '#16a34a' : '#dc2626'
    const fill = down ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)'
    const midIdx = Math.floor(points.length / 2)
    const suffix = t('chart_thousands_suffix')

    const formatChartDate = (iso: string) =>
        new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={t('chart_aria')}>
            {[0, 0.5, 1].map((tVal) => {
                const y = padT + chartH * tVal
                const value = Math.round(max - span * tVal)
                return (
                    <g key={tVal}>
                        <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="2 3" />
                        <text x={padL - 6} y={y + 3} textAnchor="end" fill="#64748B" fontSize="10" className="tabular-nums">
                            {(value / 1000).toFixed(0)}{suffix}
                        </text>
                    </g>
                )
            })}

            <path d={area} fill={fill} />
            <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

            {coords.map((c, i) => (
                <circle
                    key={i}
                    cx={c.x}
                    cy={c.y}
                    r={i === coords.length - 1 ? 4 : 2.5}
                    fill={i === coords.length - 1 ? stroke : '#ffffff'}
                    stroke={stroke}
                    strokeWidth="1.5"
                />
            ))}

            {[0, midIdx, coords.length - 1].map((i) => (
                <text
                    key={i}
                    x={coords[i].x}
                    y={height - 6}
                    textAnchor={i === 0 ? 'start' : i === coords.length - 1 ? 'end' : 'middle'}
                    fill="#64748B"
                    fontSize="10"
                    className="tabular-nums"
                >
                    {formatChartDate(points[i].date)}
                </text>
            ))}
        </svg>
    )
}

function Description({ estate }: { estate: EstateType }) {
    const t = useTranslations('estate')
    if (!estate.description) return null
    return (
        <section className="rounded-lg border border-border bg-surface-page p-5">
            <h2 className="mb-3 text-lg font-semibold text-text-base">{t('description_title')}</h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-text-muted">
                {estate.description}
            </p>
        </section>
    )
}

function SpecsGrid({ estate }: { estate: EstateType }) {
    const t = useTranslations('estate')
    const locale = useLocale()
    const wallLabels = useWallMaterialLabels()
    const repairLabels = useRepairStateLabels()
    const formatArea = useFormatArea()

    const formatDate = (iso: string | null) => {
        if (!iso) return '—'
        return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    const formatDays = (days: number) => t('days_n', { count: days })

    const groups: { title: string; rows: [string, string][] }[] = [
        {
            title: t('specs_group_flat'),
            rows: [
                [t('spec_rooms'), String(estate.rooms ?? '—')],
                [t('spec_area_total'), formatArea(estate.areaTotal)],
                [t('spec_area_living'), formatArea(estate.areaLiving)],
                [t('spec_area_kitchen'), formatArea(estate.areaKitchen)],
                [t('spec_repair'), estate.repairState != null ? (repairLabels[estate.repairState] ?? '—') : '—'],
            ],
        },
        {
            title: t('specs_group_building'),
            rows: [
                [t('spec_storey'), formatStorey(estate.storey, estate.storeys)],
                [t('spec_year'), String(estate.buildingYear ?? '—')],
                [t('spec_wall'), estate.wallMaterial != null ? (wallLabels[estate.wallMaterial] ?? '—') : '—'],
                [t('spec_district'), estate.districtName ?? '—'],
            ],
        },
        {
            title: t('specs_group_publication'),
            rows: [
                [t('spec_published'), formatDate(estate.publishedAt)],
                [t('spec_on_market'), estate.publishedAt ? formatDays(daysBetween(estate.publishedAt)) : '—'],
                [t('spec_seller'), estate.sellerType === 0 && estate.agencyName ? t('seller_agency') : t('seller_owner_short')],
                [t('spec_source'), 'realt.by'],
                [t('spec_price_changes'), estate.priceChange ? String(estate.priceChange.changes) : '0'],
            ],
        },
    ]

    return (
        <section className="rounded-lg border border-border bg-surface-page p-6">
            <div className="mb-5 flex items-center gap-2">
                <Ruler className="size-4 text-text-faint" aria-hidden />
                <h2 className="text-lg font-semibold text-text-base">{t('specs_title')}</h2>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-8">
                {groups.map((g) => (
                    <div key={g.title}>
                        <div className="mb-3 text-xs font-medium tracking-wide text-text-faint uppercase">
                            {g.title}
                        </div>
                        <dl className="flex flex-col divide-y divide-border">
                            {g.rows.map(([label, value]) => (
                                <div key={label} className="flex items-baseline justify-between gap-3 py-3">
                                    <dt className="shrink-0 text-sm text-text-faint">{label}</dt>
                                    <dd className="min-w-0 text-right text-sm text-text-base tabular-nums">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                ))}
            </div>
            <p className="mt-5 text-xs text-text-faint">
                {t('specs_null_note')}
            </p>
        </section>
    )
}

function LocationSection({ estate, currency: _currency }: { estate: EstateType; currency: DisplayCurrency }) {
    const t = useTranslations('estate')

    return (
        <section className="rounded-lg border border-border bg-surface-page p-5">
            <div className="mb-3 flex items-center gap-2">
                <Building2 className="size-4 text-text-faint" aria-hidden />
                <h2 className="text-lg font-semibold text-text-base">{t('location_title')}</h2>
            </div>
            {estate.address && <div className="text-base text-text-base">{estate.address}</div>}
            {estate.districtName && (
                <div className="mt-0.5 text-sm text-text-muted">{t('district_suffix', { name: estate.districtName })}</div>
            )}

            {estate.lat != null && estate.lng != null && (
                <div className="relative mt-4 aspect-[16/6] overflow-hidden rounded-md border border-border">
                    <PropertyMiniMap lat={estate.lat} lng={estate.lng} />
                </div>
            )}

            {estate.metroStation && (
                <div className="mt-4">
                    <div className="mb-2 text-xs font-medium tracking-wide text-text-faint uppercase">
                        {t('location_metro_label')}
                    </div>
                    <ul className="flex flex-col divide-y divide-border">
                        <li className="flex items-center justify-between gap-3 py-2">
                            <span className="flex items-center gap-2 text-sm text-text-base">
                                <Train className="size-4 text-text-faint" aria-hidden />
                                {estate.metroStation}
                            </span>
                            {estate.metroTime !== null && (
                                <span className="text-sm text-text-muted tabular-nums">
                                    {t('location_metro_walk', { time: estate.metroTime })}
                                </span>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </section>
    )
}

function SellerCard({ estate }: { estate: EstateType }) {
    const t = useTranslations('estate')
    const isAgency = estate.sellerType === 0 && !!estate.agencyName
    const sellerLabel = isAgency ? t('seller_agency') : t('seller_owner_short')
    const sellerName = isAgency ? (estate.agencyName ?? '') : t('seller_private')

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-page p-5">
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        'flex size-12 items-center justify-center rounded-xl text-base font-semibold',
                        isAgency
                            ? 'bg-brand-bg text-brand'
                            : 'bg-[var(--success-bg,#f0fdf4)] text-[var(--success-700,#15803d)]',
                    )}
                >
                    {sellerLabel[0]}
                </div>
                <div className="min-w-0">
                    <div className="text-xs text-text-faint">{sellerLabel}</div>
                    <div className="truncate text-base font-medium text-text-base">{sellerName}</div>
                </div>
            </div>
            <ContactButton
                phone={estate.phone ?? null}
                sourceUrl={estate.sourceUrl}
                sellerLabel={sellerLabel}
                sellerName={sellerName}
                size="md"
            />
            <p className="text-xs text-text-faint">
                {t('seller_contacts_note_full')}
            </p>
        </div>
    )
}

function SafetyNote() {
    const t = useTranslations('estate')
    return (
        <div className="rounded-lg border border-border bg-surface-subtle p-4 text-xs leading-relaxed text-text-faint">
            <Bell className="mb-1.5 inline-block size-4 text-text-faint" aria-hidden />{' '}
            {t('safety_note')}
        </div>
    )
}

function Disclaimer({ estate }: { estate: EstateType }) {
    const t = useTranslations('estate')
    return (
        <footer className="border-t border-border pt-4 text-xs leading-relaxed text-text-faint">
            {t('disclaimer', { id: estate.id })}
        </footer>
    )
}
