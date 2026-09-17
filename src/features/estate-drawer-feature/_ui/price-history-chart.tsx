'use client'

import { useTranslations } from 'next-intl'
import type { PriceHistoryPoint } from '@/entities/estate'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

const PAD = { l: 44, r: 10, t: 10, b: 22 }
const W = 600
const H = 160

function pickValue(p: PriceHistoryPoint, currency: DisplayCurrency): number | null {
    return currency === 'USD' ? p.usd : currency === 'BYN' ? p.byn : p.eur
}

function formatAxisValue(v: number, suffix: string): string {
    return `${Math.round(v / 1000)}${suffix}`
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

type Props = {
    history: PriceHistoryPoint[]
    currency: DisplayCurrency
}

export function PriceHistoryChart({ history, currency }: Props) {
    const t = useTranslations('estate')
    const rawPoints = history
        .map((h) => ({ date: h.date, v: pickValue(h, currency) }))
        .filter((p): p is { date: string; v: number } => p.v !== null)

    if (rawPoints.length < 2) return null

    const chartW = W - PAD.l - PAD.r
    const chartH = H - PAD.t - PAD.b
    const stepX = chartW / (rawPoints.length - 1)

    const values = rawPoints.map((p) => p.v)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1

    const coords = rawPoints.map((p, i) => ({
        x: PAD.l + i * stepX,
        y: PAD.t + chartH - ((p.v - min) / span) * chartH,
        v: p.v,
        date: p.date,
    }))

    const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')
    const area = `${line} L${coords.at(-1)!.x},${PAD.t + chartH} L${coords[0].x},${PAD.t + chartH} Z`
    const down = rawPoints.at(-1)!.v <= rawPoints[0].v
    const stroke = down ? 'var(--color-success-600, #16a34a)' : 'var(--color-danger-600, #dc2626)'
    const fill = down ? 'var(--color-success-50, #f0fdf4)' : 'var(--color-danger-50, #fff1f2)'

    const midIdx = Math.floor(rawPoints.length / 2)

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={t('chart_aria')}
        >
            {/* горизонтальные сетки и подписи оси Y */}
            {[0, 0.5, 1].map((t) => {
                const y = PAD.t + chartH * t
                const val = max - span * t
                return (
                    <g key={t}>
                        <line
                            x1={PAD.l}
                            x2={W - PAD.r}
                            y1={y}
                            y2={y}
                            stroke="var(--border-default, #e5e7eb)"
                            strokeDasharray="2 3"
                        />
                        <text
                            x={PAD.l - 5}
                            y={y + 3.5}
                            textAnchor="end"
                            fill="var(--text-faint, #9ca3af)"
                            fontSize={10}
                        >
                            {formatAxisValue(val, t('chart_thousands_suffix'))}
                        </text>
                    </g>
                )
            })}

            <path d={area} fill={fill} />
            <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {/* точки */}
            {coords.map((c, i) => (
                <circle
                    key={i}
                    cx={c.x}
                    cy={c.y}
                    r={i === coords.length - 1 ? 4 : 2.5}
                    fill={i === coords.length - 1 ? stroke : 'var(--surface-base, #fff)'}
                    stroke={stroke}
                    strokeWidth={1.5}
                />
            ))}

            {/* подписи дат оси X: первая, средняя, последняя */}
            {[...new Set([0, midIdx, coords.length - 1])].map((i) => (
                <text
                    key={i}
                    x={coords[i].x}
                    y={H - 5}
                    textAnchor={i === 0 ? 'start' : i === coords.length - 1 ? 'end' : 'middle'}
                    fill="var(--text-faint, #9ca3af)"
                    fontSize={10}
                >
                    {formatDate(coords[i].date)}
                </text>
            ))}
        </svg>
    )
}
