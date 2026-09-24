import type { ReactNode } from 'react'
import type { CompareItemType } from '@/entities/compare'
import { WALL_MATERIAL_LABELS, REPAIR_STATE_LABELS } from '@/entities/estate'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { formatNumber, formatStorey } from '../../estate-drawer-feature/_ui/format'

export type Row = {
    labelKey: string
    render: (l: CompareItemType) => ReactNode
    compare: (l: CompareItemType) => number | string | null
    best: 'min' | 'max' | 'none'
}

export type Section = {
    titleKey: string
    rows: Row[]
}

function priceNode(price: number | null, currency: number): ReactNode {
    if (price == null) return '—'
    const n = formatNumber(price)
    if (currency === 933) return <>{n}<BynSign /></>
    return `${n} ${currency === 840 ? '$' : '€'}`
}

function pricePerM2Node(price: number | null, currency: number): ReactNode {
    if (price == null) return '—'
    const n = formatNumber(Math.round(price))
    if (currency === 933) return <>{n}<BynSign /> / м²</>
    return `${n} ${currency === 840 ? '$' : '€'} / м²`
}

function priceChangeNode(deltaUsd: number | null, pct: number | null): ReactNode {
    if (deltaUsd === null || deltaUsd === 0) return <span className="text-text-faint">—</span>
    const sign = deltaUsd < 0 ? '−' : '+'
    const abs = Math.abs(deltaUsd)
    const pctText = pct !== null ? ` (${sign}${Math.abs(pct)}%)` : ''
    return (
        <span className={deltaUsd < 0 ? 'text-success' : 'text-error'}>
            {sign}{formatNumber(abs)} $ {pctText}
        </span>
    )
}

function balconyLabel(t: number | null): string {
    if (t == null) return '—'
    const map: Record<number, string> = { 0: 'Нет', 1: 'Балкон', 2: 'Лоджия', 3: 'Балкон и лоджия' }
    return map[t] ?? '—'
}

function sellerLabel(t: number | null): string {
    if (t == null) return '—'
    return t === 0 ? 'Агентство' : 'Собственник'
}

function formatDate(iso: string | null): string {
    if (!iso) return '—'
    try {
        const d = new Date(iso)
        return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
    } catch { return '—' }
}

function daysOnMarket(iso: string | null): number | null {
    if (!iso) return null
    const then = new Date(iso).getTime()
    if (Number.isNaN(then)) return null
    return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24))
}

function formatDays(n: number | null): string {
    if (n == null) return '—'
    if (n === 0) return 'сегодня'
    if (n === 1) return '1 день'
    if (n < 5) return `${n} дня`
    return `${n} дней`
}

