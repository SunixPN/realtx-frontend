'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useComparePreferences, useUpdateComparePreferences } from '@/entities/compare'

export function useCustomizeRows() {
    const { data } = useComparePreferences()
    const { trigger, isMutating } = useUpdateComparePreferences()

    const serverHidden = useMemo(() => new Set(data?.hiddenRows ?? []), [data])
    const [draft, setDraft] = useState<Set<string>>(serverHidden)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) setDraft(new Set(serverHidden))
    }, [open, serverHidden])

    const toggle = useCallback((labelKey: string) => {
        setDraft((prev) => {
            const next = new Set(prev)
            if (next.has(labelKey)) next.delete(labelKey)
            else next.add(labelKey)
            return next
        })
    }, [])

    const setSection = useCallback((labelKeys: string[], hide: boolean) => {
        setDraft((prev) => {
            const next = new Set(prev)
            for (const k of labelKeys) {
                if (hide) next.add(k)
                else next.delete(k)
            }
            return next
        })
    }, [])

    const reset = useCallback(() => setDraft(new Set()), [])

    const apply = useCallback(async () => {
        await trigger(Array.from(draft))
        setOpen(false)
    }, [trigger, draft])

    return {
        open,
        setOpen,
        hiddenRows: serverHidden,
        draft,
        toggle,
        setSection,
        reset,
        apply,
        isMutating,
    }
}
