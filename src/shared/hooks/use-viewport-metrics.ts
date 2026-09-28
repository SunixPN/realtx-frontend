'use client'
import { useEffect } from 'react'


type ScrollSnapshot = {
    element: HTMLElement | null
    scrollTop: number
    windowScrollY: number
}

function findScrollableParent(el: Element | null): HTMLElement | null {
    let node = el?.parentElement as HTMLElement | null
    while (node && node !== document.documentElement && node !== document.body) {
        const cs = getComputedStyle(node)
        const oy = cs.overflowY
        if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) {
            return node
        }
        node = node.parentElement
    }
    return null
}

function isTextInput(el: Element | null): boolean {
    if (!el) return false
    if (el instanceof HTMLTextAreaElement) return true
    if (el instanceof HTMLSelectElement) return true
    if (el instanceof HTMLInputElement) {
        const type = el.type.toLowerCase()
        return !['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'hidden', 'range', 'color'].includes(type)
    }
    return (el as HTMLElement).isContentEditable === true
}

function detectSafari(): boolean {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent
    return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS/i.test(ua)
}

export function useViewportMetrics() {
    useEffect(() => {
        const root = document.documentElement
        const vv = window.visualViewport
        const isSafari = detectSafari()
        if (isSafari) root.classList.add('is-safari')

        const syncAppHeight = () => {
            const h = Math.max(window.innerHeight, vv?.height ?? 0)
            root.style.setProperty('--app-height', `${h}px`)
        }

        let wasKbOpen = false
        // Snapshot скролла родителя последнего сфокусированного инпута.
        // Снимаем в focusin (до Safari-скролла), восстанавливаем при kb-close.
        let snapshot: ScrollSnapshot | null = null

        const syncKeyboard = () => {
            const inset = Math.max(0, window.innerHeight - (vv?.height ?? window.innerHeight))
            root.style.setProperty('--kb-inset', `${inset}px`)
            // Порог 100px отсеивает мелкие изменения (URL-бар Safari и т.п.),
            // клавиатура iOS всегда > 200px.
            const nowOpen = inset > 100
            root.classList.toggle('kb-open', nowOpen)

            // Клавиатура только что закрылась — восстанавливаем скролл до фокуса.
            // Только Safari: у iOS Chrome scrollIntoView-логика другая, snapshot
            // ломает ожидаемое поведение (см. detectSafari выше).
            if (isSafari && wasKbOpen && !nowOpen && snapshot) {
                const { element, scrollTop, windowScrollY } = snapshot
                if (element) element.scrollTop = scrollTop
                window.scrollTo(0, windowScrollY)
                snapshot = null
            }
            wasKbOpen = nowOpen
        }

        const onFocusIn = (e: FocusEvent) => {
            const target = e.target as Element | null
            if (!isTextInput(target)) return
            // Snapshot ДО того, как Safari успеет проскроллить (scrollIntoView
            // происходит после focusin, обычно в следующем кадре).
            const parent = findScrollableParent(target)
            snapshot = {
                element: parent,
                scrollTop: parent?.scrollTop ?? 0,
                windowScrollY: window.scrollY,
            }
        }

        const sync = () => {
            syncAppHeight()
            syncKeyboard()
        }

        sync()

        window.addEventListener('resize', sync)
        window.addEventListener('orientationchange', sync)
        vv?.addEventListener('resize', sync)
        // focusin snapshot нужен только Safari — на Chrome/др. просто не вешаем.
        if (isSafari) document.addEventListener('focusin', onFocusIn, true)

        return () => {
            window.removeEventListener('resize', sync)
            window.removeEventListener('orientationchange', sync)
            vv?.removeEventListener('resize', sync)
            if (isSafari) document.removeEventListener('focusin', onFocusIn, true)
            root.classList.remove('kb-open')
            root.classList.remove('is-safari')
        }
    }, [])
}
