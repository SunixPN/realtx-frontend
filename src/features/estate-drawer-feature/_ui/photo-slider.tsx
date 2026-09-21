'use client'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getMainPhoto, getThumbPhoto } from '@/entities/estate'
type Props = {
    photos: string[]
    loading?: boolean
}
export function PhotoSlider({ photos, loading }: Props) {
    const t = useTranslations('estate')
    const [idx, setIdx] = useState(0)
    const thumbsRef = useRef<HTMLDivElement>(null)
    const count = photos.length
    useEffect(() => { setIdx(0) }, [photos])
    useEffect(() => {
        const container = thumbsRef.current
        if (!container) return
        const thumb = container.children[idx] as HTMLElement | undefined
        if (!thumb) return
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }, [idx])
    useEffect(() => {
        if (count < 2) return
        const neighbors = [(idx + 1) % count, (idx - 1 + count) % count]
        for (const i of neighbors) {
            const img = new Image()
            img.src = getMainPhoto(photos[i])
        }
    }, [idx, photos, count])
    const prev = () => setIdx((i) => (i - 1 + count) % count)
    const next = () => setIdx((i) => (i + 1) % count)
    if (loading) {
        return (
            <div className="relative aspect-[4/3] animate-pulse bg-[var(--surface-muted)]" />
        )
    }
    if (count === 0) {
        return (
            <div className="relative aspect-[4/3] bg-[var(--surface-muted)]">
                <div className="flex size-full flex-col items-center justify-center gap-1.5 text-[var(--text-faint)]">
                    <ImageOff className="size-8" aria-hidden />
                    <span className="text-sm">{t('photo_no_photos')}</span>
                </div>
            </div>
        )
    }
    return (
        <div>
            {}
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)]">
                {}
                <img
                    src={getMainPhoto(photos[idx])}
                    alt=""
                    decoding="async"
                    className="size-full object-cover"
                />
                {}
                <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white tabular-nums">
                    {idx + 1} / {count}
                </div>
                {}
                {count > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label={t('photo_prev_aria')}
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label={t('photo_next_aria')}
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </>
                )}
            </div>
            {}
            {count > 1 && (
                <div
                    ref={thumbsRef}
                    className="flex gap-2 overflow-x-auto scroll-smooth px-4 pt-3 pb-1"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {photos.map((src, i) => (
                        <button
                            key={src + i}
                            type="button"
                            aria-label={t('photo_thumb_aria', { n: i + 1 })}
                            onClick={() => setIdx(i)}
                            className="relative shrink-0 overflow-hidden rounded-sm transition"
                            style={{ width: 64, aspectRatio: '4/3' }}
                        >
                            {}
                            <img
                                src={getThumbPhoto(src)}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="size-full object-cover"
                            />
                            {}
                            <span
                                className="absolute inset-0 rounded-sm border-2 transition"
                                style={{
                                    borderColor: i === idx ? 'var(--brand)' : 'transparent',
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
