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

    const hasSelection = selected.size > 0 && !isLoading
    return (
        <div
            className="mx-auto flex w-full max-w-[1520px] flex-col gap-4 px-3 py-3 sm:px-4 md:gap-6 md:px-6 md:py-6"
            style={hasSelection ? { paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' } : undefined}
        >
            <header className="flex flex-col items-stretch gap-3 border-b border-border pb-4 min-[800px]:flex-row min-[800px]:items-end min-[800px]:justify-between min-[800px]:gap-6 min-[800px]:pb-5">
                <FavoritesHeader items={items} />
                <FavoritesSortBar value={sort} onChange={setSort} />
            </header>

            {hasSelection && (
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
