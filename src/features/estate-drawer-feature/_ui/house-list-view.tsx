'use client'

import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { houseEstatesQuery, type HouseBbox } from '@/entities/estate'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { useEstateFilters } from '@/features/main-map-filters-feature/_hooks/use-estate-filters'
import { EstateListCard } from './estate-list-card'

type Props = {
    bbox: HouseBbox
    onSelect: (id: number, center: [number, number]) => void
    onClose: () => void
}

export function HouseListView({ bbox, onSelect, onClose }: Props) {
    const { currency } = useDisplayCurrency()
    const { filters } = useEstateFilters()
    const { data, isPending, isError } = useQuery(houseEstatesQuery(bbox, filters, currency))
    const items = data?.items ?? []

    return (
        <div className="flex h-full flex-col">
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border-default)] px-4 py-3">
                <div>
                    <div className="text-base font-semibold text-[var(--text-base)]">
                        {isPending ? 'Загрузка…' : `${items.length} ${plural(items.length, ['квартира', 'квартиры', 'квартир'])} в этом доме`}
                    </div>
                    <div className="text-xs text-[var(--text-faint)]">Кликните на квартиру, чтобы посмотреть детали</div>
                </div>
                <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={onClose}
                    className="flex size-9 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                >
                    <X className="size-5" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
                {isError && (
                    <div className="rounded-md bg-[var(--error-bg)] p-3 text-sm text-[var(--error)]">
                        Не удалось загрузить квартиры в этом доме.
                    </div>
                )}
                {!isError && !isPending && items.length === 0 && (
                    <div className="text-sm text-[var(--text-muted)]">В этом доме нет объектов по текущим фильтрам.</div>
                )}
                <div className="flex flex-col gap-3">
                    {items.map((it) => (
                        <EstateListCard
                            key={it.id}
                            item={it}
                            onClick={() => onSelect(it.id, [midLng(bbox), midLat(bbox)])}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function midLng(b: HouseBbox) {
    return (b.minLng + b.maxLng) / 2
}
function midLat(b: HouseBbox) {
    return (b.minLat + b.maxLat) / 2
}

function plural(n: number, forms: [string, string, string]) {
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod10 === 1 && mod100 !== 11) return forms[0]
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
    return forms[2]
}
