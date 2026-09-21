'use client'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { useToggleFavorite } from '../_hooks/use-toggle-favorite'
type FavoriteHeartButtonProps = {
    estateId: number
    isFavorite: boolean
    className?: string
}
export function FavoriteHeartButton({ estateId, isFavorite: serverIsFavorite, className }: FavoriteHeartButtonProps) {
    const t = useTranslations('favorites')
    const { isFavorite, toggle, isPending } = useToggleFavorite(estateId, serverIsFavorite)
    return (
        <button
            type="button"
            aria-label={isFavorite ? t('remove_aria') : t('add_aria')}
            aria-pressed={isFavorite}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle() }}
            disabled={isPending}
            className={cn(
                'flex size-9 items-center justify-center rounded-md bg-surface-raised/90 text-text-muted shadow-sm backdrop-blur-sm transition-colors cursor-pointer',
                'hover:text-error disabled:opacity-60',
                className,
            )}
        >
            <Heart
                className={cn('size-5 transition-colors', isFavorite && 'fill-error text-error')}
                aria-hidden
            />
        </button>
    )
}
