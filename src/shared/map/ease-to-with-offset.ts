import type mapboxgl from 'mapbox-gl'

export function easeToWithOffset(
    map: mapboxgl.Map,
    coords: [number, number],
    options: { rightPanelPx?: number; bottomPanelPx?: number; duration?: number; zoom?: number } = {},
) {
    const { rightPanelPx = 0, bottomPanelPx = 0, duration = 500, zoom } = options
    const targetPx = map.project(coords)
    const shifted = { x: targetPx.x + rightPanelPx / 2, y: targetPx.y - bottomPanelPx / 2 }
    const center = map.unproject(shifted as mapboxgl.PointLike)
    map.easeTo({ center, duration, ...(zoom !== undefined ? { zoom } : {}) })
}
