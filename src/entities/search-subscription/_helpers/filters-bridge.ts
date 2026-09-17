import type { MapFiltersType } from '@/entities/estate'
import type { SubscriptionFiltersSnapshotType } from '../api/subscription-types'

const CURRENCY_TO_CODE: Record<'USD' | 'BYN' | 'EUR', number> = {
    USD: 840,
    BYN: 933,
    EUR: 978,
}

const CODE_TO_CURRENCY: Record<number, 'USD' | 'BYN' | 'EUR'> = {
    840: 'USD',
    933: 'BYN',
    978: 'EUR',
}

/** MapFiltersType → payload для POST/PATCH (`displayCurrency` числом). */
export function toBackendFilters(filters: MapFiltersType): SubscriptionFiltersSnapshotType {
    const out: SubscriptionFiltersSnapshotType = {}
    for (const [k, v] of Object.entries(filters)) {
        if (v === undefined || v === null) continue
        if (Array.isArray(v) && v.length === 0) continue
        if (k === 'currency') {
            const code = CURRENCY_TO_CODE[v as 'USD' | 'BYN' | 'EUR']
            if (code !== undefined) out.displayCurrency = code
            continue
        }
        out[k] = v
    }
    return out
}

/** Снимок из БД → MapFiltersType (для рендера формы и панели фильтров). */
export function fromBackendFilters(snapshot: SubscriptionFiltersSnapshotType): MapFiltersType {
    const out: MapFiltersType = {}
    for (const [k, v] of Object.entries(snapshot)) {
        if (v === undefined || v === null) continue
        if (k === 'displayCurrency' && typeof v === 'number') {
            const label = CODE_TO_CURRENCY[v]
            if (label) out.currency = label
            continue
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(out as any)[k] = v
    }
    return out
}
