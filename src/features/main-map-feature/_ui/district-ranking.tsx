'use client'
import { useState } from 'react'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { scoreToColor } from '@/shared/map/heat-palette'
import { useDistrictLabel } from '@/entities/estate'
import type { DistrictProfitabilityType } from '@/entities/estate'
type DistrictRankingProps = {
    districts: DistrictProfitabilityType[]
}
export function DistrictRanking({ districts }: DistrictRankingProps) {
    const t = useTranslations('filters')
    const locale = useLocale()
    const districtLabel = useDistrictLabel()
    const [collapsed, setCollapsed] = useState(false)
    const sorted = [...districts].sort((a, b) => b.score - a.score)
    const top = sorted[0]
    const formatPpm = (price: number | null, currency: number): string => {
        if (price === null) return '—'
        const sym = currency === 840 ? '$' : currency === 933 ? 'Br' : '€'
        return `${price.toLocaleString(locale)} ${sym}${t('per_m2')}`
    }
    return (
        <>
            <div
                className={cn(
                    'flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory',
                    '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                    'lg:hidden',
                )}
            >
                {sorted.map((d, i) => (
                    <div
                        key={d.district}
                        className={cn(
                            'flex min-w-[70%] shrink-0 snap-start flex-col gap-1 rounded-lg border bg-surface-raised/95 px-3 py-2 shadow-md backdrop-blur-sm',
                            d === top ? 'border-brand' : 'border-border',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-text-faint tabular-nums">
                                #{i + 1}
                            </span>
                            <span
                                className="size-2.5 shrink-0 rounded-full"
                                style={{ background: scoreToColor(d.score) }}
                            />
                            <span className="flex-1 truncate text-sm font-medium text-text-base">
                                {districtLabel(d.district)}
                            </span>
                        </div>
                        <span className="text-xs text-text-muted tabular-nums">
                            {formatPpm(d.avgPricePerM2, d.currency)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="hidden w-64 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-lg lg:block">
                <button
                    type="button"
                    onClick={() => setCollapsed(v => !v)}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors hover:bg-surface-muted"
                >
                    <TrendingUp className="size-4 shrink-0 text-text-faint" aria-hidden />
                    <span className="text-sm font-medium text-text-base">{t('district_ranking_title')}</span>
                    <ChevronDown
                        className={cn(
                            'ml-auto size-4 text-text-faint transition-transform',
                            collapsed && '-rotate-90',
                        )}
                        aria-hidden
                    />
                </button>
                <div
                    className={cn(
                        'grid transition-[grid-template-rows] duration-300 ease-out',
                        collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
                    )}
                >
                    <div className="overflow-hidden">
                        <ul className="max-h-[50vh] overflow-y-auto border-t border-border">
                            {sorted.map((d, i) => (
                                <li
                                    key={d.district}
                                    className={cn(
                                        'flex items-center gap-2.5 px-3 py-2 text-sm',
                                        i !== sorted.length - 1 && 'border-b border-border/60',
                                        d === top && 'bg-brand/5',
                                    )}
                                >
                                    <span className="w-4 text-xs font-medium text-text-faint tabular-nums">
                                        {i + 1}
                                    </span>
                                    <span
                                        className="size-2.5 shrink-0 rounded-full"
                                        style={{ background: scoreToColor(d.score) }}
                                    />
                                    <span className="flex-1 truncate text-text-base">{districtLabel(d.district)}</span>
                                    <span className="text-xs text-text-muted tabular-nums">
                                        {formatPpm(d.avgPricePerM2, d.currency)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
