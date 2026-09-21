

export const HEAT_COLORS = {
    HIGH:   '#10b981', 
    MID:    '#f59e0b', 
    LOW:    '#ef4444', 
    NONE:   '#94a3b8', 
} as const
function lerpHex(a: string, b: string, t: number): string {
    const r = (s: string, o: number) => parseInt(s.slice(o, o + 2), 16)
    const lerp = (x: number, y: number) => Math.round(x + (y - x) * t)
    const hex = (n: number) => n.toString(16).padStart(2, '0')
    return `#${hex(lerp(r(a, 1), r(b, 1)))}${hex(lerp(r(a, 3), r(b, 3)))}${hex(lerp(r(a, 5), r(b, 5)))}`
}
export function scoreToColor(score: number): string {
    const s = Math.max(0, Math.min(100, score))
    return s >= 50
        ? lerpHex(HEAT_COLORS.MID, HEAT_COLORS.HIGH, (s - 50) / 50)
        : lerpHex(HEAT_COLORS.LOW, HEAT_COLORS.MID, s / 50)
}
export const HEAT_COLOR_EXPRESSION = [
    'interpolate', ['linear'], ['coalesce', ['get', 'score'], 0],
    0,   HEAT_COLORS.LOW,
    50,  HEAT_COLORS.MID,
    100, HEAT_COLORS.HIGH,
] as unknown as mapboxgl.Expression
