import { mutate as swrMutate } from 'swr'
import { QUERIES } from '@/shared/const/queries'
import type { EstateType, HouseEstatesResponseType } from '@/entities/estate'

// Patches `isInCompare` of an estate in the SWR caches (detail page + house estates lists)
export function patchEstateIsInCompare(id: number, value: boolean) {
    swrMutate(
        (k: unknown) => Array.isArray(k) && k[0] === QUERIES.ESTATE_BY_ID && k[1] === id,
        (data: EstateType | undefined) => data ? { ...data, isInCompare: value } : data,
        { revalidate: false },
    )
    swrMutate(
        (k: unknown) => Array.isArray(k) && k[0] === QUERIES.HOUSE_ESTATES,
        (data: HouseEstatesResponseType | undefined) =>
            data
                ? { ...data, items: data.items.map(i => i.id === id ? { ...i, isInCompare: value } : i) }
                : data,
        { revalidate: false },
    )
}
