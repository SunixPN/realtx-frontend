'use client'

import { useState, type ReactNode } from 'react'
import { Bell, SlidersHorizontal } from 'lucide-react'
import { SearchSuggest } from './search-suggest'
import { UIChip } from '@/shared/ui/ui-chip'
import { UIRangeField } from '@/shared/ui/ui-range-field'
import { UICheckbox } from '@/shared/ui/ui-checkbox'
import { UISelect } from '@/shared/ui/ui-select'
import { UIButton } from '@/shared/ui/ui-button'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { cn } from '@/shared/helpers/cn'
import {
    MINSK_DISTRICTS,
    METRO_TIME_OPTIONS,
    countActiveFilters,
    type MapFiltersType,
} from '@/entities/estate'
import type { DisplayCurrency } from '../_hooks/use-display-currency'
import {useQuery} from "@tanstack/react-query";
import {authQuery} from "@/entities/me/api/auth-query";
import {IconLoader} from "@/shared/ui/ui-icons";

type FilterBarProps = {
    filters: MapFiltersType
    onChange: (updater: (prev: MapFiltersType) => MapFiltersType) => void
    onClear: () => void
    onOpenDrawer: () => void
    drawerOpen: boolean
    total: number
    currency: DisplayCurrency
    onCurrencyChange: (c: DisplayCurrency) => void
}

const CURRENCY_ORDER: DisplayCurrency[] = ['USD', 'BYN', 'EUR']

function currencySymbol(c: DisplayCurrency): ReactNode {
    if (c === 'USD') return '$'
    if (c === 'EUR') return '€'
    return <BynSign />
}

function formatPriceLabel(filters: MapFiltersType, currency: DisplayCurrency): ReactNode | undefined {
    const sym = currencySymbol(currency)
    if (filters.priceMin && filters.priceMax) return <>{filters.priceMin.toLocaleString('ru-RU')} – {filters.priceMax.toLocaleString('ru-RU')} {sym}</>
    if (filters.priceMin) return <>от {filters.priceMin.toLocaleString('ru-RU')} {sym}</>
    if (filters.priceMax) return <>до {filters.priceMax.toLocaleString('ru-RU')} {sym}</>
    return undefined
}

function formatRoomsLabel(filters: MapFiltersType): string | undefined {
    if (!filters.rooms?.length) return undefined
    return filters.rooms.map(r => r >= 5 ? '5+' : String(r)).join('–')
}

function formatAreaLabel(filters: MapFiltersType): string | undefined {
    if (filters.areaMin && filters.areaMax) return `${filters.areaMin} – ${filters.areaMax} м²`
    if (filters.areaMin) return `от ${filters.areaMin} м²`
    if (filters.areaMax) return `до ${filters.areaMax} м²`
    return undefined
}

const ROOM_OPTIONS = [1, 2, 3, 4, 5]

function pluralObjects(n: number): string {
    const last = n % 10
    const two = n % 100
    if (two >= 11 && two <= 14) return 'объектов'
    if (last === 1) return 'объект'
    if (last >= 2 && last <= 4) return 'объекта'
    return 'объектов'
}

