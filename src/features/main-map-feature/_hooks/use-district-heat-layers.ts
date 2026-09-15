'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { scoreToColor, HEAT_COLOR_EXPRESSION } from '@/shared/map/heat-palette'
import type { DistrictProfitabilityType, DistrictGeoJSONType } from '@/entities/estate'
import type { MapMode } from './use-map-mode'

const SOURCE_ID      = 'district-heat'
const FILL_LAYER     = 'district-heat-fill'
const LINE_LAYER     = 'district-heat-line'
const SELECTED_LAYER = 'district-heat-selected'

const SELECTED_COLOR = '#8b5cf6' // violet-500 — контрастно поверх красно-жёлто-зелёной заливки

function formatPpm(price: number | null, currency: number): string {
    if (price === null) return ''
    const sym = currency === 840 ? '$' : currency === 933 ? 'Br' : '€'
    return `${price.toLocaleString('ru-RU')} ${sym}/м²`
}

function createLabelEl(
    name: string,
    district: DistrictProfitabilityType | undefined,
    onClick: () => void,
): HTMLDivElement {
    const color = district ? scoreToColor(district.score) : '#94a3b8'
    const priceText = district ? formatPpm(district.avgPricePerM2, district.currency) : ''

    const el = document.createElement('div')
    el.className = 'district-heat-label'
    el.innerHTML =
        `<div class="district-heat-label__inner">` +
        `<span class="district-heat-label__dot" style="background:${color}"></span>` +
        `<span class="district-heat-label__name">${name}</span>` +
        (priceText
            ? `<span class="district-heat-label__sep">·</span>` +
              `<span class="district-heat-label__price">${priceText}</span>`
            : '') +
        `</div>`
    el.addEventListener('click', (e) => {
        e.stopPropagation()
        onClick()
    })
    return el
}

function buildEnrichedGeoJSON(
    geojson: DistrictGeoJSONType,
    scoreMap: Map<string, DistrictProfitabilityType>,
): GeoJSON.FeatureCollection {
    return {
        type: 'FeatureCollection',
        features: geojson.features.map(f => ({
            type: 'Feature',
            properties: {
                ...f.properties,
                score: scoreMap.get(f.properties.name)?.score ?? 0,
            },
            geometry: f.geometry,
        })),
    } as GeoJSON.FeatureCollection
}

/**
 * Управляет fill/line слоями Mapbox, слоем выделения и HTML-метками районов.
 * Клик по метке — easeTo к центру района + подсветка границы фиолетовым.
 * Fade-in анимация через paint transitions (для слоёв) и CSS keyframes (для меток).
 */
export function useDistrictHeatLayers(
    map: mapboxgl.Map | null,
    mode: MapMode,
    districts: DistrictProfitabilityType[],
    geojson: DistrictGeoJSONType | undefined,
) {
    const labelsRef = useRef<mapboxgl.Marker[]>([])
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

    // При выходе из heat-режима сбрасываем выбор.
    useEffect(() => {
        if (mode !== 'heat') setSelectedDistrict(null)
    }, [mode])

    useEffect(() => {
        if (!map || mode !== 'heat' || !geojson) return

        const scoreMap = new Map(districts.map(d => [d.district, d]))
        const enriched = buildEnrichedGeoJSON(geojson, scoreMap)

        const existingSrc = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
        if (existingSrc) {
            existingSrc.setData(enriched)
        } else {
            map.addSource(SOURCE_ID, { type: 'geojson', data: enriched })
            map.addLayer({
                id: FILL_LAYER,
                type: 'fill',
                source: SOURCE_ID,
                paint: {
                    'fill-color': HEAT_COLOR_EXPRESSION as unknown as mapboxgl.FillPaint['fill-color'],
                    'fill-opacity': 0,
                    'fill-opacity-transition': { duration: 400, delay: 0 },
                },
            })
            map.addLayer({
                id: LINE_LAYER,
                type: 'line',
                source: SOURCE_ID,
                paint: {
                    'line-color': HEAT_COLOR_EXPRESSION as unknown as mapboxgl.LinePaint['line-color'],
                    'line-width': 2,
                    'line-opacity': 0,
                    'line-opacity-transition': { duration: 400, delay: 0 },
                },
            })
            map.addLayer({
                id: SELECTED_LAYER,
                type: 'line',
                source: SOURCE_ID,
                filter: ['==', ['get', 'name'], ''],
                paint: {
                    'line-color': SELECTED_COLOR,
                    'line-width': 4,
                    'line-opacity': 1,
                    'line-blur': 0.5,
                },
            })
            // Стартовые opacity=0 в paint + transition — на след. кадре меняем
            // до целевых значений, Mapbox плавно раскрывает подложку.
            requestAnimationFrame(() => {
                if (map.getLayer(FILL_LAYER)) map.setPaintProperty(FILL_LAYER, 'fill-opacity', 0.45)
                if (map.getLayer(LINE_LAYER)) map.setPaintProperty(LINE_LAYER, 'line-opacity', 0.9)
            })
        }

        // Пересоздаём метки — цены/цвета/фильтры изменились.
        const prev = labelsRef.current
        const next: mapboxgl.Marker[] = []

        for (const f of geojson.features) {
            const name = f.properties.name
            const centroid: [number, number] = [f.properties.centroid.lng, f.properties.centroid.lat]
            const districtData = scoreMap.get(name)

            const el = createLabelEl(name, districtData, () => {
                setSelectedDistrict(name)
                map.easeTo({ center: centroid, zoom: 12.5, duration: 700 })
            })
            const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
                .setLngLat(centroid)
                .addTo(map)
            next.push(marker)
        }

        prev.forEach(m => m.remove())
        labelsRef.current = next

        return () => {
            labelsRef.current.forEach(m => m.remove())
            labelsRef.current = []
            if (map.getLayer(SELECTED_LAYER)) map.removeLayer(SELECTED_LAYER)
            if (map.getLayer(LINE_LAYER)) map.removeLayer(LINE_LAYER)
            if (map.getLayer(FILL_LAYER)) map.removeLayer(FILL_LAYER)
            if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
        }
    }, [map, mode, districts, geojson])

    // Обновление подсветки выбранного района без пересоздания слоёв.
    useEffect(() => {
        if (!map || mode !== 'heat') return
        if (!map.getLayer(SELECTED_LAYER)) return
        map.setFilter(SELECTED_LAYER, ['==', ['get', 'name'], selectedDistrict ?? ''])
    }, [map, mode, selectedDistrict])
}
