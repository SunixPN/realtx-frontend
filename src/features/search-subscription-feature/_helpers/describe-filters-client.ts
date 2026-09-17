'use client'

import { useTranslations } from 'next-intl'
import type { MapFiltersType } from '@/entities/estate'
import { useWallMaterialLabels, useRepairStateLabels } from '@/entities/estate'

function fmt(n: number): string {
    return n.toLocaleString()
}

// Мгновенный preview в форме, пока подписка не сохранена. Бэк отдаёт
// собственный summary — используем его, где возможно, а этот только
// когда фильтры ещё не улетели в БД.
export function useDescribeFiltersClient(): (filters: MapFiltersType) => { summary: string; chips: string[] } {
    const t = useTranslations('filters')
    const wallLabels = useWallMaterialLabels()
    const repairLabels = useRepairStateLabels()

    return (filters) => {
        const chips: string[] = []

        if (filters.rooms?.length) {
            const sorted = [...filters.rooms].sort((a, b) => a - b)
            chips.push(t('chip_rooms', { rooms: sorted.map(r => r >= 5 ? '5+' : String(r)).join('/') }))
        }

        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
            const sym = filters.currency === 'BYN' ? 'Br' : filters.currency === 'EUR' ? '€' : '$'
            if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
                chips.push(t('chip_price_range', { min: fmt(filters.priceMin), max: fmt(filters.priceMax), sym }))
            } else if (filters.priceMin !== undefined) {
                chips.push(t('chip_price_from', { min: fmt(filters.priceMin), sym }))
            } else if (filters.priceMax !== undefined) {
                chips.push(t('chip_price_to', { max: fmt(filters.priceMax), sym }))
            }
        }

        if (filters.areaMin !== undefined && filters.areaMax !== undefined) chips.push(t('chip_area_range', { min: filters.areaMin, max: filters.areaMax }))
        else if (filters.areaMin !== undefined) chips.push(t('chip_area_from', { min: filters.areaMin }))
        else if (filters.areaMax !== undefined) chips.push(t('chip_area_to', { max: filters.areaMax }))

        if (filters.districts?.length === 1) chips.push(filters.districts[0])
        else if (filters.districts && filters.districts.length > 1) chips.push(t('chip_districts', { count: filters.districts.length }))

        if (filters.metroTimeMax !== undefined) chips.push(t('chip_metro_time', { time: filters.metroTimeMax }))
        if (filters.notFirstOrLast) chips.push(t('chip_not_first_or_last'))
        if (filters.ownerOnly) chips.push(t('chip_owner_only'))

        if (filters.storeyMin !== undefined && filters.storeyMax !== undefined) chips.push(t('chip_floor_range', { min: filters.storeyMin, max: filters.storeyMax }))
        else if (filters.storeyMin !== undefined) chips.push(t('chip_floor_from', { min: filters.storeyMin }))
        else if (filters.storeyMax !== undefined) chips.push(t('chip_floor_to', { max: filters.storeyMax }))

        if (filters.buildingYearMin !== undefined && filters.buildingYearMax !== undefined) chips.push(t('chip_year_range', { min: filters.buildingYearMin, max: filters.buildingYearMax }))
        else if (filters.buildingYearMin !== undefined) chips.push(t('chip_year_from', { min: filters.buildingYearMin }))
        else if (filters.buildingYearMax !== undefined) chips.push(t('chip_year_to', { max: filters.buildingYearMax }))

        if (filters.wallMaterial?.length) {
            const parts = filters.wallMaterial.map(m => wallLabels[m]).filter(Boolean)
            if (parts.length) chips.push(parts.join(', '))
        }

        if (filters.repairState?.length) {
            const parts = filters.repairState.map(m => repairLabels[m]).filter(Boolean)
            if (parts.length) chips.push(parts.join(', '))
        }

        if (filters.q?.trim()) chips.push(`«${filters.q.trim()}»`)

        return { summary: chips.length ? chips.join(' · ') : t('chip_all'), chips }
    }
}
