"use client"
import mapboxgl from "mapbox-gl"
import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react"
import { applyMapStyle } from "./map-style"
import { useTheme } from "@/shared/theme"
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
type MapContextValue = {
    map: mapboxgl.Map | null
    mountMap: (container: HTMLDivElement) => void
    unmountMap: () => void
}
const MapContext = createContext<MapContextValue | null>(null)
const STYLE_URL = {
    light: "mapbox://styles/mapbox/light-v11",
    dark:  "mapbox://styles/mapbox/dark-v11",
} as const
export function MapProvider({ children }: { children: React.ReactNode }) {
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const { resolvedTheme } = useTheme()
    const themeRef = useRef(resolvedTheme)
    themeRef.current = resolvedTheme
    const mountMap = useCallback((container: HTMLDivElement) => {
        if (mapRef.current) return
        const mode = themeRef.current
        const instance = new mapboxgl.Map({
            container,
            style: STYLE_URL[mode],
            center: [27.5615, 53.9025],
            zoom: 11,
            minZoom: 9,
            maxZoom: 17,
            projection: { name: 'mercator' },
            renderWorldCopies: false,
        })
        instance.on("load", () => {
            applyMapStyle(instance, themeRef.current)
            setMap(instance)
        })
        mapRef.current = instance
    }, [])
    // Ресайз карты вешаем в MapCanvas через ResizeObserver — он ловит реальные
    // изменения размеров контейнера, а не события viewport'а. Это работает
    // одинаково в Safari и Chrome iOS и не дёргает canvas на closing клавиатуры.
    useEffect(() => {
        const instance = mapRef.current
        if (!instance || !map) return
        const swap = () => {
            if (!mapRef.current) return
            const currentUrl = (instance.getStyle() as { sprite?: string; name?: string })?.name
            void currentUrl
            instance.setStyle(STYLE_URL[resolvedTheme])
            instance.once("style.load", () => applyMapStyle(instance, resolvedTheme))
        }
        if (instance.isStyleLoaded()) swap()
        else instance.once("style.load", swap)
        return () => { instance.off("style.load", swap) }
    }, [resolvedTheme, map])
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
