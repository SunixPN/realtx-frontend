'use client'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import type { DifferenceMode } from '../_hooks/use-difference-mode'

type Props = {
    mode: DifferenceMode
    onChange: (m: DifferenceMode) => void
}

export function DifferenceToggle({ mode, onChange }: Props) {
    const t = useTranslations('compare')
    return (
        <div
            role="group"
            aria-label={t('toggle_group_aria')}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised p-1"
        >
            <button
                type="button"
                aria-pressed={mode === 'all'}
                onClick={() => onChange('all')}
                className={cn(
                    'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                    mode === 'all' ? 'bg-brand text-white' : 'text-text-muted hover:bg-surface-muted',
                )}
            >
                {t('toggle_all')}
            </button>
            <button
                type="button"
                aria-pressed={mode === 'diff'}
                onClick={() => onChange('diff')}
                className={cn(
                    'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                    mode === 'diff' ? 'bg-brand text-white' : 'text-text-muted hover:bg-surface-muted',
                )}
            >
                {t('toggle_diff')}
            </button>
        </div>
    )
}
