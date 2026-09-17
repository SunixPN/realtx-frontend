'use client'

import { useTranslations } from 'next-intl'
import { MINSK_DISTRICTS } from './estate-types'

const MINSK_DISTRICT_KEYS = [
    'central', 'sovetsky', 'pervomaysky', 'partizansky',
    'zavodskoy', 'leninsky', 'moskovsky', 'oktyabrsky', 'frunzensky',
] as const

export function useWallMaterialLabels(): Record<number, string> {
    const t = useTranslations('estate')
    return {
        1: t('wall_panel'),
        2: t('wall_brick'),
        3: t('wall_monolith'),
        4: t('wall_frame_block'),
        5: t('wall_wooden'),
        6: t('wall_aerated'),
    }
}

export function useRepairStateLabels(): Record<number, string> {
    const t = useTranslations('estate')
    return {
        1: t('repair_none'),
        2: t('repair_needs'),
        3: t('repair_cosmetic'),
        4: t('repair_good'),
        5: t('repair_euro'),
        6: t('repair_designer'),
    }
}

export function useMetroTimeOptions(): Array<{ value: string; label: string }> {
    const t = useTranslations('estate')
    return [
        { value: '5',  label: t('metro_up_to', { n: 5 }) },
        { value: '10', label: t('metro_up_to', { n: 10 }) },
        { value: '15', label: t('metro_up_to', { n: 15 }) },
        { value: '20', label: t('metro_up_to', { n: 20 }) },
        { value: '30', label: t('metro_up_to', { n: 30 }) },
    ]
}

export function useMinskDistrictOptions(): Array<{ value: string; label: string }> {
    const t = useTranslations('estate')
    return MINSK_DISTRICTS.map((value, i) => ({
        value,
        label: t(`district_${MINSK_DISTRICT_KEYS[i]}`),
    }))
}

export function useDistrictLabel(): (districtName: string) => string {
    const options = useMinskDistrictOptions()
    const map = new Map(options.map((o) => [o.value, o.label]))
    return (name) => map.get(name) ?? name
}

export function useFormatRooms(): (rooms: number | null) => string {
    const t = useTranslations('estate')
    return (rooms) => {
        if (rooms == null) return '—'
        if (rooms >= 5) return t('rooms_5plus')
        return t('rooms_n', { count: rooms })
    }
}
