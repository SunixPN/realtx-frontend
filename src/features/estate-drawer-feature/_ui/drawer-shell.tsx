'use client'

import type { ReactNode } from 'react'

export const DRAWER_WIDTH_PX = 480

type Props = {
    open: boolean
    children: ReactNode
}

/**
 * Абсолютно-позиционированная панель справа поверх карты. Появление —
 * translateX(100%→0), исчезновение — обратное. Ширина фиксирована и
 * прокидывается в use-map-markers через константу DRAWER_WIDTH_PX,
 * чтобы центрирование карты учитывало «сдвиг» видимой области.
 */
export function DrawerShell({ open, children }: Props) {
    return (
        <aside
            aria-label="Информация об объекте"
            className="absolute inset-y-0 right-0 z-40 flex flex-col border-l border-[var(--border-default)] bg-[var(--surface-raised)] shadow-xl transition-transform duration-300"
            style={{
                width: DRAWER_WIDTH_PX,
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                pointerEvents: open ? 'auto' : 'none',
            }}
        >
            {children}
        </aside>
    )
}
