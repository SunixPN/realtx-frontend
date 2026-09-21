'use client'

import {useFavorites} from '@/entities/favorite'
import {
    FavoritesHeader,
    FavoritesSortBar,
    SelectionBar,
    FavoritesGrid,
    FavoritesEmpty,
    useFavoritesSort,
    useFavoritesSelection,
} from '@/features/favorites-feature'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'


export function FavoritesWidget() {
    const { currency } = useDisplayCurrency()
    const { sort, setSort } = useFavoritesSort()
    const { selected, toggle, clear } = useFavoritesSelection()

    const { data: items = [], isLoading } = useFavorites(sort, currency)

    return (
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-6 px-6 py-6">
            <header className="flex items-end justify-between gap-6 border-b border-border pb-5">
                <FavoritesHeader items={items} />
                <FavoritesSortBar value={sort} onChange={setSort} />
            </header>

            {selected.size > 0 && !isLoading && (
                <SelectionBar selected={selected} onClear={clear} />
            )}

            {(items.length === 0 && !isLoading) ? (
                <FavoritesEmpty />
            ) : (
                <FavoritesGrid isLoading={isLoading} items={items} selected={selected} onToggleSelect={toggle} />
            )}
        </div>
    )
}