export function FilterBar({ filters, onChange, onClear, onOpenDrawer, drawerOpen, total, currency, onCurrencyChange }: FilterBarProps) {
    const [saved, setSaved] = useState(false)

    const { data, isLoading } = useQuery(authQuery)

    const extraCount = countActiveFilters(filters) -
        (formatPriceLabel(filters, currency) ? 1 : 0) -
        (formatRoomsLabel(filters) ? 1 : 0) -
        (formatAreaLabel(filters) ? 1 : 0) -
        (filters.districts?.length ? 1 : 0) -
        (filters.metroTimeMax ? 1 : 0)

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-page p-2 shadow-lg">
            {/* Поиск по адресу/метро — подсказки из /estate/suggest */}
            <SearchSuggest
                value={filters.q}
                onChange={(next) => onChange(f => ({ ...f, q: next }))}
            />

            {/* Цена. Кнопки $/[Br]/€ — НЕ фильтр, а валюта отображения;
             * priceMin/priceMax отправляются на бэк уже в этой валюте, и бэк
             * возвращает `price` в ней же. Смена валюты триггерит новый запрос
             * через queryKey. */}
            <UIChip
                label="Цена"
                value={formatPriceLabel(filters, currency)}
                onClear={() => onChange(f => ({ ...f, priceMin: undefined, priceMax: undefined }))}
            >
                <div className="flex flex-col gap-3 w-72">
                    <div className="flex gap-2">
                        {CURRENCY_ORDER.map(c => (
                            <button
                                key={c}
                                onClick={() => onCurrencyChange(c)}
                                className={cn(
                                    'px-3 py-1 rounded-full text-sm border transition-colors',
                                    currency === c
                                        ? 'bg-brand text-white border-brand'
                                        : 'border-border text-text-base hover:bg-surface-subtle',
                                )}
                            >
                                {currencySymbol(c)}
                            </button>
                        ))}
                    </div>
                    <UIRangeField
                        unit={currencySymbol(currency)}
                        fromValue={filters.priceMin ?? ''}
                        toValue={filters.priceMax ?? ''}
                        onFromChange={v => onChange(f => ({ ...f, priceMin: v ? Number(v) : undefined }))}
                        onToChange={v => onChange(f => ({ ...f, priceMax: v ? Number(v) : undefined }))}
                        debounceMs={400}
                    />
                </div>
            </UIChip>

            {/* Комнаты */}
            <UIChip
                label="Комнаты"
                value={formatRoomsLabel(filters)}
                onClear={() => onChange(f => ({ ...f, rooms: undefined }))}
            >
                <div className="flex gap-2">
                    {ROOM_OPTIONS.map(r => {
                        const active = filters.rooms?.includes(r)
                        return (
                            <button
                                key={r}
                                onClick={() => onChange(f => {
                                    const cur = f.rooms ?? []
                                    return { ...f, rooms: active ? cur.filter(x => x !== r) : [...cur, r] }
                                })}
                                className={cn(
                                    'w-10 h-10 rounded-full text-sm border transition-colors',
                                    active
                                        ? 'bg-brand text-white border-brand'
                                        : 'border-border text-text-base hover:bg-surface-subtle',
                                )}
                            >
                                {r >= 5 ? '5+' : r}
                            </button>
                        )
                    })}
                </div>
            </UIChip>

            {/* Площадь */}
            <UIChip
                label="Площадь"
                value={formatAreaLabel(filters)}
                onClear={() => onChange(f => ({ ...f, areaMin: undefined, areaMax: undefined }))}
            >
                <div className="w-64">
                    <UIRangeField
                        unit="м²"
                        fromValue={filters.areaMin ?? ''}
                        toValue={filters.areaMax ?? ''}
                        onFromChange={v => onChange(f => ({ ...f, areaMin: v ? Number(v) : undefined }))}
                        onToChange={v => onChange(f => ({ ...f, areaMax: v ? Number(v) : undefined }))}
                        debounceMs={400}
                    />
                </div>
            </UIChip>

            {/* Район */}
            <UIChip
                label="Район"
                count={filters.districts?.length}
                onClear={() => onChange(f => ({ ...f, districts: undefined }))}
            >
                <div className="w-80 grid grid-cols-2 gap-x-6 gap-y-3">
                    {MINSK_DISTRICTS.map(d => (
                        <UICheckbox
                            key={d}
                            label={d}
                            checked={filters.districts?.includes(d) ?? false}
                            onChange={e => onChange(f => {
                                const cur = f.districts ?? []
                                return {
                                    ...f,
                                    districts: e.target.checked
                                        ? [...cur, d]
                                        : cur.filter(x => x !== d),
                                }
                            })}
                        />
                    ))}
                </div>
            </UIChip>

            {/* Метро */}
            <UIChip
                label="Метро"
                value={filters.metroTimeMax ? `до ${filters.metroTimeMax} мин` : undefined}
                onClear={() => onChange(f => ({ ...f, metroTimeMax: undefined }))}
            >
                <div className="w-48">
                    <UISelect
                        placeholder="Любое время"
                        options={METRO_TIME_OPTIONS}
                        value={filters.metroTimeMax ? String(filters.metroTimeMax) : undefined}
                        onChange={v => onChange(f => ({ ...f, metroTimeMax: v ? Number(v) : undefined }))}
                    />
                </div>
            </UIChip>

            {/* Все фильтры */}
            <button
                type="button"
                onClick={onOpenDrawer}
                aria-expanded={drawerOpen}
                className={cn(
                    'inline-flex h-9 items-center gap-1.5 rounded-sm border px-3 text-sm font-medium whitespace-nowrap transition-colors',
                    drawerOpen
                        ? 'bg-surface-page border-brand text-text-base ring-2 ring-brand/20'
                        : 'bg-surface-page border-border-strong text-text-base hover:bg-surface-subtle',
                )}
            >
                <SlidersHorizontal className="size-4" aria-hidden />
                Все фильтры
                {extraCount > 0 && (
                    <span className="rounded-xs bg-brand px-1 text-xs font-semibold text-white tabular-nums">
                        {extraCount}
                    </span>
                )}
            </button>

            <span className="mx-1 h-6 w-px bg-border" />

            <span className="px-1 text-sm font-medium text-text-base tabular-nums">
                {total.toLocaleString('ru-RU')} {pluralObjects(total)}
            </span>
            {
                isLoading ? (
                    <div
                        aria-label="Проверка авторизации"
                        className="flex size-9 items-center justify-center rounded-xl text-text-muted"
                    >
                        <IconLoader size={18} />
                    </div>
                ) : (
                    <>
                        {
                            data?.user ? (
                                <UIButton
                                    size="sm"
                                    variant={saved ? 'secondary' : 'primary'}
                                    iconLeft={<Bell className="size-4" />}
                                    onClick={() => setSaved(v => !v)}
                                >
                                    {saved ? 'Поиск сохранён' : 'Сохранить поиск'}
                                </UIButton>
                            ) : <></>
                        }
                    </>
                )
            }
        </div>
    )
}
