'use client'

import { useState } from 'react'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { cn } from '@/shared/helpers/cn'
import { scoreToColor } from '@/shared/map/heat-palette'
import type { DistrictProfitabilityType } from '@/entities/estate'

type DistrictRankingProps = {
    districts: DistrictProfitabilityType[]
}

function formatPpm(price: number | null, currency: number): string {
    if (price === null) return '—'
    const sym = currency === 840 ? '$' : currency === 933 ? 'Br' : '€'
    return `${price.toLocaleString('ru-RU')} ${sym}/м²`
}

export function DistrictRanking({ districts }: DistrictRankingProps) {
    const [collapsed, setCollapsed] = useState(false)

    // Сортировка по score desc; NaN/пустые уходят вниз естественно, т.к. 0.
    const sorted = [...districts].sort((a, b) => b.score - a.score)
    const top = sorted[0]

    return (
        <div className="w-64 rounded-lg border border-border bg-surface-raised shadow-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setCollapsed(v => !v)}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-surface-muted transition-colors cursor-pointer"
            >
                <TrendingUp className="size-4 text-text-faint shrink-0" aria-hidden />
                <span className="text-sm font-medium text-text-base">Рейтинг районов</span>
                <ChevronDown
                    className={cn(
                        'size-4 text-text-faint ml-auto transition-transform',
                        collapsed && '-rotate-90'
                    )}
                    aria-hidden
                />
            </button>

            {/* grid-rows 0fr↔1fr — единственный «чистый» способ анимировать height:auto */}
            <div
                className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
                )}
            >
                <div className="overflow-hidden">
                    <ul className="border-t border-border max-h-[50vh] overflow-y-auto">
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
                                    className="size-2.5 rounded-full shrink-0"
                                    style={{ background: scoreToColor(d.score) }}
                                />
                                <span className="flex-1 truncate text-text-base">{d.district}</span>
                                <span className="text-xs text-text-muted tabular-nums">
                                    {formatPpm(d.avgPricePerM2, d.currency)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
