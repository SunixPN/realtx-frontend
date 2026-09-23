export type ViewedItemType = {
    id: number
    viewedAt: string
    isFavorite: boolean
    price: number | null
    pricePerM2: number | null
    priceCurrency: number
    priceChangeDirection: number | null
    rooms: number | null
    areaTotal: number | null
    storey: number | null
    storeys: number | null
    address: string | null
    photos: string[]
    metroStation: string | null
    metroTime: number | null
    sellerType: number | null
    agencyName: string | null
    isActive: boolean
    publishedAt: string | null
    sourceUrl: string | null
    headline: string | null
}
export type ViewedIdsType = { ids: number[] }
