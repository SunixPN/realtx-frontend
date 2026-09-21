import type { MapFiltersType } from '@/entities/estate'
export type SubscriptionFrequency = 'instant' | 'daily' | 'weekly'
export type SubscriptionTrigger = 'new' | 'price-down'
export type SubscriptionChannel = 'email'

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
