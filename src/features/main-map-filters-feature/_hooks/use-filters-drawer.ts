'use client'

import { useState } from 'react'

export function useFiltersDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen(v => !v),
    }
}
