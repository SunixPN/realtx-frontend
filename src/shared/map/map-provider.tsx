"use client"

import mapboxgl from "mapbox-gl"
import { createContext, useContext, useRef, useState, useCallback } from "react"
import { applyMapStyle } from "./map-style"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type MapContextValue = {
    map: mapboxgl.Map | null
    mountMap: (container: HTMLDivElement) => void
    unmountMap: () => void
}

const MapContext = createContext<MapContextValue | null>(null)

export function MapProvider({ children }: { children: React.ReactNode }) {
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const [map, setMap] = useState<mapboxgl.Map | null>(null)

    const mountMap = useCallback((container: HTMLDivElement) => {
        if (mapRef.current) return

        const instance = new mapboxgl.Map({
            container,
            style: "mapbox://styles/mapbox/light-v11",
            center: [27.5615, 53.9025],
            zoom: 11,
            minZoom: 9,
            maxZoom: 17,
            projection: { name: 'mercator' },
            renderWorldCopies: false,
        })

        instance.on("load", () => {
            applyMapStyle(instance)
            setMap(instance)
        })
        mapRef.current = instance
    }, [])

    const unmountMap = useCallback(() => {
        mapRef.current?.remove()
        mapRef.current = null
        setMap(null)
    }, [])

    return (
        <MapContext.Provider value={{ map, mountMap, unmountMap }}>
            {children}
        </MapContext.Provider>
    )
}

export function useMapContext() {
    const ctx = useContext(MapContext)
    if (!ctx) throw new Error("useMapContext must be used inside MapProvider")
    return ctx
}
