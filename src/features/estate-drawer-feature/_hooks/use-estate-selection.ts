'use client'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createElement } from 'react'
import type { HouseBbox } from '@/entities/estate'

export type DrawerView =
    | { kind: 'estate'; id: number; center: [number, number] }
    | { kind: 'house'; bbox: HouseBbox; center: [number, number] }
type Ctx = {
    stack: DrawerView[]
    top: DrawerView | null
    isOpen: boolean
    openEstate: (id: number, center: [number, number]) => void
    openHouse: (bbox: HouseBbox, center: [number, number]) => void
    back: () => void
    close: () => void
}
const EstateSelectionContext = createContext<Ctx | null>(null)
export function EstateSelectionProvider({ children }: { children: ReactNode }) {
    const [stack, setStack] = useState<DrawerView[]>([])
    const openEstate = useCallback((id: number, center: [number, number]) => {
        setStack((s) => {
            const t = s[s.length - 1]
            if (t?.kind === 'estate' && t.id === id) return s
            return [...s, { kind: 'estate', id, center }]
        })
    }, [])
    const openHouse = useCallback((bbox: HouseBbox, center: [number, number]) => {
        setStack([{ kind: 'house', bbox, center }])
    }, [])
    const back = useCallback(() => {
        setStack((s) => (s.length > 1 ? s.slice(0, -1) : []))
    }, [])
    const close = useCallback(() => setStack([]), [])
    const value = useMemo<Ctx>(() => ({
        stack,
        top: stack[stack.length - 1] ?? null,
        isOpen: stack.length > 0,
        openEstate,
        openHouse,
        back,
        close,
    }), [stack, openEstate, openHouse, back, close])
    return createElement(EstateSelectionContext.Provider, { value }, children)
}
export function useEstateSelection() {
    const ctx = useContext(EstateSelectionContext)
    if (!ctx) throw new Error('useEstateSelection must be used inside EstateSelectionProvider')
    return ctx
}
