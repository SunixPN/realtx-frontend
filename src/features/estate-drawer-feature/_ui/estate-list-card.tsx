'use client'

import { ImageOff, Train } from 'lucide-react'
import { getThumbPhoto, type EstateShortType } from '@/entities/estate'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { PriceDisplay, PricePerM2Display } from './price-display'
import { formatArea, formatRooms, formatStorey } from './format'

type Props = {
    item: EstateShortType
    onClick: () => void
}

export function EstateListCard({ item, onClick }: Props) {
    const { currency } = useDisplayCurrency()
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-3 text-left transition hover:border-[var(--brand)] hover:shadow-sm"
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
                    {formatRooms(item.rooms)} · {formatArea(item.areaTotal)} · этаж {formatStorey(item.storey, item.storeys)}
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
                        {item.metroTime != null && <span>· {item.metroTime} мин</span>}
                    </div>
                )}
            </div>
        </button>
    )
}
