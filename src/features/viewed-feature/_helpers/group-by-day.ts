import type { ViewedItemType } from '@/entities/viewed'

export type ViewedGroupKey = 'today' | 'yesterday' | 'earlier'
export type ViewedGroup = { key: ViewedGroupKey; items: ViewedItemType[] }

function startOfDay(d: Date): number {
    const c = new Date(d)
    c.setHours(0, 0, 0, 0)
    return c.getTime()
}

// Границы по локальному времени пользователя. today = >= 00:00 сегодня,
// yesterday = вчера 00:00..сегодня 00:00, earlier = всё старше.
export function groupByDay(items: ViewedItemType[]): ViewedGroup[] {
    const now = new Date()
    const todayStart = startOfDay(now)
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000

    const today: ViewedItemType[] = []
    const yesterday: ViewedItemType[] = []
    const earlier: ViewedItemType[] = []

    for (const item of items) {
        const t = new Date(item.viewedAt).getTime()
        if (t >= todayStart) today.push(item)
        else if (t >= yesterdayStart) yesterday.push(item)
        else earlier.push(item)
    }

    const out: ViewedGroup[] = []
    if (today.length) out.push({ key: 'today', items: today })
    if (yesterday.length) out.push({ key: 'yesterday', items: yesterday })
    if (earlier.length) out.push({ key: 'earlier', items: earlier })
    return out
}
