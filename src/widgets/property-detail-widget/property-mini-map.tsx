'use client'
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { applyMapStyle } from '@/shared/map/map-style'
import { useTheme } from '@/shared/theme'
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''
const STYLE_URL = {
    light: 'mapbox://styles/mapbox/light-v11',
    dark:  'mapbox://styles/mapbox/dark-v11',
} as const
export function PropertyMiniMap({ lat, lng }: { lat: number; lng: number }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const { resolvedTheme } = useTheme()
    const themeRef = useRef(resolvedTheme)
    themeRef.current = resolvedTheme
    useEffect(() => {
        const container = containerRef.current
        if (!container || mapRef.current) return
        const map = new mapboxgl.Map({
            container,
            style: STYLE_URL[themeRef.current],
            center: [lng, lat],
            zoom: 15,
            interactive: false,
            projection: { name: 'mercator' },
            renderWorldCopies: false,
        })
        mapRef.current = map
        map.on('load', () => {
            applyMapStyle(map, themeRef.current)
            new mapboxgl.Marker({ color: '#6366f1' })
                .setLngLat([lng, lat])
                .addTo(map)
        })
        const observer = new ResizeObserver(() => map.resize())
        observer.observe(container)
        return () => {
            observer.disconnect()
            map.remove()
            mapRef.current = null
        }
    }, [lat, lng])
    useEffect(() => {
        const map = mapRef.current
        if (!map) return
        const swap = () => {
            map.setStyle(STYLE_URL[resolvedTheme])
            map.once('style.load', () => applyMapStyle(map, resolvedTheme))
        }
        if (map.isStyleLoaded()) swap()
        else map.once('style.load', swap)
    }, [resolvedTheme])
    return <div ref={containerRef} className="h-full w-full" />
}
