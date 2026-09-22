'use client'
import { useEffect } from 'react'

/**
 * Синхронизирует два CSS-вара:
 *   --app-height — стабильная высота из window.innerHeight (НЕ реагирует на
 *                  клавиатуру iOS). Использовать вместо 100dvh для контейнеров,
 *                  которые не должны прыгать при появлении soft-keyboard.
 *   --kb-inset   — высота soft-keyboard = innerHeight − visualViewport.height.
 *                  Пока клавиатура открыта, ставится класс html.kb-open.
 *
 * Нужно для iOS Safari: layout viewport при появлении клавиатуры не сжимается,
 * поэтому контейнеры на 100dvh остаются во весь экран → возникает rubber-band
 * скролл в пустоту, а карта дёргается при закрытии клавиатуры из-за постоянных
 * resize-ов visualViewport.
 */
export function useViewportMetrics() {
    useEffect(() => {
        const root = document.documentElement
        const vv = window.visualViewport

        // Берём МАКСИМУМ из innerHeight и visualViewport.height:
        //   iOS Safari: при открытой клаве innerHeight остаётся во весь экран,
        //     vv — уменьшенный. max = innerHeight → --app-height не прыгает.
        //   iOS Chrome: при открытой клаве обе величины уменьшаются вместе,
        //     но на закрытии window.resize стреляет ненадёжно, а vv.resize —
        //     стабильно. max = vv.height → --app-height восстанавливается.
        const syncAppHeight = () => {
            const h = Math.max(window.innerHeight, vv?.height ?? 0)
            root.style.setProperty('--app-height', `${h}px`)
        }

        const syncKeyboard = () => {
            const inset = Math.max(0, window.innerHeight - (vv?.height ?? window.innerHeight))
            root.style.setProperty('--kb-inset', `${inset}px`)
            // Порог 100px отсеивает мелкие изменения (URL-бар Safari и т.п.),
            // клавиатура iOS всегда > 200px.
            root.classList.toggle('kb-open', inset > 100)
        }

        const sync = () => {
            syncAppHeight()
            syncKeyboard()
        }

        sync()

        window.addEventListener('resize', sync)
        window.addEventListener('orientationchange', sync)
        vv?.addEventListener('resize', sync)

        return () => {
            window.removeEventListener('resize', sync)
            window.removeEventListener('orientationchange', sync)
            vv?.removeEventListener('resize', sync)
            root.classList.remove('kb-open')
        }
    }, [])
}
