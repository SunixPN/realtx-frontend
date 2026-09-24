function toNum(v: unknown): number | null {
    if (v === null || v === undefined || v === '') return null
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : null
}

/**
 * Победители в строке: множество индексов с лучшим значением.
 * - Игнорируем null-ячейки (нет данных).
 * - Если все определённые значения равны — никого не подсвечиваем.
 * - Значения приводятся к числу: Postgres numeric приходит строкой.
 */
export function bestIndices(values: (number | string | null)[], best: 'min' | 'max' | 'none'): Set<number> {
    if (best === 'none') return new Set()
    const nums = values.map(toNum)
    const defined = nums.filter((v): v is number => v !== null)
    if (defined.length < 2) return new Set()
    const target = best === 'min' ? Math.min(...defined) : Math.max(...defined)
    const winners = new Set<number>()
    nums.forEach((v, i) => { if (v !== null && v === target) winners.add(i) })
    if (winners.size === defined.length) return new Set()
    return winners
}

export function allEqual(values: (number | string | null)[]): boolean {
    const nums = values.map(toNum)
    if (nums.some(v => v === null)) return false
    if (nums.length < 2) return true
    return nums.every(v => v === nums[0])
}
