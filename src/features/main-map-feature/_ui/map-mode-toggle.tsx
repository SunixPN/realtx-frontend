'use client'
import { Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import type { MapMode } from '../_hooks/use-map-mode'
type MapModeToggleProps = {
    mode: MapMode
    onChange: (mode: MapMode) => void
}
export function MapModeToggle({ mode, onChange }: MapModeToggleProps) {
    const t = useTranslations('filters')
    const ITEMS: { key: MapMode; label: string }[] = [
        { key: 'objects', label: t('mode_objects') },
        { key: 'heat',    label: t('mode_heat') },
    ]
    return (
        <div
            className={cn(
                'flex w-full items-stretch gap-1 rounded-md lg:items-center border border-border bg-surface-raised/95 p-1 shadow-md backdrop-blur-sm',
                'lg:inline-flex lg:w-auto lg:bg-surface-raised',
            )}
        >
            <Layers className="ml-1.5 hidden size-4 shrink-0 text-text-faint lg:block" aria-hidden />
            {ITEMS.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    aria-pressed={mode === item.key}
                    onClick={() => onChange(item.key)}
                    className={cn(
                        'flex flex-1 cursor-pointer items-center justify-center rounded-sm px-3 py-2.5 text-center text-sm font-medium transition-colors lg:flex-initial lg:py-1.5',
                        mode === item.key
                            ? 'bg-brand text-white'
                            : 'text-text-muted hover:bg-surface-muted active:bg-surface-muted',
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    )
}
