import { QUERIES } from '@/shared/const/queries'
import { normalizeFilters, type MapFiltersType } from '../model/estate-filters'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

export const mapPointsKey = (filters: MapFiltersType = {}, displayCurrency: DisplayCurrency = 'USD') =>
    [QUERIES.MAP_POINTS, displayCurrency, normalizeFilters(filters)] as const

export const districtProfitabilityKey = (filters: MapFiltersType = {}, displayCurrency: DisplayCurrency = 'USD') =>
    [QUERIES.DISTRICT_PROFITABILITY, displayCurrency, normalizeFilters(filters)] as const

export const districtsGeojsonKey = () => [QUERIES.DISTRICTS_GEOJSON] as const

export const estateByIdKey = (id: number, displayCurrency: DisplayCurrency = 'USD') =>
    [QUERIES.ESTATE_BY_ID, id, displayCurrency] as const
