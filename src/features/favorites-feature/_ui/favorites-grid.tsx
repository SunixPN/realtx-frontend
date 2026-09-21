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
            <UISkeleton className="h-[220px] w-full rounded-none" />
            <div className="flex flex-col gap-2 p-4">
                <div className="flex items-baseline justify-between gap-3">
                    <UISkeleton className="h-6 w-28" />
                    <UISkeleton className="h-4 w-20" />
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

export function FavoritesGrid({ items, selected, onToggleSelect, isLoading }: FavoritesGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                    <FavoriteCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-3 gap-4">
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
