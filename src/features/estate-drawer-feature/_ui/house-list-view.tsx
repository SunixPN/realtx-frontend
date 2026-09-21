'use client'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useHouseEstates, type HouseBbox } from '@/entities/estate'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { useEstateFilters } from '@/features/main-map-filters-feature/_hooks/use-estate-filters'
import { useBottomSheetDrag } from '@/shared/ui/ui-bottom-sheet'
import { EstateListCard } from './estate-list-card'
type Props = {
    bbox: HouseBbox
    onSelect: (id: number, center: [number, number]) => void
    onClose: () => void
}
export function HouseListView({ bbox, onSelect, onClose }: Props) {
    const t = useTranslations('estate')
    const { currency } = useDisplayCurrency()
    const { filters } = useEstateFilters()
    const { data, isLoading: isPending, error } = useHouseEstates(bbox, filters, currency)
    const isError = !!error
    const items = data?.items ?? []
    const drag = useBottomSheetDrag()
    return (
        <div className="flex h-full flex-col">
            <header
                {...(drag?.handlers ?? {})}
                style={drag?.style}
                className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border-default)] px-4 py-3"
            >
                <div>
                    <div className="text-base font-semibold text-[var(--text-base)]">
                        {isPending ? t('house_loading') : t('house_count', { count: items.length })}
                    </div>
                    <div className="text-xs text-[var(--text-faint)]">{t('house_click_hint')}</div>
                </div>
                <button
                    type="button"
                    aria-label={t('close_aria')}
                    onClick={onClose}
                    className="flex size-9 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                >
                    <X className="size-5" />
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
                {isError && (
                    <div className="rounded-md bg-[var(--error-bg)] p-3 text-sm text-[var(--error)]">
                        {t('house_error')}
                    </div>
                )}
                {!isError && !isPending && items.length === 0 && (
                    <div className="text-sm text-[var(--text-muted)]">{t('house_empty')}</div>
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
