'use client'
import { useTranslations } from 'next-intl'
import type { ViewedItemType } from '@/entities/viewed'
import { UISkeleton } from '@/shared/ui/ui-skeleton/ui-skeleton'
import { ViewedCard } from './viewed-card'
import { groupByDay, type ViewedGroupKey } from '../_helpers/group-by-day'

type ViewedGridProps = {
    items: ViewedItemType[]
    isLoading: boolean
}

const GRID_CLS = 'grid grid-cols-1 gap-3 min-[660px]:grid-cols-2 md:gap-4 lg:grid-cols-3'
const SKELETON_COUNT = 6

const GROUP_TITLE_KEY: Record<ViewedGroupKey, string> = {
    today: 'group_today',
    yesterday: 'group_yesterday',
    earlier: 'group_earlier',
}

function ViewedCardSkeleton() {
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
            </div>
        </div>
    )
}

export function ViewedGrid({ items, isLoading }: ViewedGridProps) {
    const t = useTranslations('viewed')

    if (isLoading) {
        return (
            <div className={GRID_CLS}>
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                    <ViewedCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    const groups = groupByDay(items)

    return (
        <div className="flex flex-col gap-6 sm:gap-8">
            {groups.map((g) => (
                <section key={g.key}>
                    <div className="mb-3 flex items-baseline justify-between">
                        <h2 className="text-md font-semibold text-text-base">{t(GROUP_TITLE_KEY[g.key])}</h2>
                        <span className="text-xs text-text-faint tabular-nums">{g.items.length}</span>
                    </div>
                    <div className={GRID_CLS}>
                        {g.items.map(item => (
                            <ViewedCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}
