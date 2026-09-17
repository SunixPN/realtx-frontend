import type { MapFiltersType } from '@/entities/estate'

export type SubscriptionFrequency = 'instant' | 'daily' | 'weekly'
export type SubscriptionTrigger = 'new' | 'price-down'
export type SubscriptionChannel = 'email'

// Бэк хранит фильтры в JSONB как EstateFilterBaseDto (displayCurrency=число
// 840/933/978), а фронт оперирует MapFiltersType (currency='USD'|'BYN'|'EUR').
// Нормализация между этими двумя видами — в _helpers/filters-bridge.ts.
export type SubscriptionFiltersSnapshotType = Record<string, unknown>

export type SearchSubscriptionType = {
    id: string
    name: string
    filters: SubscriptionFiltersSnapshotType
    summary: string
    chips: string[]
    total: number
    fresh: number
    frequency: SubscriptionFrequency
    triggers: SubscriptionTrigger[]
    channels: SubscriptionChannel[]
    quietHours: boolean
    paused: boolean
    lastCheckedAt: string | null
    createdAt: string
    updatedAt: string
}

export type CreateSubscriptionDtoType = {
    name: string
    filters: MapFiltersType
    frequency: SubscriptionFrequency
    triggers: SubscriptionTrigger[]
    channels: SubscriptionChannel[]
    quietHours?: boolean
}

export type UpdateSubscriptionDtoType = Partial<CreateSubscriptionDtoType> & {
    paused?: boolean
}
