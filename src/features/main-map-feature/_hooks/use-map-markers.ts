'use client'

import { useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import mapboxgl from 'mapbox-gl'
import { PRICE_CURRENCY_LABELS, type EstateMapPointType, type HouseBbox } from '@/entities/estate'
import { BYN_SIGN_HTML } from '@/shared/ui/byn-sign/byn-sign'

export type MarkerClickHandlers = {
    onEstateClick: (id: number, center: [number, number]) => void
    onHouseClick: (bbox: HouseBbox, center: [number, number]) => void
}

const SOURCE_ID = 'estate-points'
const HIDDEN_LAYER_ID = `${SOURCE_ID}__hidden`

// Габарит кластера, при котором считаем «квартиры в одном доме»: ~55 м по
// долготе и ~55 м по широте. Хватает на большой панельник и на разнобой
// координат между объявлениями одного и того же дома, но не склеит соседние.
// 0.0005° широты ≈ 55 м; на широте Минска 0.0008° долготы ≈ 55 м, берём
// с запасом одинаковый порог 0.0008 — здания вытянуты, лучше терпимее.
const HOUSE_SPAN_DEG = 8e-4

function formatPrice(price: number | null, currency: number | null, formatK: (n: number) => string): string {
    if (price === null) return ''
    const sym = currency === 933
        ? BYN_SIGN_HTML
        : (currency !== null ? (PRICE_CURRENCY_LABELS[currency] ?? '') : '')
    const thousands = Math.round(price / 1000)
    return `${formatK(thousands)} ${sym}`.trim()
}

function clusterSizeClass(count: number): 'sm' | 'md' | 'lg' {
    if (count >= 16) return 'lg'
    if (count >= 6) return 'md'
    return 'sm'
}

const HEART_PIN_SVG = `<svg class="map-pin__fav" viewBox="0 0 24 24" aria-hidden="true" width="10" height="10"><path fill="currentColor" d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>`
const HEART_HOUSE_SVG = `<svg class="map-house__fav" viewBox="0 0 24 24" aria-hidden="true" width="10" height="10"><path fill="currentColor" d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>`

function createPinElement(point: EstateMapPointType, isFavorite: boolean, formatK: (n: number) => string): HTMLDivElement {
    const el = document.createElement('div')
    el.className = 'map-pin'
    el.innerHTML =
        `<div class="map-pin__inner">` +
        `<span class="map-pin__label">` +
        (isFavorite ? HEART_PIN_SVG : '') +
        formatPrice(point.price, point.priceCurrency, formatK) +
        `</span>` +
        `<span class="map-pin__tail"></span>` +
        `</div>`
    return el
}

function createClusterElement(count: number): HTMLDivElement {
    const el = document.createElement('div')
    el.className = `map-cluster map-cluster--${clusterSizeClass(count)}`
    el.innerHTML = `<div class="map-cluster__inner">${count}</div>`
    return el
}

// Маркер «дом»: применяется, когда весь кластер — квартиры в одной точке.
// Визуально отличается от обычного кластера (иконка дома + счётчик), чтобы
// пользователь понял, что клик откроет карточку дома, а не разъедется по карте.
// Обработчик клика пока не навешиваем — функционал детальной ждёт отдельного тикета.
function createHouseElement(count: number, hasFavorite: boolean): HTMLDivElement {
    const el = document.createElement('div')
    el.className = 'map-house'
    el.innerHTML =
        `<div class="map-house__inner">` +
        `<svg class="map-house__icon" viewBox="0 0 16 16" aria-hidden="true">` +
        `<path d="M8 1.6 1.6 6.4v8h4.2V9.6h4.4v4.8h4.2v-8L8 1.6z" fill="currentColor"/>` +
        `</svg>` +
        `<span class="map-house__count">${count}</span>` +
        (hasFavorite ? HEART_HOUSE_SVG : '') +
        `</div>`
    return el
}

type PointFeature = {
    type: 'Feature'
    id: number
    geometry: { type: 'Point'; coordinates: [number, number] }
    properties: {
        id: number
        price: number | null
        priceCurrency: number | null
        rooms: number | null
        // lng/lat дублируем в properties (не только в geometry) — Mapbox
        // clusterProperties агрегируют выражения только по properties.
        lng: number
        lat: number
    }
}
type PointFeatureCollection = { type: 'FeatureCollection'; features: PointFeature[] }

function toFeatureCollection(points: EstateMapPointType[]): PointFeatureCollection {
    const features: PointFeature[] = []
    for (const p of points) {
        if (p.lat === null || p.lng === null) continue
        const lng = Number(p.lng)
        const lat = Number(p.lat)
        if (isNaN(lng) || isNaN(lat)) continue
        features.push({
            type: 'Feature',
            id: p.id,
            geometry: { type: 'Point', coordinates: [lng, lat] },
            properties: {
                id: p.id,
                price: p.price,
                priceCurrency: p.priceCurrency,
                rooms: p.rooms,
                lng,
                lat,
            },
        })
    }
    return { type: 'FeatureCollection', features }
}

/**
 * HTML-маркеры + нативная кластеризация Mapbox.
 *
 * Кластеризация считается движком (GeoJSON source c cluster: true),
 * рендерим сами HTML-маркерами — чтобы попасть в дизайн-систему.
 * Диффим по id (cluster_id для кластеров, point.id для одиночек),
 * маркеры переиспользуются между кадрами.
 *
 * clusterMaxZoom: 22 — квартиры в одном доме (близкие координаты) остаются
 * склеенными на любом зуме. Такой «однодомный» кластер помечается через
 * clusterProperties (min/max buildingId совпадают) и рендерится маркером-домом
 * вместо обычного кластера с числом.
 *
 * MapProvider гарантирует, что map != null только после style-load —
 * проверять isStyleLoaded() здесь не нужно.
 */
export function useMapMarkers(
    map: mapboxgl.Map | null,
    points: EstateMapPointType[],
    handlers?: MarkerClickHandlers,
    favoriteIds?: Set<number>,
) {
    const t = useTranslations('estate')
    const locale = useLocale()
    const formatKRef = useRef((n: number) => t('map_price_k', { n }))
    formatKRef.current = (n: number) => t('map_price_k', { n })
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({})
    const onScreenRef = useRef<Record<string, mapboxgl.Marker>>({})
    const pointsRef = useRef<EstateMapPointType[]>(points)
    pointsRef.current = points
    const favoriteIdsRef = useRef<Set<number>>(favoriteIds ?? new Set())
    favoriteIdsRef.current = favoriteIds ?? new Set()
    const handlersRef = useRef<MarkerClickHandlers | undefined>(handlers)
    handlersRef.current = handlers

    // Source + hidden layer + подписки живут всё время, пока есть map.
    useEffect(() => {
        if (!map) return

        // Прозрачный layer нужен, чтобы Mapbox начал грузить тайлы source'а
        // и querySourceFeatures возвращал реальные фичи. С radius: 0 layer
        // оптимизируется и тайлы не запрашиваются.
        if (!map.getSource(SOURCE_ID)) {
            map.addSource(SOURCE_ID, {
                type: 'geojson',
                data: toFeatureCollection(pointsRef.current),
                cluster: true,
                clusterMaxZoom: 22,
                clusterRadius: 60,
                // Агрегируем bbox лифов кластера. Если габарит меньше
                // HOUSE_SPAN_DEG по обеим осям — это квартиры в одном доме,
                // рендерим как house-маркер вместо счётчика.
                clusterProperties: {
                    minLng: ['min', ['get', 'lng']],
                    maxLng: ['max', ['get', 'lng']],
                    minLat: ['min', ['get', 'lat']],
                    maxLat: ['max', ['get', 'lat']],
                },
            })
        }
        if (!map.getLayer(HIDDEN_LAYER_ID)) {
            map.addLayer({
                id: HIDDEN_LAYER_ID,
                type: 'circle',
                source: SOURCE_ID,
                paint: { 'circle-radius': 15, 'circle-opacity': 0, 'circle-stroke-width': 0 },
            })
        }

        const updateMarkers = () => {
            const src = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
            if (!src || !map.getLayer(HIDDEN_LAYER_ID)) return

            // queryRenderedFeatures надёжнее, чем querySourceFeatures: возвращает
            // только фичи, реально попавшие в тайл-рендер, включая корректно
            // рассчитанные кластеры для текущего zoom.
            const features = map.queryRenderedFeatures({ layers: [HIDDEN_LAYER_ID] })
            const pointsById = new Map<number, EstateMapPointType>()
            for (const p of pointsRef.current) pointsById.set(p.id, p)

            const next: Record<string, mapboxgl.Marker> = {}

            for (const raw of features) {
                const f = raw as unknown as PointFeature & { properties: Record<string, unknown> }
                if (f.geometry?.type !== 'Point') continue
                const [lng, lat] = f.geometry.coordinates
                const props = f.properties ?? {}

                let key: string
                let el: HTMLDivElement | null = null
                let isHouse = false

                if (props.cluster) {
                    const clusterId = props.cluster_id as number
                    const count = Number(props.point_count)
                    const minLng = Number(props.minLng)
                    const maxLng = Number(props.maxLng)
                    const minLat = Number(props.minLat)
                    const maxLat = Number(props.maxLat)
                    const spanLng = maxLng - minLng
                    const spanLat = maxLat - minLat
                    isHouse = spanLng < HOUSE_SPAN_DEG && spanLat < HOUSE_SPAN_DEG
                    key = isHouse ? `house-${clusterId}` : `cluster-${clusterId}`
                    if (!markersRef.current[key]) {
                        if (isHouse) {
                            const hasFav = pointsRef.current.some(p =>
                                p.lng !== null && p.lat !== null &&
                                Number(p.lng) >= minLng && Number(p.lng) <= maxLng &&
                                Number(p.lat) >= minLat && Number(p.lat) <= maxLat &&
                                favoriteIdsRef.current.has(p.id)
                            )
                            el = createHouseElement(count, hasFav)
                            const bbox = { minLng, maxLng, minLat, maxLat }
                            const center: [number, number] = [(minLng + maxLng) / 2, (minLat + maxLat) / 2]
                            el.addEventListener('click', (e) => {
                                e.stopPropagation()
                                handlersRef.current?.onHouseClick(bbox, center)
                            })
                        } else {
                            el = createClusterElement(count)
                            el.addEventListener('click', (e) => {
                                e.stopPropagation()
                                src.getClusterExpansionZoom(clusterId, (err, zoom) => {
                                    if (err || zoom == null) return
                                    map.easeTo({ center: [lng, lat], zoom })
                                })
                            })
                        }
                    }
                } else {
                    const id = Number(props.id)
                    key = `pin-${id}`
                    if (!markersRef.current[key]) {
                        const point = pointsById.get(id)
                        if (!point) continue
                        el = createPinElement(point, favoriteIdsRef.current.has(id), formatKRef.current)
                        el.addEventListener('click', (e) => {
                            e.stopPropagation()
                            handlersRef.current?.onEstateClick(id, [lng, lat])
                        })
                    }
                }

                let marker = markersRef.current[key]
                if (!marker && el) {
                    marker = new mapboxgl.Marker({
                        element: el,
                        anchor: props.cluster ? 'center' : 'bottom',
                    }).setLngLat([lng, lat])
                    markersRef.current[key] = marker
                }
                if (!marker) continue

                next[key] = marker
                if (!onScreenRef.current[key]) marker.addTo(map)
            }

            for (const key in onScreenRef.current) {
                if (!next[key]) onScreenRef.current[key].remove()
            }
            onScreenRef.current = next
        }

        const onSourceData = (e: mapboxgl.MapSourceDataEvent) => {
            if (e.sourceId !== SOURCE_ID || !e.isSourceLoaded) return
            updateMarkers()
        }

        map.on('move', updateMarkers)
        map.on('moveend', updateMarkers)
        map.on('sourcedata', onSourceData)

        // Тайлы уже могли загрузиться до нашей подписки — попробуем сразу.
        updateMarkers()

        return () => {
            map.off('move', updateMarkers)
            map.off('moveend', updateMarkers)
            map.off('sourcedata', onSourceData)
            for (const key in markersRef.current) markersRef.current[key].remove()
            markersRef.current = {}
            onScreenRef.current = {}
            if (map.getLayer(HIDDEN_LAYER_ID)) map.removeLayer(HIDDEN_LAYER_ID)
            if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
        }
    }, [map])

    // Обновление данных без пересоздания source/подписок.
    // Маркеры сбрасываем полностью: цены/валюта/избранное изменились,
    // а DOM-элементы кешируются по id и не обновляются сами по себе.
    useEffect(() => {
        if (!map) return
        const src = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
        if (!src) return
        for (const key in onScreenRef.current) onScreenRef.current[key].remove()
        onScreenRef.current = {}
        markersRef.current = {}
        src.setData(toFeatureCollection(points))
    }, [map, points, favoriteIds, locale])
}
