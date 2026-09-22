'use client'
import { useViewportMetrics } from '@/shared/hooks/use-viewport-metrics'

/**
 * Маунтится один раз в root layout, чтобы CSS-вары --app-height / --kb-inset
 * и класс html.kb-open были доступны глобально всем страницам.
 */
export function ViewportMetricsProvider() {
    useViewportMetrics()
    return null
}
