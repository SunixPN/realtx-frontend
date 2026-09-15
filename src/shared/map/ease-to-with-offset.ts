import type mapboxgl from 'mapbox-gl'

/**
 * Плавно центрирует карту на точке [lng, lat], учитывая ширину drawer'а справа:
 * реальный оптический центр видимой области смещается влево на rightPanelPx / 2,
 * поэтому пятно интереса нужно расположить именно там. Мировые координаты
 * получаем через unproject от пиксельного смещения от текущего центра.
 */
export function easeToWithOffset(
    map: mapboxgl.Map,
    coords: [number, number],
    options: { rightPanelPx?: number; duration?: number; zoom?: number } = {},
) {
    const { rightPanelPx = 0, duration = 500, zoom } = options
    const targetPx = map.project(coords)
    const shifted = { x: targetPx.x + rightPanelPx / 2, y: targetPx.y }
    const center = map.unproject(shifted as mapboxgl.PointLike)
    map.easeTo({ center, duration, ...(zoom !== undefined ? { zoom } : {}) })
}
