'use client'

import { useViewed } from '@/entities/viewed'
import { ViewedHeader, ViewedGrid, ViewedEmpty } from '@/features/viewed-feature'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

export function ViewedWidget() {
    const { currency } = useDisplayCurrency()
    const { data: items = [], isLoading } = useViewed(currency)

    return (
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-4 px-3 py-3 sm:px-4 md:gap-6 md:px-6 md:py-6">
            <ViewedHeader count={items.length} />
            {(items.length === 0 && !isLoading) ? (
                <ViewedEmpty />
            ) : (
                <ViewedGrid isLoading={isLoading} items={items} />
            )}
        </div>
    )
}
