'use client'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ImageOff, Maximize2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard, Navigation, Pagination, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import { getMainPhoto, getThumbPhoto } from '@/entities/estate'
import { PhotoLightbox } from './photo-lightbox'
type Props = {
    photos: string[]
    loading?: boolean
}
export function PhotoSlider({ photos, loading }: Props) {
    const t = useTranslations('estate')
    const [idx, setIdx] = useState(0)
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)
    const count = photos.length
    useEffect(() => {
        setIdx(0)
    }, [photos])
    if (loading) {
        return <div className="relative aspect-[4/3] animate-pulse bg-[var(--surface-muted)]" />
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
        <div className="photo-slider">
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)] select-none">
                <Swiper
                    modules={[Navigation, Pagination, Keyboard, Thumbs]}
                    slidesPerView={1}
                    spaceBetween={0}
                    keyboard={{ enabled: true }}
                    navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                    onBeforeInit={(swiper) => {
                        const nav = swiper.params.navigation
                        if (nav && typeof nav === 'object') {
                            nav.prevEl = prevRef.current
                            nav.nextEl = nextRef.current
                        }
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 5,
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    onSlideChange={(s) => setIdx(s.activeIndex)}
                    onSwiper={setMainSwiper}
                    onClick={(s) => setLightboxIndex(s.activeIndex)}
                    className="size-full"
                >
                    {photos.map((src, i) => (
                        <SwiperSlide key={src + i} className="relative">
                            <img
                                src={getMainPhoto(src)}
                                alt=""
                                loading={i === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                draggable={false}
                                className="size-full cursor-zoom-in object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="pointer-events-none absolute right-2 bottom-2 z-10 rounded-full bg-black/50 px-2 py-0.5 text-xs tabular-nums text-white">
                    {idx + 1} / {count}
                </div>
                <button
                    type="button"
                    aria-label={t('photo_open_aria')}
                    onClick={() => setLightboxIndex(idx)}
                    className="absolute top-2 right-2 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                >
                    <Maximize2 className="size-4" />
                </button>
                {count > 1 && (
                    <>
                        <button
                            ref={prevRef}
                            type="button"
                            aria-label={t('photo_prev_aria')}
                            className="absolute top-1/2 left-2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:flex"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            ref={nextRef}
                            type="button"
                            aria-label={t('photo_next_aria')}
                            className="absolute top-1/2 right-2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:flex"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </>
                )}
            </div>
            {count > 1 && (
                <div className="hidden px-4 pt-3 pb-1 sm:block">
                    <Swiper
                        modules={[Thumbs]}
                        onSwiper={setThumbsSwiper}
                        watchSlidesProgress
                        slidesPerView="auto"
                        spaceBetween={8}
                        freeMode
                        className="photo-thumbs"
                    >
                        {photos.map((src, i) => (
                            <SwiperSlide
                                key={src + i}
                                className="!w-16 cursor-pointer overflow-hidden rounded-sm"
                                style={{ aspectRatio: '4/3' }}
                            >
                                <div className="relative size-full">
                                    <img
                                        src={getThumbPhoto(src)}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="size-full object-cover"
                                    />
                                    <span
                                        className="absolute inset-0 rounded-sm border-2 transition"
                                        style={{
                                            borderColor: i === idx ? 'var(--brand)' : 'transparent',
                                        }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={photos}
                    initialIndex={lightboxIndex}
                    onClose={(i) => {
                        setLightboxIndex(null)
                        mainSwiper?.slideTo(i, 0)
                    }}
                />
            )}
        </div>
    )
}
