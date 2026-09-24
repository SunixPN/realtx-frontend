export type EstateMapPointType = {
    id: number
    lat: number
    lng: number
    price: number | null
    priceCurrency: number | null
    originalPrice: number | null
    originalCurrency: number | null
    rooms: number | null
    isViewed?: boolean
}
export type PriceHistoryPoint = {
    date: string
    usd: number | null
    byn: number | null
    eur: number | null
}
export type PriceChange = {
    deltaUsd: number | null
    deltaByn: number | null
    deltaEur: number | null
    deltaPctUsd: number | null
    deltaPctByn: number | null
    deltaPctEur: number | null
    changes: number
}
export type EstateType = {
    id: number
    isFavorite: boolean
    isInCompare: boolean
    isViewed: boolean
    sourceUuid: string
    sourceUrl: string | null
    headline: string | null
    description: string | null
    price: number | null
    priceCurrency: number | null
    pricePerM2: number | null
    priceChangeDirection: number | null
    priceHistory: PriceHistoryPoint[]
    priceChange: PriceChange | null
    rooms: number | null
    areaTotal: number | null
    areaLiving: number | null
    areaKitchen: number | null
    storey: number | null
    storeys: number | null
    buildingYear: number | null
    wallMaterial: number | null
    repairState: number | null
    address: string | null
    townName: string | null
    districtName: string | null
    lat: number | null
    lng: number | null
    metroStation: string | null
    metroLineId: number | null
    metroTime: number | null
    photos: string[]
    sellerType: number | null
    agencyName: string | null
    isActive: boolean
    phone?: string | null
    publishedAt: string | null
    createdAt: string
    updatedAt: string
}
export type EstateShortType = {
    id: number
    isFavorite: boolean
    isInCompare: boolean
    isViewed: boolean
    price: number | null
    pricePerM2: number | null
    priceCurrency: number | null
    originalPrice: number | null
    originalCurrency: number | null
    rooms: number | null
    areaTotal: number | null
    storey: number | null
    storeys: number | null
    address: string | null
    metroStation: string | null
    metroTime: number | null
    photo: string | null
    sellerType: number | null
}
export type HouseEstatesResponseType = {
    items: EstateShortType[]
}
export type DistrictProfitabilityType = {
    district: string
    score: number
    avgPricePerM2: number | null
    currency: number
    matchCount: number
    mode: 'filters' | 'price'
}
export type DistrictFeatureProperties = {
    name: string
    fallback?: boolean
    centroid: { lng: number; lat: number }
}
export type DistrictGeoJSONType = {
    type: 'FeatureCollection'
    features: Array<{
        type: 'Feature'
        properties: DistrictFeatureProperties
        geometry: {
            type: 'Polygon' | 'MultiPolygon'
            coordinates: number[][][] | number[][][][]
        }
    }>
}
export type EstateSearchResponseType = {
    total: number
    page: number
    limit: number
    estates: EstateType[]
}

export const PRICE_CURRENCY_LABELS: Record<number, string> = {
    840: '$',
    933: 'Br',
    978: '€',
}
export const WALL_MATERIAL_LABELS: Record<number, string> = {
    1: 'Панельный',
    2: 'Кирпичный',
    3: 'Монолитный',
    4: 'Каркасно-блочный',
    5: 'Деревянный',
    6: 'Газосиликатный',
}
export const REPAIR_STATE_LABELS: Record<number, string> = {
    1: 'Без ремонта',
    2: 'Требует ремонта',
    3: 'Косметический',
    4: 'Хороший',
    5: 'Евроремонт',
    6: 'Дизайнерский',
}
export const MINSK_DISTRICTS = [
    'Центральный',
    'Советский',
    'Первомайский',
    'Партизанский',
    'Заводской',
    'Ленинский',
    'Московский',
    'Октябрьский',
    'Фрунзенский',
] as const
export const METRO_TIME_OPTIONS = [
    { value: '5',  label: 'до 5 мин' },
    { value: '10', label: 'до 10 мин' },
    { value: '15', label: 'до 15 мин' },
    { value: '20', label: 'до 20 мин' },
    { value: '30', label: 'до 30 мин' },
]
