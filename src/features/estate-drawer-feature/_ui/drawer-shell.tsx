'use client'
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
export const DRAWER_WIDTH_PX = 480
type Props = {
    open: boolean
    children: ReactNode
}
export function DrawerShell({ open, children }: Props) {
    const t = useTranslations('estate')
    return (
        <aside
            aria-label={t('drawer_aria')}
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
