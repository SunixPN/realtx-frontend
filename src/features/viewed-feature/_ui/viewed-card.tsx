'use client'
import { ImageOff, Train, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { useRemoveViewed, type ViewedItemType } from '@/entities/viewed'
import { useFormatRooms, useFormatArea } from '@/entities/estate'
import { formatNumber, formatStorey } from '../../estate-drawer-feature/_ui/format'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { FavoriteHeartButton } from '@/features/favorite-toggle-feature/_ui/favorite-heart-button'

type ViewedCardProps = { item: ViewedItemType }

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

export function ViewedCard({ item }: ViewedCardProps) {
    const t = useTranslations('viewed')
    const tFav = useTranslations('favorites')
    const tEstate = useTranslations('estate')
    const formatRooms = useFormatRooms()
    const formatArea = useFormatArea()
    const { trigger: remove, isMutating: isPending } = useRemoveViewed()

    const photo = item.photos[0]

    return (
        <div className={cn('relative h-full', isPending && 'opacity-50 pointer-events-none transition-opacity')}>
            <Link
                href={`/property/${item.id}`}
                className={cn(
                    'flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface-raised transition-shadow hover:shadow-md',
                    !item.isActive && 'opacity-60',
                )}
            >
                {/* Приглушённое фото — маркер visited-состояния (см. дизайн-референс). */}
                <div className="relative aspect-[4/3] w-full shrink-0 bg-surface-muted sm:aspect-auto sm:h-[220px]">
                    {photo ? (
                        <img
                            src={photo}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            width={640}
                            height={480}
                            className="absolute inset-0 size-full object-cover opacity-70"
                        />
                    ) : (
                        <div className="flex size-full flex-col items-center justify-center gap-1.5 text-text-faint">
                            <ImageOff className="size-7" aria-hidden />
                            <span className="text-xs">{tFav('no_photos')}</span>
                        </div>
                    )}
                    {!item.isActive && (
                        <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 sm:left-auto sm:right-3 sm:top-3 sm:translate-x-0">
                            <span className="inline-flex items-center gap-1 rounded-xs bg-neutral-900/85 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm sm:gap-1.5 sm:text-xs">
                                <X className="size-3" />
                                {tFav('delisted')}
                            </span>
                        </div>
                    )}
                    {item.photos.length > 1 && (
                        <span className="absolute right-2 bottom-2 rounded-xs bg-neutral-900/70 px-1.5 py-0.5 text-xs font-medium text-white tabular-nums">
                            {tFav('photo_count', { count: item.photos.length })}
                        </span>
                    )}
                </div>
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
            {/* Сердечко — добавить/убрать из избранного. Не мешает переходу на деталку. */}
            <FavoriteHeartButton
                estateId={item.id}
                isFavorite={item.isFavorite}
                className="absolute top-2 left-2 z-10 sm:top-3 sm:left-3"
            />
            {/* Кнопка удаления из истории. */}
            <button
                type="button"
                aria-label={t('remove_aria')}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(item.id).catch(() => {}) }}
                className="absolute top-2 right-2 z-10 flex size-9 cursor-pointer items-center justify-center rounded-md bg-surface-raised/90 text-text-muted shadow-sm backdrop-blur-sm transition-colors hover:text-error sm:top-3 sm:right-3 sm:size-8"
            >
                <X className="size-5" aria-hidden />
            </button>
        </div>
    )
}
