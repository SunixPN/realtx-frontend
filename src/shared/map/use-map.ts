"use client"

import { useMapContext } from "./map-provider"

export function useMap() {
    return useMapContext().map
}
