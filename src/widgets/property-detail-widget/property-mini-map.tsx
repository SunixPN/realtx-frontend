'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { applyMapStyle } from '@/shared/map/map-style'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

export function PropertyMiniMap({ lat, lng }: { lat: number; lng: number }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container || mapRef.current) return

        const map = new mapboxgl.Map({
            container,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [lng, lat],
            zoom: 15,
            interactive: false,
            projection: { name: 'mercator' },
            renderWorldCopies: false,
        })
        mapRef.current = map

        map.on('load', () => {
            applyMapStyle(map)
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

    return <div ref={containerRef} className="h-full w-full" />
}
