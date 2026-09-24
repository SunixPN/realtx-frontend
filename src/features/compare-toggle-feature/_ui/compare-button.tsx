'use client'
import { ArrowRight, Scale } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { useToggleCompare } from '../_hooks/use-toggle-compare'

type Props = {
    estateId: number
    isInCompare: boolean
    className?: string
    variant?: 'text' | 'icon'
    fullWidth?: boolean
}

export function CompareButton({ estateId, isInCompare: serverIsInCompare, className, variant = 'text', fullWidth = false }: Props) {
    const t = useTranslations('compare')
    const { isInCompare, add, goToCompare, isPending } = useToggleCompare(estateId, serverIsInCompare)

    if (variant === 'icon') {
        return (
            <button
                type="button"
                aria-label={isInCompare ? t('go_to_compare_button') : t('add_button')}
                aria-pressed={isInCompare}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); isInCompare ? goToCompare() : add() }}
                disabled={isPending}
                className={cn(
                    'flex size-9 items-center justify-center rounded-md bg-surface-raised/90 shadow-sm backdrop-blur-sm transition-colors cursor-pointer',
                    isInCompare ? 'text-brand' : 'text-text-muted hover:text-brand',
                    'disabled:opacity-60',
                    className,
                )}
            >
                <Scale className="size-5" aria-hidden />
            </button>
        )
    }

    return (
        <button
            type="button"
            aria-pressed={isInCompare}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); isInCompare ? goToCompare() : add() }}
            disabled={isPending}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
                'border border-border bg-surface-raised text-text hover:bg-surface-muted',
                'disabled:opacity-60',
                fullWidth && 'w-full',
                isInCompare && 'border-brand text-brand hover:bg-brand/5',
                className,
            )}
        >
            {isInCompare ? (
                <>
                    <span className="truncate">{t('go_to_compare_button')}</span>
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                </>
            ) : (
                <>
                    <Scale className="size-4 shrink-0" aria-hidden />
                    <span className="truncate">{t('add_button')}</span>
                </>
            )}
        </button>
    )
}
