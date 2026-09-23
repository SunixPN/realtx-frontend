'use client'
import { Check, ImageOff, Train, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { useRemoveFavorite, type FavoriteItemType } from '@/entities/favorite'
import { useFormatRooms, useFormatArea } from '@/entities/estate'
import { formatNumber, formatStorey } from '../../estate-drawer-feature/_ui/format'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
type FavoriteCardProps = {
    item: FavoriteItemType
    selected: boolean
    onToggleSelect: (id: number) => void
}
function formatPrice(price: number | null, currency: number): React.ReactNode {
    if (price == null) return '—'
    const formatted = formatNumber(price)
    if (currency === 933) return <>{formatted}<BynSign /></>
    const sym = currency === 840 ? '$' : '€'
    return `${formatted} ${sym}`
}
function formatPricePerM2(price: number | null, currency: number): React.ReactNode {
    if (price == null) return null
    return <>{formatPrice(Math.round(price), currency)} / м²</>
}
function formatPriceDeltaUsd(delta: number): string {
    const sign = delta < 0 ? '−' : '+'
    return `${sign}${Math.abs(delta).toLocaleString()} $`
}
export function FavoriteCard({ item, selected, onToggleSelect }: FavoriteCardProps) {
    const t = useTranslations('favorites')
    const tEstate = useTranslations('estate')
    const formatRooms = useFormatRooms()
    const formatArea = useFormatArea()
    const { trigger: remove, isMutating: isPending } = useRemoveFavorite()
    const photo = item.photos[0]
    const delta = item.priceDeltaUsd
    const hasDelta = delta !== null && delta !== 0
    const isDrop = hasDelta && delta! < 0
    return (
        <div className={cn('relative h-full', isPending && 'opacity-50 pointer-events-none transition-opacity')}>
            <Link
                href={`/property/${item.id}`}
                className={cn(
                    'flex h-full flex-col overflow-hidden rounded-lg border transition-shadow',
                    selected
                        ? 'border-brand ring-2 ring-brand/20 shadow-md'
                        : 'border-border bg-surface-raised hover:shadow-md',
                    !item.isActive && 'opacity-60',
                )}
            >
                {}
                <div className="relative aspect-[4/3] w-full shrink-0 bg-surface-muted sm:aspect-auto sm:h-[220px]">
                    {photo ? (
                        <img
                            src={photo}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            width={640}
                            height={480}
                            className="absolute inset-0 size-full object-cover"
                        />
                    ) : (
                        <div className="flex size-full flex-col items-center justify-center gap-1.5 text-text-faint">
                            <ImageOff className="size-7" aria-hidden />
                            <span className="text-xs">{t('no_photos')}</span>
                        </div>
                    )}
                    {}
                    {!item.isActive && (
                        <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 sm:left-auto sm:right-3 sm:top-3 sm:translate-x-0">
                            <span className="inline-flex items-center gap-1 rounded-xs bg-neutral-900/85 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm sm:gap-1.5 sm:text-xs">
                                <X className="size-3" />
                                {t('delisted')}
                            </span>
                        </div>
                    )}
                    {}
                    {hasDelta && (
                        <div className="absolute left-2 bottom-2 z-10">
                            <span
                                className={cn(
                                    'rounded-xs px-2 py-0.5 text-xs font-medium text-white',
                                    isDrop ? 'bg-success' : 'bg-error',
                                )}
                            >
                                {formatPriceDeltaUsd(delta!)}
                            </span>
                        </div>
                    )}
                    {}
                    {item.photos.length > 1 && (
                        <span className="absolute right-2 bottom-2 rounded-xs bg-neutral-900/70 px-1.5 py-0.5 text-xs font-medium text-white tabular-nums">
                            {t('photo_count', { count: item.photos.length })}
                        </span>
                    )}
                </div>
                {}
                <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
                    <div className="flex items-baseline justify-between gap-3">
                        <span className="text-base font-semibold text-text-base tabular-nums sm:text-lg">
                            {formatPrice(item.price, item.priceCurrency)}
                        </span>
                        <span className="text-xs text-text-faint tabular-nums">
                            {formatPricePerM2(item.pricePerM2, item.priceCurrency)}
                        </span>
                    </div>
                    <div className="text-sm text-text-muted">
                        {formatRooms(item.rooms)} · {formatArea(item.areaTotal)} · {formatStorey(item.storey, item.storeys)}
                    </div>
                    {item.address && (
                        <div className="truncate text-sm text-text-muted">{item.address}</div>
                    )}
                    {item.metroStation && (
                        <div className="flex items-center gap-1 text-xs text-text-faint">
                            <Train className="size-3.5 shrink-0" aria-hidden />
                            {item.metroStation}
                            {item.metroTime != null && <span>· {tEstate('metro_min', { time: item.metroTime })}</span>}
                        </div>
                    )}
                    {(item.sellerType === 0 && item.agencyName) && (
                        <div className="mt-1 border-t border-border pt-2 text-xs text-text-faint">
                            {tEstate('seller_agency')}
                        </div>
                    )}
                </div>
            </Link>
            {}
            <label
                className={cn(
                    'absolute top-2 left-2 z-10 flex size-7 cursor-pointer items-center justify-center rounded-sm border-2 shadow-sm transition-colors sm:top-3 sm:left-3 sm:size-6',
                    selected
                        ? 'border-brand bg-brand text-white'
                        : 'border-white bg-surface-raised/90 text-transparent hover:text-text-muted',
                )}
                onClick={(e) => { e.preventDefault(); onToggleSelect(item.id) }}
                aria-label={selected ? t('deselect_aria') : t('select_aria')}
            >
                <Check className="size-4 sm:size-3.5" strokeWidth={3} aria-hidden />
            </label>
            {}
            <button
                type="button"
                aria-label={t('remove_aria')}
                onClick={(e) => { e.preventDefault(); remove(item.id) }}
                className="absolute top-2 right-2 z-10 flex size-9 cursor-pointer items-center justify-center rounded-md bg-surface-raised/90 text-error shadow-sm backdrop-blur-sm transition-transform hover:bg-surface-raised hover:scale-110 active:scale-90 sm:top-3 sm:right-3 sm:size-8"
            >
                <svg viewBox="0 0 24 24" className="size-5 fill-error text-error" aria-hidden>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            </button>
        </div>
    )
}
