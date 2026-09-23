'use client'
import { useRef } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useHouseEstates, type HouseBbox } from '@/entities/estate'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { useEstateFilters } from '@/features/main-map-filters-feature/_hooks/use-estate-filters'
import { useBottomSheetDrag } from '@/shared/ui/ui-bottom-sheet'
import { UISkeleton } from '@/shared/ui/ui-skeleton'
import { EstateListCard } from './estate-list-card'

type Props = {
    bbox: HouseBbox
    onSelect: (id: number, center: [number, number]) => void
    onClose: () => void
}

const SKELETON_COUNT = 6
const ITEM_GAP = 12 // gap-3 = 12px

export function HouseListView({ bbox, onSelect, onClose }: Props) {
    const t = useTranslations('estate')
    const { currency } = useDisplayCurrency()
    const { filters } = useEstateFilters()
    const { data, isLoading: isPending, error } = useHouseEstates(bbox, filters, currency)
    const isError = !!error
    const items = data?.items ?? []
    const drag = useBottomSheetDrag()
    const scrollRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 116,
        overscan: 4,
        paddingStart: 16,
        paddingEnd: 16,
        gap: ITEM_GAP,
        measureElement:
            typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
                ? (el) => el.getBoundingClientRect().height
                : undefined,
    })

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

            {}
            {isError && (
                <div className="m-4 rounded-md bg-[var(--error-bg)] p-3 text-sm text-[var(--error)]">
                    {t('house_error')}
                </div>
            )}
            {isPending && (
                <div className="flex flex-col gap-3 p-4">
                    {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}
            {!isError && !isPending && items.length === 0 && (
                <div className="px-4 pt-4 text-sm text-[var(--text-muted)]">{t('house_empty')}</div>
            )}

            {}
            {!isError && !isPending && items.length > 0 && (
                <div ref={scrollRef} data-kb-freeze className="flex-1 overflow-y-auto overscroll-contain">
                    <div
                        style={{
                            height: virtualizer.getTotalSize(),
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {virtualizer.getVirtualItems().map((vi) => {
                            const it = items[vi.index]
                            return (
                                <div
                                    key={vi.key}
                                    data-index={vi.index}
                                    ref={virtualizer.measureElement}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        transform: `translateY(${vi.start}px)`,
                                        paddingLeft: 16,
                                        paddingRight: 16,
                                    }}
                                >
                                    <EstateListCard
                                        item={it}
                                        onClick={() => onSelect(it.id, [midLng(bbox), midLat(bbox)])}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="flex gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-3">
            <UISkeleton className="size-24 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-2 py-0.5">
                <UISkeleton className="h-5 w-28" />
                <UISkeleton className="h-3.5 w-20" />
                <UISkeleton className="h-4 w-40" />
                <UISkeleton className="h-3.5 w-32" />
            </div>
        </div>
    )
}

function midLng(b: HouseBbox) { return (b.minLng + b.maxLng) / 2 }
function midLat(b: HouseBbox) { return (b.minLat + b.maxLat) / 2 }
