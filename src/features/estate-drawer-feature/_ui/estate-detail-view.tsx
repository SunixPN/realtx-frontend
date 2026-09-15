'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink, Heart, Train, X } from 'lucide-react'
import { estateByIdQuery, REPAIR_STATE_LABELS, WALL_MATERIAL_LABELS } from '@/entities/estate'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { PhotoSlider } from './photo-slider'
import { PriceDisplay, PricePerM2Display } from './price-display'
import { PriceChangeBadge } from './price-change-badge'
import { PriceHistorySection } from './price-history-section'
import { formatArea, formatRooms, formatStorey } from './format'
import {authQuery} from "@/entities/me/api/auth-query";
import {IconLoader} from "@/shared/ui/ui-icons";

type Props = {
    id: number
    onBack?: () => void
    onClose: () => void
    showBack: boolean
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-2">
            <dt className="shrink-0 text-sm text-[var(--text-faint)]">{label}</dt>
            <dd className="min-w-0 text-right text-sm text-[var(--text-base)]">{value}</dd>
        </div>
    )
}

export function EstateDetailView({ id, onBack, onClose, showBack }: Props) {
    const { currency } = useDisplayCurrency()
    const { data: estate, isPending, isError } = useQuery(estateByIdQuery(id, currency))

    const { data, isLoading } = useQuery(authQuery)

    return (
        <div className="flex h-full flex-col">
            <header className="flex shrink-0 items-center gap-2 border-b border-[var(--border-default)] px-3 py-2.5">
                {showBack ? (
                    <button
                        type="button"
                        aria-label="Назад"
                        onClick={onBack}
                        className="flex size-9 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                ) : (
                    <div className="size-9 shrink-0" />
                )}
                <span className="flex-1 truncate text-base font-medium text-[var(--text-base)]">
                    {estate ? `${formatRooms(estate.rooms)} квартира` : 'Детали объекта'}
                </span>
                <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={onClose}
                    className="flex size-9 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                >
                    <X className="size-5" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto">
                {isError && (
                    <div className="m-4 rounded-md bg-[var(--error-bg)] p-3 text-sm text-[var(--error)]">
                        Не удалось загрузить объект.
                    </div>
                )}

                <PhotoSlider photos={estate?.photos ?? []} loading={isPending} />

                {estate && (
                    <div className="flex flex-col gap-5 p-4">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <PriceDisplay
                                    price={estate.price}
                                    currency={currency}
                                    className="text-3xl font-semibold text-[var(--text-base)]"
                                />
                                {estate.priceChange && (
                                    <PriceChangeBadge
                                        change={estate.priceChange}
                                        currency={currency}
                                        variant="compact"
                                    />
                                )}
                            </div>
                            <div className="mt-1">
                                <PricePerM2Display
                                    price={estate.pricePerM2}
                                    currency={currency}
                                    className="text-sm text-[var(--text-muted)]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {estate.sourceUrl && (
                                <a
                                    href={estate.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--border-default)] px-4 text-sm font-medium text-[var(--text-base)] hover:bg-[var(--surface-muted)]"
                                >
                                    <ExternalLink className="size-4" /> На realt.by
                                </a>
                            )}
                            {
                                isLoading ? (
                                    <div
                                        aria-label="Проверка авторизации"
                                        className="flex size-9 items-center justify-center rounded-xl self-center text-text-muted"
                                    >
                                        <IconLoader size={18} />
                                    </div>
                                ) : (
                                    <>
                                        {data?.user ? (
                                            <button
                                                type="button"
                                                className="flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--brand)] px-4 text-sm font-medium text-[var(--text-on-brand)] hover:bg-[var(--brand-hover)]"
                                            >
                                                <Heart className="size-5" /> В избранное
                                            </button>
                                        ) : <></>}
                                    </>
                                )
                            }
                        </div>

                        <div>
                            {estate.address && (
                                <div className="text-base text-[var(--text-base)]">{estate.address}</div>
                            )}
                            {estate.metroStation && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                    <Train className="size-4 text-[var(--text-faint)]" aria-hidden />
                                    {estate.metroStation}
                                    {estate.districtName && (
                                        <span className="text-[var(--text-faint)]">· {estate.districtName}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <PriceHistorySection
                            history={estate.priceHistory}
                            priceChange={estate.priceChange}
                            currency={currency}
                        />

                        <section>
                            <h3 className="mb-1 text-base font-semibold text-[var(--text-base)]">Характеристики</h3>
                            <dl className="divide-y divide-[var(--border-default)]">
                                <Row label="Комнат" value={String(estate.rooms ?? '—')} />
                                <Row label="Общая площадь" value={formatArea(estate.areaTotal)} />
                                <Row label="Жилая площадь" value={formatArea(estate.areaLiving)} />
                                <Row label="Площадь кухни" value={formatArea(estate.areaKitchen)} />
                                <Row label="Этаж" value={formatStorey(estate.storey, estate.storeys)} />
                                <Row label="Год постройки" value={String(estate.buildingYear ?? '—')} />
                                <Row
                                    label="Тип дома"
                                    value={estate.wallMaterial != null ? (WALL_MATERIAL_LABELS[estate.wallMaterial] ?? '—') : '—'}
                                />
                                <Row
                                    label="Ремонт"
                                    value={estate.repairState != null ? (REPAIR_STATE_LABELS[estate.repairState] ?? '—') : '—'}
                                />
                            </dl>
                        </section>

                        {estate.description && (
                            <section>
                                <h3 className="mb-2 text-base font-semibold text-[var(--text-base)]">Описание</h3>
                                <p className="text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-line">
                                    {estate.description}
                                </p>
                            </section>
                        )}

                        <section className="rounded-lg bg-[var(--surface-muted)] p-4">
                            <div className="text-sm text-[var(--text-faint)]">
                                {(estate.sellerType === 0 && estate.agencyName) ? 'Агентство' : 'Собственник / Компания'}
                            </div>
                            {estate.sellerType === 0 && estate.agencyName && (
                                <div className="mt-0.5 text-base font-medium text-[var(--text-base)]">
                                    {estate.agencyName}
                                </div>
                            )}
                            <p className="mt-2 text-xs text-[var(--text-faint)]">
                                Контакты доступны в оригинальном объявлении на realt.by
                            </p>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