export const SECTIONS: Section[] = [
    {
        titleKey: 'section_price',
        rows: [
            {
                labelKey: 'price',
                render: (l) => (
                    <span className="text-lg font-semibold text-text-base tabular-nums">
                        {priceNode(l.price, l.priceCurrency)}
                    </span>
                ),
                compare: (l) => l.price,
                best: 'min',
            },
            {
                labelKey: 'price_usd',
                render: (l) => <span className="tabular-nums">{priceNode(l.priceUsd, 840)}</span>,
                compare: (l) => l.priceUsd,
                best: 'min',
            },
            {
                labelKey: 'price_byn',
                render: (l) => <span className="tabular-nums">{priceNode(l.priceByn, 933)}</span>,
                compare: (l) => l.priceByn,
                best: 'min',
            },
            {
                labelKey: 'price_eur',
                render: (l) => <span className="tabular-nums">{priceNode(l.priceEur, 978)}</span>,
                compare: (l) => l.priceEur,
                best: 'min',
            },
            {
                labelKey: 'price_per_m2',
                render: (l) => <span className="tabular-nums">{pricePerM2Node(l.pricePerM2, l.priceCurrency)}</span>,
                compare: (l) => l.pricePerM2,
                best: 'min',
            },
            {
                labelKey: 'price_change',
                render: (l) => priceChangeNode(l.priceDeltaUsd, l.priceDeltaPctUsd),
                // Нет изменения → трактуем как 0. Отрицательная дельта (падение) — лучший.
                compare: (l) => l.priceDeltaUsd ?? 0,
                best: 'min',
            },
        ],
    },
    {
        titleKey: 'section_flat',
        rows: [
            {
                labelKey: 'rooms',
                render: (l) => l.rooms ?? '—',
                compare: (l) => l.rooms,
                best: 'max',
            },
            {
                labelKey: 'area_total',
                render: (l) => l.areaTotal != null ? <span className="tabular-nums">{l.areaTotal} м²</span> : '—',
                compare: (l) => l.areaTotal,
                best: 'max',
            },
            {
                labelKey: 'area_living',
                render: (l) => l.areaLiving != null ? <span className="tabular-nums">{l.areaLiving} м²</span> : '—',
                compare: (l) => l.areaLiving,
                best: 'max',
            },
            {
                labelKey: 'area_kitchen',
                render: (l) => l.areaKitchen != null ? <span className="tabular-nums">{l.areaKitchen} м²</span> : '—',
                compare: (l) => l.areaKitchen,
                best: 'max',
            },
            {
                labelKey: 'balcony',
                render: (l) => balconyLabel(l.balconyType),
                // Балкон/лоджия есть — лучше, чем без.
                compare: (l) => l.balconyType == null ? null : (l.balconyType === 0 ? 0 : 1),
                best: 'max',
            },
            {
                labelKey: 'repair',
                render: (l) => l.repairState != null ? (REPAIR_STATE_LABELS[l.repairState] ?? '—') : '—',
                compare: () => null,
                best: 'none',
            },
        ],
    },
    {
        titleKey: 'section_house',
        rows: [
            {
                labelKey: 'storey',
                render: (l) => <span className="tabular-nums">{formatStorey(l.storey, l.storeys)}</span>,
                compare: () => null,
                best: 'none',
            },
            {
                labelKey: 'building_year',
                render: (l) => l.buildingYear != null ? <span className="tabular-nums">{l.buildingYear}</span> : '—',
                compare: (l) => l.buildingYear,
                best: 'max',
            },
            {
                labelKey: 'wall_material',
                render: (l) => l.wallMaterial != null ? (WALL_MATERIAL_LABELS[l.wallMaterial] ?? '—') : '—',
                compare: () => null,
                best: 'none',
            },
            {
                labelKey: 'district',
                render: (l) => l.districtName ?? '—',
                compare: () => null,
                best: 'none',
            },
        ],
    },
    {
        titleKey: 'section_metro',
        rows: [
            {
                labelKey: 'metro_station',
                render: (l) => l.metroStation ?? '—',
                compare: () => null,
                best: 'none',
            },
            {
                labelKey: 'metro_time',
                render: (l) => l.metroTime != null ? <span className="tabular-nums">{l.metroTime} мин</span> : '—',
                compare: (l) => l.metroTime,
                best: 'min',
            },
        ],
    },
    {
        titleKey: 'section_publication',
        rows: [
            {
                labelKey: 'seller',
                render: (l) => sellerLabel(l.sellerType),
                // Собственник (sellerType !== 0) выгоднее — без комиссии агентства.
                compare: (l) => l.sellerType == null ? null : (l.sellerType === 0 ? 0 : 1),
                best: 'max',
            },
            {
                labelKey: 'published_at',
                render: (l) => <span className="tabular-nums">{formatDate(l.publishedAt)}</span>,
                compare: (l) => l.publishedAt ? new Date(l.publishedAt).getTime() : null,
                best: 'max',
            },
            {
                labelKey: 'days_on_market',
                render: (l) => <span className="tabular-nums">{formatDays(daysOnMarket(l.publishedAt))}</span>,
                compare: (l) => daysOnMarket(l.publishedAt),
                best: 'min',
            },
        ],
    },
]
