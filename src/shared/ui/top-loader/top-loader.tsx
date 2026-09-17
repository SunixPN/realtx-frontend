'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

// ── Nav event bus (module-level, survives re-renders) ───────────────────────

type Handler = () => void
const startHandlers = new Set<Handler>()
const doneHandlers = new Set<Handler>()

// history.pushState в Next.js может вызываться внутри useInsertionEffect
// (например при prefetch <Link>) — synchronous setState там запрещён.
// Поэтому эмит навигационных событий откладываем в микротаск.
function emitNavStart() { queueMicrotask(() => startHandlers.forEach(h => h())) }
function emitNavDone()  { queueMicrotask(() => doneHandlers.forEach(h => h())) }

let navListenersInstalled = false

function installNavListeners() {
    if (navListenersInstalled || typeof window === 'undefined') return
    navListenersInstalled = true

    // ── Пользовательские клики по <a> ловим в capture-фазе — это самое
    //    раннее «намерение навигации», ДО того как Next начнёт RSC-фетч.
    document.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.button !== 0) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

        const target = e.target as Element | null
        const anchor = target?.closest?.('a') as HTMLAnchorElement | null
        if (!anchor) return
        if (anchor.target && anchor.target !== '_self') return
        if (anchor.hasAttribute('download')) return

        const href = anchor.getAttribute('href')
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return

        try {
            const url = new URL(anchor.href, window.location.origin)
            if (url.origin !== window.location.origin) return
            // Тот же URL — навигации не будет, не мигаем баром.
            if (url.pathname === window.location.pathname && url.search === window.location.search) return
            emitNavStart()
        } catch { /* ignore */ }
    }, true)

    // ── Fallback: программная навигация (router.push/replace) и history-API
    //    Next всё равно в итоге дёрнет history.pushState — если клик по <a>
    //    не был отловлен (например, программный вызов), покажем бар хотя бы тут.
    const origPush = window.history.pushState.bind(window.history)
    window.history.pushState = (...args: Parameters<typeof window.history.pushState>) => {
        origPush(...args)
        emitNavStart()
    }
    window.addEventListener('popstate', emitNavStart)
}

// ── Watcher: fires emitNavDone when Next.js commits the new route ───────────

function NavWatcher() {
    const pathname = usePathname()
    const params = useSearchParams()
    const firstRun = useRef(true)
    useEffect(() => {
        if (firstRun.current) { firstRun.current = false; return }
        emitNavDone()
    }, [pathname, params])
    return null
}

// ── Main component ───────────────────────────────────────────────────────────

type Phase = 'idle' | 'loading' | 'done'

const TICK_MS = 80
const FILL_TARGET = 84  // bar stops here until navigation completes

export function TopLoader() {
    const [phase, setPhase] = useState<Phase>('idle')
    const [pct, setPct] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const mountedRef = useRef(true)
    const phaseRef = useRef<Phase>('idle')

    const stopInterval = () => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    }

    const start = useCallback(() => {
        if (!mountedRef.current) return
        stopInterval()
        phaseRef.current = 'loading'
        setPct(0)
        setPhase('loading')
        intervalRef.current = setInterval(() => {
            setPct(p => {
                const step = (FILL_TARGET - p) * 0.12
                return Math.min(p + Math.max(step, 0.4), FILL_TARGET)
            })
        }, TICK_MS)
    }, [])

    const done = useCallback(() => {
        if (!mountedRef.current) return
        if (phaseRef.current !== 'loading') return  // ignore spurious done
        stopInterval()
        phaseRef.current = 'done'
        setPct(100)
        setPhase('done')
        setTimeout(() => {
            if (mountedRef.current) {
                phaseRef.current = 'idle'
                setPhase('idle')
                setPct(0)
            }
        }, 450)
    }, [])

    useEffect(() => {
        mountedRef.current = true
        installNavListeners()
        startHandlers.add(start)
        doneHandlers.add(done)
        return () => {
            mountedRef.current = false
            startHandlers.delete(start)
            doneHandlers.delete(done)
            stopInterval()
        }
    }, [start, done])

    return (
        <>
            <Suspense>
                <NavWatcher />
            </Suspense>

            {phase !== 'idle' && (
                <>
                    <div
                        aria-hidden
                        style={{
                            width: `${pct}%`,
                            opacity: phase === 'done' ? 0 : 1,
                            transition: phase === 'done'
                                ? 'width 200ms ease-out, opacity 300ms ease-in 150ms'
                                : 'width 80ms linear',
                        }}
                        className="pointer-events-none fixed top-0 left-0 z-[9999] h-[3px] bg-brand shadow-[0_0_6px_1px_var(--brand)]"
                    />
                    {phase === 'loading' && (
                        <div
                            aria-hidden
                            className="pointer-events-none fixed top-2 right-3 z-[9999] flex size-[22px] items-center justify-center rounded-full bg-surface-raised/90 shadow-md backdrop-blur-sm"
                        >
                            <Loader2 className="size-3.5 animate-spin text-brand" />
                        </div>
                    )}
                </>
            )}
        </>
    )
}
