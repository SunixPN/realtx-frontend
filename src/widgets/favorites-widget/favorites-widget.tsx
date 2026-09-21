'use client'
import { useLayoutEffect } from 'react'
import { unstable_serialize, useSWRConfig } from 'swr'
import { favoriteIdsKey, favoritesKey, useFavorites } from '@/entities/favorite'
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
    const { fallback, mutate } = useSWRConfig()
    useLayoutEffect(() => {
        const favKey = favoritesKey(sort, currency)
        const idsKey = favoriteIdsKey()
        const favSerialized = unstable_serialize(favKey)
        const idsSerialized = unstable_serialize(idsKey)
        if (fallback[favSerialized] !== undefined) {
            mutate(favKey, fallback[favSerialized], { revalidate: false })
        }
        if (fallback[idsSerialized] !== undefined) {
            mutate(idsKey, fallback[idsSerialized], { revalidate: false })
        }
    }, [])
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
            {items.length === 0 ? (
                <FavoritesEmpty />
            ) : (
                <FavoritesGrid items={items} selected={selected} onToggleSelect={toggle} />
            )}
        </div>
    )
}
