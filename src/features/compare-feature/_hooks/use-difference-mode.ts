'use client'
import { useState } from 'react'

export type DifferenceMode = 'all' | 'diff'

export function useDifferenceMode(initial: DifferenceMode = 'all') {
    const [mode, setMode] = useState<DifferenceMode>(initial)
    return { mode, setMode }
}
