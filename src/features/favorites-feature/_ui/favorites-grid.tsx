'use client'

import type { FavoriteItemType } from '@/entities/favorite'
import { UISkeleton } from '@/shared/ui/ui-skeleton/ui-skeleton'
import { FavoriteCard } from './favorite-card'

type FavoritesGridProps = {
    items: FavoriteItemType[]
    selected: Set<number>
    onToggleSelect: (id: number) => void
    isLoading: boolean
}

const SKELETON_COUNT = 6

function FavoriteCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
            <UISkeleton className="aspect-[4/3] w-full rounded-none sm:aspect-auto sm:h-[220px]" />
            <div className="flex flex-col gap-2 p-3 sm:p-4">
                <div className="flex items-baseline justify-between gap-3">
                    <UISkeleton className="h-5 w-24 sm:h-6 sm:w-28" />
                    <UISkeleton className="h-4 w-16 sm:w-20" />
                </div>
                <UISkeleton className="h-4 w-40" />
                <UISkeleton className="h-4 w-3/4" />
                <UISkeleton className="h-3.5 w-1/2" />
                <div className="mt-1 border-t border-border pt-2">
                    <UISkeleton className="h-3.5 w-16" />
                </div>
            </div>
        </div>
    )
}

const GRID_CLS = 'grid grid-cols-1 gap-3 min-[660px]:grid-cols-2 md:gap-4 lg:grid-cols-3'

export function FavoritesGrid({ items, selected, onToggleSelect, isLoading }: FavoritesGridProps) {
    if (isLoading) {
        return (
            <div className={GRID_CLS}>
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                    <FavoriteCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    return (
        <div className={GRID_CLS}>
            {items.map(item => (
                <FavoriteCard
                    key={item.id}
                    item={item}
                    selected={selected.has(item.id)}
                    onToggleSelect={onToggleSelect}
                />
            ))}
        </div>
    )
}
