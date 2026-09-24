'use client'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CompareItemType } from '@/entities/compare'
import { useComparePreferences } from '@/entities/compare'
import { cn } from '@/shared/helpers/cn'
import { SECTIONS } from '../_lib/compare-sections'
import { allEqual, bestIndices } from '../_lib/compare-utils'
import { CompareHeaderCell } from './compare-header-cell'
import { AddColumnCta } from './add-column-cta'
import type { DifferenceMode } from '../_hooks/use-difference-mode'

type Props = {
    items: CompareItemType[]
    mode: DifferenceMode
}

const EMPTY_HIDDEN: string[] = []

const HEADER_COL = '240px'

// Ширина колонки-метки берётся из CSS-переменной, чтобы на мобильном была уже (140px),
// а на md+ — как в дизайне (220px). Inline-style не умеет media queries.
function gridCols(cols: number, canAdd: boolean) {
    const item = `repeat(${cols}, minmax(220px, 1fr))`
    return canAdd ? `var(--label-col) ${item} ${HEADER_COL}` : `var(--label-col) ${item}`
}

export function CompareTable({ items, mode }: Props) {
    const t = useTranslations('compare')
    const { data: prefs } = useComparePreferences()
    const hidden = new Set(prefs?.hiddenRows ?? EMPTY_HIDDEN)
    const cols = items.length
    const canAdd = cols < 4
    const template = gridCols(cols, canAdd)

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-border bg-surface-raised [--label-col:140px] md:[--label-col:220px]">
            <div className="min-w-fit">
                <div className="grid divide-x divide-border" style={{ gridTemplateColumns: template }}>
                    <div className="sticky left-0 z-20 bg-surface-muted" />
                    {items.map((l) => (
                        <CompareHeaderCell key={l.id} item={l} />
                    ))}
                    {canAdd && <AddColumnCta />}
                </div>

                {SECTIONS.map((section) => {
                    const visibleRows = section.rows.filter((r) => {
                        if (hidden.has(r.labelKey)) return false
                        if (mode !== 'diff') return true
                        const vals = items.map(r.compare)
                        return !allEqual(vals)
                    })
                    if (visibleRows.length === 0) return null
                    return (
                        <div key={section.titleKey}>
                            <div
                                className="grid divide-x divide-border border-t border-border bg-surface-muted"
                                style={{ gridTemplateColumns: template }}
                            >
                                <div className="sticky left-0 z-20 bg-surface-muted px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                                    {t(section.titleKey)}
                                </div>
                                {items.map((l) => (<div key={l.id} />))}
                                {canAdd && <div />}
                            </div>
                            {visibleRows.map((row) => {
                                const values = items.map(row.compare)
                                const winners = bestIndices(values, row.best)
                                return (
                                    <div
                                        key={row.labelKey}
                                        className="grid divide-x divide-border border-t border-border"
                                        style={{ gridTemplateColumns: template }}
                                    >
                                        <div className="sticky left-0 z-20 bg-surface-raised px-4 py-3 text-sm text-text-muted">
                                            {t(row.labelKey)}
                                        </div>
                                        {items.map((l, i) => {
                                            const isWinner = winners.has(i)
                                            return (
                                                <div
                                                    key={l.id}
                                                    className={cn(
                                                        'px-4 py-3 text-sm text-text-base',
                                                        isWinner && 'bg-success/10 dark:bg-success/15',
                                                    )}
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        {row.render(l)}
                                                        {isWinner && (
                                                            <Check className="size-3.5 text-success" aria-label={t('best_in_row')} />
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                        {canAdd && <div />}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
