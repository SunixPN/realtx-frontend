import type { ViewedItemType } from '@/entities/viewed'
import { APP_TIME_ZONE } from '@/shared/const/time-zone'

export type ViewedGroupKey = 'today' | 'yesterday' | 'earlier'
export type ViewedGroup = { key: ViewedGroupKey; items: ViewedItemType[] }

const DAY_KEY = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

export function groupByDay(items: ViewedItemType[]): ViewedGroup[] {
    const now = Date.now()
    const todayKey = DAY_KEY.format(now)
    const yesterdayKey = DAY_KEY.format(now - 24 * 60 * 60 * 1000)

    const today: ViewedItemType[] = []
    const yesterday: ViewedItemType[] = []
    const earlier: ViewedItemType[] = []

    for (const item of items) {
        const key = DAY_KEY.format(new Date(item.viewedAt))
        if (key >= todayKey) today.push(item)
        else if (key >= yesterdayKey) yesterday.push(item)
        else earlier.push(item)
    }

    const out: ViewedGroup[] = []
    if (today.length) out.push({ key: 'today', items: today })
    if (yesterday.length) out.push({ key: 'yesterday', items: yesterday })
    if (earlier.length) out.push({ key: 'earlier', items: earlier })
    return out
}
