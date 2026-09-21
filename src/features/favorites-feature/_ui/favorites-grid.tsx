'use client'
import type { FavoriteItemType } from '@/entities/favorite'
import { FavoriteCard } from './favorite-card'
type FavoritesGridProps = {
    items: FavoriteItemType[]
    selected: Set<number>
    onToggleSelect: (id: number) => void
}
export function FavoritesGrid({ items, selected, onToggleSelect }: FavoritesGridProps) {
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
