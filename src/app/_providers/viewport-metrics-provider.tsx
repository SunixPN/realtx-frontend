'use client'
import { useViewportMetrics } from '@/shared/hooks/use-viewport-metrics'

export function ViewportMetricsProvider() {
    useViewportMetrics()
    return null
}
