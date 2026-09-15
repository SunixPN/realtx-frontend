export type MapFiltersType = {
    priceMin?: number
    priceMax?: number
    rooms?: number[]
    areaMin?: number
    areaMax?: number
    storeyMin?: number
    storeyMax?: number
    notFirstOrLast?: boolean
    buildingYearMin?: number
    currency?: "USD" | "BYN" | "EUR"
    buildingYearMax?: number
    wallMaterial?: number[]
    repairState?: number[]
    districts?: string[]
    metroTimeMax?: number
    ownerOnly?: boolean
    q?: string
}

export function normalizeFilters(filters: MapFiltersType): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, v]) =>
            v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)
        )
    )
}

function isCurrency(param: string): param is "USD" | "BYN" | "EUR" {
    return ["USD", "BYN", "EUR"].includes(param)
}

export function parseFiltersFromSearchParams(
    sp: URLSearchParams | { get: (key: string) => string | null }
): MapFiltersType {
    const filters: MapFiltersType = {}
    const get = (k: string) => (sp as URLSearchParams).get(k)

    const priceMin = get('priceMin'); if (priceMin) filters.priceMin = Number(priceMin)
    const priceMax = get('priceMax'); if (priceMax) filters.priceMax = Number(priceMax)

    const rooms = get('rooms'); if (rooms) filters.rooms = rooms.split(',').map(Number)

    const areaMin = get('areaMin'); if (areaMin) filters.areaMin = Number(areaMin)
    const areaMax = get('areaMax'); if (areaMax) filters.areaMax = Number(areaMax)

    const storeyMin = get('storeyMin'); if (storeyMin) filters.storeyMin = Number(storeyMin)
    const storeyMax = get('storeyMax'); if (storeyMax) filters.storeyMax = Number(storeyMax)
    const notFirstOrLast = get('notFirstOrLast'); if (notFirstOrLast) filters.notFirstOrLast = notFirstOrLast === 'true'

    const buildingYearMin = get('buildingYearMin'); if (buildingYearMin) filters.buildingYearMin = Number(buildingYearMin)
    const buildingYearMax = get('buildingYearMax'); if (buildingYearMax) filters.buildingYearMax = Number(buildingYearMax)

    const wallMaterial = get('wallMaterial'); if (wallMaterial) filters.wallMaterial = wallMaterial.split(',').map(Number)
    const repairState = get('repairState'); if (repairState) filters.repairState = repairState.split(',').map(Number)
    const districts = get('districts'); if (districts) filters.districts = districts.split(',')

    const metroTimeMax = get('metroTimeMax'); if (metroTimeMax) filters.metroTimeMax = Number(metroTimeMax)
    const ownerOnly = get('ownerOnly'); if (ownerOnly) filters.ownerOnly = ownerOnly === 'true'
    const currency = get("currency"); if (currency && isCurrency(currency)) filters.currency =  currency
    const q = get('q'); if (q) filters.q = q

    return filters
}

export function serializeFiltersToSearchParams(filters: MapFiltersType): URLSearchParams {
    const sp = new URLSearchParams()
    const f = normalizeFilters(filters)

    const set = (k: string, v: unknown) => sp.set(k, String(v))

    if (f.priceMin !== undefined) set('priceMin', f.priceMin)
    if (f.currency !== undefined) set('currency', f.currency)
    if (f.priceMax !== undefined) set('priceMax', f.priceMax)
    if (Array.isArray(f.rooms)) set('rooms', (f.rooms as number[]).join(','))
    if (f.areaMin !== undefined) set('areaMin', f.areaMin)
    if (f.areaMax !== undefined) set('areaMax', f.areaMax)
    if (f.storeyMin !== undefined) set('storeyMin', f.storeyMin)
    if (f.storeyMax !== undefined) set('storeyMax', f.storeyMax)
    if (f.notFirstOrLast) set('notFirstOrLast', 'true')
    if (f.buildingYearMin !== undefined) set('buildingYearMin', f.buildingYearMin)
    if (f.buildingYearMax !== undefined) set('buildingYearMax', f.buildingYearMax)
    if (Array.isArray(f.wallMaterial)) set('wallMaterial', (f.wallMaterial as number[]).join(','))
    if (Array.isArray(f.repairState)) set('repairState', (f.repairState as number[]).join(','))
    if (Array.isArray(f.districts)) set('districts', (f.districts as string[]).join(','))
    if (f.metroTimeMax !== undefined) set('metroTimeMax', f.metroTimeMax)
    if (f.ownerOnly) set('ownerOnly', 'true')
    if (f.q !== undefined) set('q', f.q)

    return sp
}

export function countActiveFilters(filters: MapFiltersType): number {
    let count = 0
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) count++
    if (filters.rooms?.length) count++
    if (filters.areaMin !== undefined || filters.areaMax !== undefined) count++
    if (filters.districts?.length) count++
    if (filters.metroTimeMax !== undefined) count++
    if (filters.storeyMin !== undefined || filters.storeyMax !== undefined || filters.notFirstOrLast) count++
    if (filters.buildingYearMin !== undefined || filters.buildingYearMax !== undefined) count++
    if (filters.wallMaterial?.length) count++
    if (filters.repairState?.length) count++
    if (filters.ownerOnly) count++
    if (filters.q?.trim()) count++
    return count
}
