"use client"

import mapboxgl from "mapbox-gl"
import { createContext, useContext, useRef, useState, useCallback } from "react"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

// Cool slate palette — aligned with design system tokens (neutral-slate + indigo brand)
const PALETTE = {
    land:       "#DDE4EC", // slightly darker than neutral-200
    water:      "#A9C3D3", // deeper slate-blue
    park:       "#C4D2B8", // desaturated green
    parkDark:   "#B0C29F", // forest — denser
    building:   "#CDD5E0", // between neutral-200 and 300
    buildingOutline: "#B4BFCC",
    roadMinor:  "#CBD5E1", // neutral-300
    roadMajor:  "#B4C0CE",
    roadCasing: "#B4C0CE",
    roadMotor:  "#9DAABD", // slate motorway
    roadMotorCasing: "#7C8A9C",
    labelText:  "#334155", // neutral-700
    labelHalo:  "#DDE4EC",
    labelWater: "#475569", // neutral-600
    labelPlace: "#0F172A", // neutral-900
    border:     "#64748B", // neutral-500
}

function styleLayers(map: mapboxgl.Map) {
    const layers = map.getStyle().layers ?? []

    for (const layer of layers) {
        const id = layer.id
        const type = layer.type

        // Language: Russian with English fallback
        if (type === "symbol") {
            const field = (layer as mapboxgl.SymbolLayer).layout?.["text-field"]
            if (field) {
                map.setLayoutProperty(id, "text-field", [
                    "coalesce",
                    ["get", "name_ru"],
                    ["get", "name"],
                ])
            }
        }

        // Background / land
        if (type === "background") {
            map.setPaintProperty(id, "background-color", PALETTE.land)
            continue
        }

        // Water
        if (id.includes("water") && type === "fill") {
            map.setPaintProperty(id, "fill-color", PALETTE.water)
            continue
        }
        if (id.includes("water") && type === "symbol") {
            map.setPaintProperty(id, "text-color", PALETTE.labelWater)
            map.setPaintProperty(id, "text-halo-color", PALETTE.labelHalo)
            continue
        }

        // Parks & green areas
        if ((id.includes("park") || id.includes("wood") || id.includes("forest") || id.includes("grass")) && type === "fill") {
            map.setPaintProperty(id, "fill-color", id.includes("wood") || id.includes("forest") ? PALETTE.parkDark : PALETTE.park)
            continue
        }

        // Land use (residential, industrial etc.) — keep close to base
        if (id.includes("landuse") && type === "fill") {
            map.setPaintProperty(id, "fill-color", PALETTE.land)
            continue
        }

        // Buildings
        if (id.includes("building") && type === "fill") {
            map.setPaintProperty(id, "fill-color", PALETTE.building)
            map.setPaintProperty(id, "fill-outline-color", PALETTE.buildingOutline)
            continue
        }

        // Motorway casings/lines
        if ((id.includes("motorway") || id.includes("trunk")) && type === "line") {
            if (id.includes("casing")) {
                map.setPaintProperty(id, "line-color", PALETTE.roadMotorCasing)
            } else {
                map.setPaintProperty(id, "line-color", PALETTE.roadMotor)
            }
            continue
        }

        // Other roads
        if ((id.includes("road") || id.includes("street") || id.includes("primary") || id.includes("secondary") || id.includes("tertiary")) && type === "line") {
            if (id.includes("casing")) {
                map.setPaintProperty(id, "line-color", PALETTE.roadCasing)
            } else {
                map.setPaintProperty(id, "line-color", PALETTE.roadMinor)
            }
            continue
        }

        // Admin borders
        if (id.includes("admin") && type === "line") {
            map.setPaintProperty(id, "line-color", PALETTE.border)
            continue
        }

        // Place labels (cities, districts)
        if ((id.includes("settlement") || id.includes("place")) && type === "symbol") {
            map.setPaintProperty(id, "text-color", PALETTE.labelPlace)
            map.setPaintProperty(id, "text-halo-color", PALETTE.labelHalo)
            continue
        }

        // Everything else with text
        if (type === "symbol") {
            map.setPaintProperty(id, "text-color", PALETTE.labelText)
            map.setPaintProperty(id, "text-halo-color", PALETTE.labelHalo)
        }
    }
}

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
            styleLayers(instance)
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
