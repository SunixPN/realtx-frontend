export const COMPARE_LIMIT = 4

export type CompareItemType = {
    id: number
    addedAt: string
    price: number | null
    priceUsd: number | null
    priceByn: number | null
    priceEur: number | null
    pricePerM2: number | null
    priceCurrency: number
    priceChangeDirection: number | null
    priceDeltaUsd: number | null
    priceDeltaPctUsd: number | null
    rooms: number | null
    areaTotal: number | null
    areaLiving: number | null
    areaKitchen: number | null
    balconyType: number | null
    storey: number | null
    storeys: number | null
    buildingYear: number | null
    wallMaterial: number | null
    repairState: number | null
    districtName: string | null
    address: string | null
    photo: string | null
    metroStation: string | null
    metroTime: number | null
    sellerType: number | null
    isActive: boolean
    publishedAt: string | null
    sourceUrl: string | null
    headline: string | null
}

export type CompareListType = {
    items: CompareItemType[]
    count: number
    limit: number
}

export type CompareIdsType = {
    ids: number[]
    limit: number
}

export type ComparePreferencesType = {
    hiddenRows: string[]
}
