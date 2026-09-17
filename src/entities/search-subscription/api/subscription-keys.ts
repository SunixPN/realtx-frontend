import { QUERIES } from '@/shared/const/queries'

export const subscriptionsKey = () => [QUERIES.SUBSCRIPTIONS] as const

export function isSubscriptionsKey(key: unknown): boolean {
    return Array.isArray(key) && key[0] === QUERIES.SUBSCRIPTIONS
}
