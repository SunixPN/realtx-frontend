'use client'

import { ImageOff, Train } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getThumbPhoto, type EstateShortType, useFormatRooms, useFormatArea } from '@/entities/estate'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { FavoriteHeartButton } from '@/features/favorite-toggle-feature'
import { PriceDisplay, PricePerM2Display } from './price-display'
import { formatStorey } from './format'

type Props = {
    item: EstateShortType
    onClick: () => void
}

export function EstateListCard({ item, onClick }: Props) {
    const t = useTranslations('estate')
    const { currency } = useDisplayCurrency()
    const formatRooms = useFormatRooms()
    const formatArea = useFormatArea()

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
            className="group flex w-full cursor-pointer gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-3 text-left transition hover:border-[var(--brand)] hover:shadow-sm"
        >
            <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-[var(--surface-muted)]">
                {item.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getThumbPhoto(item.photo)} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                ) : (
                    <div className="flex size-full items-center justify-center text-[var(--text-faint)]">
                        <ImageOff className="size-6" aria-hidden />
                    </div>
                )}
                <FavoriteHeartButton
                    estateId={item.id}
                    isFavorite={item.isFavorite}
                    className="absolute top-1 right-1 !size-7 rounded-sm shadow-none"
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
                <PriceDisplay
                    price={item.price}
                    currency={currency}
                    className="text-lg font-semibold text-[var(--text-base)]"
                />
                <PricePerM2Display
                    price={item.pricePerM2}
                    currency={currency}
                    className="text-xs text-[var(--text-faint)]"
                />
                <div className="mt-1 text-sm text-[var(--text-muted)]">
                    {formatRooms(item.rooms)} · {formatArea(item.areaTotal)} · {t('storey_label')} {formatStorey(item.storey, item.storeys)}
                </div>
                {item.address && (
                    <div className="mt-1 truncate text-xs text-[var(--text-muted)]" title={item.address}>
                        {item.address}
                    </div>
                )}
                {item.metroStation && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-[var(--text-faint)]">
                        <Train className="size-3" aria-hidden />
                        {item.metroStation}
                        {item.metroTime != null && <span>· {t('metro_min', { time: item.metroTime })}</span>}
                    </div>
                )}
            </div>
        </div>
    )
}
