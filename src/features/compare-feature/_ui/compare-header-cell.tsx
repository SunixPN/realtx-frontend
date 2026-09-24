'use client'
import Link from 'next/link'
import { ImageOff, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CompareItemType } from '@/entities/compare'
import { useFormatRooms, useFormatArea } from '@/entities/estate'
import { useRemoveCompare } from '@/entities/compare'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { formatNumber, formatStorey } from '../../estate-drawer-feature/_ui/format'
import { ROUTES } from '@/shared/const/routes'

function priceNode(price: number | null, currency: number) {
    if (price == null) return '—'
    const n = formatNumber(price)
    if (currency === 933) return <>{n}<BynSign /></>
    return `${n} ${currency === 840 ? '$' : '€'}`
}

export function CompareHeaderCell({ item }: { item: CompareItemType }) {
    const t = useTranslations('compare')
    const formatRooms = useFormatRooms()
    const formatArea = useFormatArea()
    const { trigger: remove, isMutating } = useRemoveCompare()
    return (
        <div className="relative flex flex-col bg-surface-raised">
            <button
                type="button"
                aria-label={t('remove_aria')}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(item.id) }}
                disabled={isMutating}
                className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-md bg-surface-raised/90 text-text-muted shadow-sm backdrop-blur-sm hover:text-error transition-colors cursor-pointer disabled:opacity-60"
            >
                <X className="size-4" aria-hidden />
            </button>
            <Link href={`${ROUTES.PROPERTY}/${item.id}`} className="flex flex-col gap-1.5">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-muted">
                    {item.photo ? (
                        <img
                            src={item.photo}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 size-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-text-faint">
                            <ImageOff className="size-8" aria-hidden />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-1.5 px-4 py-3">
                    <div className="text-lg font-semibold text-text-base tabular-nums">
                        {priceNode(item.price, item.priceCurrency)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-text-base">
                        <span>{formatRooms(item.rooms)}</span>
                        <span className="text-border">·</span>
                        <span className="tabular-nums">{formatArea(item.areaTotal)}</span>
                        <span className="text-border">·</span>
                        <span className="tabular-nums">{formatStorey(item.storey, item.storeys)}</span>
                    </div>
                    {item.address && (
                        <div className="truncate text-xs text-text-muted">{item.address}</div>
                    )}
                </div>
            </Link>
        </div>
    )
}
