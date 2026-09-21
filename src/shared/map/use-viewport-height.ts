'use client'
import { useEffect } from 'react'

/**
 * Держит CSS-переменную --app-height синхронной с реальной высотой visualViewport.
 * Нужно для iOS Safari, где `100dvh` кэшируется и не всегда пересчитывается
 * при смене высоты toolbar'а или скрытии клавиатуры.
 */
export function useViewportHeight() {
    useEffect(() => {
        const root = document.documentElement
        const vv = window.visualViewport
        const update = () => {
            const h = vv?.height ?? window.innerHeight
            root.style.setProperty('--app-height', `${h}px`)
        }
        update()
        window.addEventListener('resize', update)
        window.addEventListener('orientationchange', update)
        vv?.addEventListener('resize', update)
        vv?.addEventListener('scroll', update)
        return () => {
            window.removeEventListener('resize', update)
            window.removeEventListener('orientationchange', update)
            vv?.removeEventListener('resize', update)
            vv?.removeEventListener('scroll', update)
        }
    }, [])
}
