'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard, Zoom } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/zoom'
type Props = {
    photos: string[]
    initialIndex: number
    onClose: (index: number) => void
}
const MAX_ZOOM = 4
export function PhotoLightbox({ photos, initialIndex, onClose }: Props) {
    const t = useTranslations('estate')
    const tCommon = useTranslations('common')
    const [swiper, setSwiper] = useState<SwiperType | null>(null)
    const [idx, setIdx] = useState(initialIndex)
    const [scale, setScale] = useState(1)
    const idxRef = useRef(initialIndex)
    const count = photos.length
    const close = () => onClose(idxRef.current)
    const closeRef = useRef(close)
    useEffect(() => { closeRef.current = close })
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current() }
        document.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = prev
            document.removeEventListener('keydown', onKey)
        }
    }, [])
    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            className="photo-lightbox fixed inset-0 z-[1000] flex flex-col bg-black select-none"
        >
            <div className="flex shrink-0 items-center justify-between px-3 py-2 text-white">
                <span className="text-sm tabular-nums">{idx + 1} / {count}</span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label={t('photo_zoom_out_aria')}
                        disabled={scale <= 1}
                        onClick={() => swiper?.zoom.out()}
                        className="hidden size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:opacity-40 sm:flex"
                    >
                        <ZoomOut className="size-5" />
                    </button>
                    <button
                        type="button"
                        aria-label={t('photo_zoom_in_aria')}
                        disabled={scale >= MAX_ZOOM}
                        onClick={() => swiper?.zoom.in(Math.min(MAX_ZOOM, scale + 1))}
                        className="hidden size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:opacity-40 sm:flex"
                    >
                        <ZoomIn className="size-5" />
                    </button>
                    <button
                        type="button"
                        aria-label={tCommon('close')}
                        onClick={close}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/15"
                    >
                        <X className="size-6" />
                    </button>
                </div>
            </div>
            <div className="relative min-h-0 flex-1">
                <Swiper
                    modules={[Zoom, Keyboard]}
                    initialSlide={initialIndex}
                    slidesPerView={1}
                    spaceBetween={16}
                    zoom={{ maxRatio: MAX_ZOOM, toggle: true }}
                    keyboard={{ enabled: true }}
                    onSwiper={setSwiper}
                    onSlideChange={(s) => { idxRef.current = s.activeIndex; setIdx(s.activeIndex); setScale(1) }}
                    onZoomChange={(_s, value) => setScale(value)}
                    className="size-full"
                >
                    {photos.map((src, i) => (
                        <SwiperSlide key={src + i}>
                            <div className="swiper-zoom-container">
                                <img
                                    src={src}
                                    alt=""
                                    loading={Math.abs(i - initialIndex) <= 1 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    draggable={false}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {count > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label={t('photo_prev_aria')}
                            disabled={idx === 0}
                            onClick={() => swiper?.slidePrev()}
                            className="absolute top-1/2 left-3 z-10 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:opacity-0 sm:flex"
                        >
                            <ChevronLeft className="size-6" />
                        </button>
                        <button
                            type="button"
                            aria-label={t('photo_next_aria')}
                            disabled={idx === count - 1}
                            onClick={() => swiper?.slideNext()}
                            className="absolute top-1/2 right-3 z-10 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:opacity-0 sm:flex"
                        >
                            <ChevronRight className="size-6" />
                        </button>
                    </>
                )}
            </div>
        </div>,
        document.body,
    )
}
