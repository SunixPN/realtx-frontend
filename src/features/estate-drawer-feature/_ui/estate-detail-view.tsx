'use client'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Heart, Maximize2, Train, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEstateById, useWallMaterialLabels, useRepairStateLabels, useFormatRooms, useFormatArea } from '@/entities/estate'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { useToggleFavorite } from '@/features/favorite-toggle-feature'
import { PhotoSlider } from './photo-slider'
import { PriceDisplay, PricePerM2Display } from './price-display'
import { PriceChangeBadge } from './price-change-badge'
import { PriceHistorySection } from './price-history-section'
import { formatStorey } from './format'
import { useAuth } from "@/entities/me/api/auth-query";
import { IconLoader } from "@/shared/ui/ui-icons";
import { cn } from '@/shared/helpers/cn';
import { useBottomSheetDrag } from '@/shared/ui/ui-bottom-sheet';
type Props = {
    id: number
    onBack?: () => void
    onClose: () => void
    showBack: boolean
}
function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-2">
            <dt className="shrink-0 text-sm text-[var(--text-faint)]">{label}</dt>
            <dd className="min-w-0 text-right text-sm text-[var(--text-base)]">{value}</dd>
        </div>
    )
}
export function EstateDetailView({ id, onBack, onClose, showBack }: Props) {
    const t = useTranslations('estate')
    const { currency } = useDisplayCurrency()
    const { data: estate, isLoading: isPending, error } = useEstateById(id, currency)
    const isError = !!error
    const { data, isLoading } = useAuth()
    const { isFavorite, toggle, isPending: favPending } = useToggleFavorite(id, estate?.isFavorite ?? false)
    const wallLabels = useWallMaterialLabels()
    const repairLabels = useRepairStateLabels()
    const formatRooms = useFormatRooms()
    const formatArea = useFormatArea()
    const drag = useBottomSheetDrag()
    return (
        <div className="flex h-full flex-col">
            <header
                {...(drag?.handlers ?? {})}
                style={drag?.style}
                className="flex shrink-0 items-center gap-2 border-b border-[var(--border-default)] px-3 py-2.5"
            >
                {showBack ? (
                    <button
                        type="button"
                        aria-label={t('back_aria')}
                        onClick={onBack}
                        className="flex size-9 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                ) : (
                    <div className="size-9 shrink-0" />
                )}
                <span className="flex-1 truncate text-base font-medium text-[var(--text-base)]">
                    {estate ? t('title_flat', { rooms: formatRooms(estate.rooms) }) : t('title_fallback')}
                </span>
                <button
                    type="button"
                    aria-label={t('close_aria')}
                    onClick={onClose}
                    className="flex size-9 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                >
                    <X className="size-5" />
                </button>
            </header>
            <div className="flex-1 overflow-y-auto">
                {isError && (
                    <div className="m-4 rounded-md bg-[var(--error-bg)] p-3 text-sm text-[var(--error)]">
                        {t('error_load')}
                    </div>
                )}
                <PhotoSlider photos={estate?.photos ?? []} loading={isPending} />
                {estate && (
                    <div className="flex flex-col gap-5 p-4">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <PriceDisplay
                                    price={estate.price}
                                    currency={currency}
                                    className="text-3xl font-semibold text-[var(--text-base)]"
                                />
                                {estate.priceChange && (
                                    <PriceChangeBadge
                                        change={estate.priceChange}
                                        currency={currency}
                                        variant="compact"
                                    />
                                )}
                            </div>
                            <div className="mt-1">
                                <PricePerM2Display
                                    price={estate.pricePerM2}
                                    currency={currency}
                                    className="text-sm text-[var(--text-muted)]"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {
                                isLoading ? (
                                    <div
                                        aria-label={t('auth_checking_aria')}
                                        className="flex size-9 items-center justify-center rounded-xl self-center text-text-muted"
                                    >
                                        <IconLoader size={18} />
                                    </div>
                                ) : (
                                    <>
                                        {data?.user ? (
                                            <button
                                                type="button"
                                                disabled={favPending}
                                                onClick={toggle}
                                                className={cn(
                                                    'flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-70 cursor-pointer',
                                                    isFavorite
                                                        ? 'border border-[var(--border-default)] text-[var(--text-base)] hover:bg-[var(--surface-muted)]'
                                                        : 'bg-[var(--brand)] text-[var(--text-on-brand)] hover:bg-[var(--brand-hover)]',
                                                )}
                                            >
                                                {favPending ? (
                                                    <IconLoader size={18} className="animate-spin" />
                                                ) : (
                                                    <Heart className={cn('size-5 shrink-0', isFavorite && 'fill-current')} aria-hidden />
                                                )}
                                                {favPending ? t('fav_saving') : isFavorite ? t('fav_in') : t('fav_add')}
                                            </button>
                                        ) : <></>}
                                    </>
                                )
                            }
                            <Link
                                href={`/property/${estate.id}?currency=${currency}`}
                                className="flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--border-default)] px-4 text-sm font-medium text-[var(--text-base)] hover:bg-[var(--surface-muted)]"
                            >
                                <Maximize2 className="size-4" /> {t('open_full')}
                            </Link>
                            {estate.sourceUrl && (
                                <a
                                    href={estate.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--border-default)] px-4 text-sm font-medium text-[var(--text-base)] hover:bg-[var(--surface-muted)]"
                                >
                                    <ExternalLink className="size-4" /> {t('source_link')}
                                </a>
                            )}
                        </div>
                        <div>
                            {estate.address && (
                                <div className="text-base text-[var(--text-base)]">{estate.address}</div>
                            )}
                            {estate.metroStation && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                    <Train className="size-4 text-[var(--text-faint)]" aria-hidden />
                                    {estate.metroStation}
                                    {estate.districtName && (
                                        <span className="text-[var(--text-faint)]">· {estate.districtName}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <PriceHistorySection
                            history={estate.priceHistory}
                            priceChange={estate.priceChange}
                            currency={currency}
                        />
                        <section>
                            <h3 className="mb-1 text-base font-semibold text-[var(--text-base)]">{t('section_specs')}</h3>
                            <dl className="divide-y divide-[var(--border-default)]">
                                <Row label={t('spec_rooms')} value={String(estate.rooms ?? '—')} />
                                <Row label={t('spec_area_total')} value={formatArea(estate.areaTotal)} />
                                <Row label={t('spec_area_living')} value={formatArea(estate.areaLiving)} />
                                <Row label={t('spec_area_kitchen')} value={formatArea(estate.areaKitchen)} />
                                <Row label={t('spec_storey')} value={formatStorey(estate.storey, estate.storeys)} />
                                <Row label={t('spec_year')} value={String(estate.buildingYear ?? '—')} />
                                <Row
                                    label={t('spec_wall')}
                                    value={estate.wallMaterial != null ? (wallLabels[estate.wallMaterial] ?? '—') : '—'}
                                />
                                <Row
                                    label={t('spec_repair')}
                                    value={estate.repairState != null ? (repairLabels[estate.repairState] ?? '—') : '—'}
                                />
                            </dl>
                        </section>
                        {estate.description && (
                            <section>
                                <h3 className="mb-2 text-base font-semibold text-[var(--text-base)]">{t('section_description')}</h3>
                                <p className="text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-line">
                                    {estate.description}
                                </p>
                            </section>
                        )}
                        <section className="rounded-lg bg-[var(--surface-muted)] p-4">
                            <div className="text-sm text-[var(--text-faint)]">
                                {(estate.sellerType === 0 && estate.agencyName) ? t('seller_agency') : t('seller_owner')}
                            </div>
                            {estate.sellerType === 0 && estate.agencyName && (
                                <div className="mt-0.5 text-base font-medium text-[var(--text-base)]">
                                    {estate.agencyName}
                                </div>
                            )}
                            <p className="mt-2 text-xs text-[var(--text-faint)]">
                                {t('seller_contacts_note')}
                            </p>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
