'use client'

import { Layers } from 'lucide-react'
import { cn } from '@/shared/helpers/cn'
import type { MapMode } from '../_hooks/use-map-mode'

const ITEMS = [
    { key: 'objects' as const, label: 'Объекты' },
    { key: 'heat' as const, label: 'Выгодность районов' },
]

type MapModeToggleProps = {
    mode: MapMode
    onChange: (mode: MapMode) => void
}

export function MapModeToggle({ mode, onChange }: MapModeToggleProps) {
    return (
        <div className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised p-1 shadow-md">
            <Layers className="mx-1.5 size-4 text-text-faint shrink-0" aria-hidden />
            {ITEMS.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    aria-pressed={mode === item.key}
                    onClick={() => onChange(item.key)}
                    className={cn(
                        'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                        mode === item.key
                            ? 'bg-brand text-white'
                            : 'text-text-muted hover:bg-surface-muted',
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    )
}
