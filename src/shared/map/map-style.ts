import type mapboxgl from "mapbox-gl"

export const MAP_PALETTE = {
    land:       "#DDE4EC",
    water:      "#A9C3D3",
    park:       "#C4D2B8",
    parkDark:   "#B0C29F",
    building:   "#CDD5E0",
    buildingOutline: "#B4BFCC",
    roadMinor:  "#CBD5E1",
    roadMajor:  "#B4C0CE",
    roadCasing: "#B4C0CE",
    roadMotor:  "#9DAABD",
    roadMotorCasing: "#7C8A9C",
    labelText:  "#334155",
    labelHalo:  "#DDE4EC",
    labelWater: "#475569",
    labelPlace: "#0F172A",
    border:     "#64748B",
}

export function applyMapStyle(map: mapboxgl.Map) {
    const layers = map.getStyle().layers ?? []

    for (const layer of layers) {
        const id = layer.id
        const type = layer.type

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

        if (type === "background") {
            map.setPaintProperty(id, "background-color", MAP_PALETTE.land)
            continue
        }

        if (id.includes("water") && type === "fill") {
            map.setPaintProperty(id, "fill-color", MAP_PALETTE.water)
            continue
        }
        if (id.includes("water") && type === "symbol") {
            map.setPaintProperty(id, "text-color", MAP_PALETTE.labelWater)
            map.setPaintProperty(id, "text-halo-color", MAP_PALETTE.labelHalo)
            continue
        }

        if ((id.includes("park") || id.includes("wood") || id.includes("forest") || id.includes("grass")) && type === "fill") {
            map.setPaintProperty(id, "fill-color", id.includes("wood") || id.includes("forest") ? MAP_PALETTE.parkDark : MAP_PALETTE.park)
            continue
        }

        if (id.includes("landuse") && type === "fill") {
            map.setPaintProperty(id, "fill-color", MAP_PALETTE.land)
            continue
        }

        if (id.includes("building") && type === "fill") {
            map.setPaintProperty(id, "fill-color", MAP_PALETTE.building)
            map.setPaintProperty(id, "fill-outline-color", MAP_PALETTE.buildingOutline)
            continue
        }

        if ((id.includes("motorway") || id.includes("trunk")) && type === "line") {
            if (id.includes("casing")) {
                map.setPaintProperty(id, "line-color", MAP_PALETTE.roadMotorCasing)
            } else {
                map.setPaintProperty(id, "line-color", MAP_PALETTE.roadMotor)
            }
            continue
        }

        if ((id.includes("road") || id.includes("street") || id.includes("primary") || id.includes("secondary") || id.includes("tertiary")) && type === "line") {
            if (id.includes("casing")) {
                map.setPaintProperty(id, "line-color", MAP_PALETTE.roadCasing)
            } else {
                map.setPaintProperty(id, "line-color", MAP_PALETTE.roadMinor)
            }
            continue
        }

        if (id.includes("admin") && type === "line") {
            map.setPaintProperty(id, "line-color", MAP_PALETTE.border)
            continue
        }

        if ((id.includes("settlement") || id.includes("place")) && type === "symbol") {
            map.setPaintProperty(id, "text-color", MAP_PALETTE.labelPlace)
            map.setPaintProperty(id, "text-halo-color", MAP_PALETTE.labelHalo)
            continue
        }

        if (type === "symbol") {
            map.setPaintProperty(id, "text-color", MAP_PALETTE.labelText)
            map.setPaintProperty(id, "text-halo-color", MAP_PALETTE.labelHalo)
        }
    }
}
