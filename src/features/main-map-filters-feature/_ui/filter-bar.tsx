'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Bell, Search, SlidersHorizontal, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SearchSuggest } from './search-suggest'
import { UIChip } from '@/shared/ui/ui-chip'
import { UIRangeField } from '@/shared/ui/ui-range-field'
import { UICheckbox } from '@/shared/ui/ui-checkbox'
import { UISelect } from '@/shared/ui/ui-select'
import { UIButton } from '@/shared/ui/ui-button'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { cn } from '@/shared/helpers/cn'
import {
    useMetroTimeOptions,
    useMinskDistrictOptions,
    countActiveFilters,
    type MapFiltersType,
} from '@/entities/estate'
import type { DisplayCurrency } from '../_hooks/use-display-currency'
import { useAuth } from "@/entities/me/api/auth-query";
import { IconLoader } from "@/shared/ui/ui-icons";
type FilterBarProps = {
    filters: MapFiltersType
    onChange: (updater: (prev: MapFiltersType) => MapFiltersType) => void
    onClear: () => void
    onOpenDrawer: () => void
    drawerOpen: boolean
    total: number
    currency: DisplayCurrency
    onCurrencyChange: (c: DisplayCurrency) => void
    saved: boolean
    onSaveSearch: () => void
}
const CURRENCY_ORDER: DisplayCurrency[] = ['USD', 'BYN', 'EUR']
function currencySymbol(c: DisplayCurrency): ReactNode {
    if (c === 'USD') return '$'
    if (c === 'EUR') return '€'
    return <BynSign />
}
const ROOM_OPTIONS = [1, 2, 3, 4, 5]
export function FilterBar({ filters, onChange, onClear: _onClear, onOpenDrawer, drawerOpen, total, currency, onCurrencyChange, saved, onSaveSearch }: FilterBarProps) {
    const t = useTranslations('filters')
    const { data, isLoading } = useAuth()
    const metroTimeOptions = useMetroTimeOptions()
    const districtOptions = useMinskDistrictOptions()
    const [searchOpen, setSearchOpen] = useState(false)
    const mobileSearchRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!searchOpen) return
        const input = mobileSearchRef.current?.querySelector('input')
        input?.focus()
    }, [searchOpen])
    const formatPriceLabel = (): ReactNode | undefined => {
        const sym = currencySymbol(currency)
        if (filters.priceMin && filters.priceMax) return <>{filters.priceMin.toLocaleString('ru-RU')} – {filters.priceMax.toLocaleString('ru-RU')} {sym}</>
        if (filters.priceMin) return <>{t('price_from', { min: filters.priceMin.toLocaleString('ru-RU'), currency: '' })} {sym}</>
        if (filters.priceMax) return <>{t('price_to', { max: filters.priceMax.toLocaleString('ru-RU'), currency: '' })} {sym}</>
        return undefined
    }
    const formatRoomsLabel = (): string | undefined => {
        if (!filters.rooms?.length) return undefined
        return filters.rooms.map(r => r >= 5 ? '5+' : String(r)).join('–')
    }
    const formatAreaLabel = (): string | undefined => {
        if (filters.areaMin && filters.areaMax) return t('area_range', { min: filters.areaMin, max: filters.areaMax })
        if (filters.areaMin) return t('area_from', { min: filters.areaMin })
        if (filters.areaMax) return t('area_to', { max: filters.areaMax })
        return undefined
    }
    const extraCount = countActiveFilters(filters) -
        (formatPriceLabel() ? 1 : 0) -
        (formatRoomsLabel() ? 1 : 0) -
        (formatAreaLabel() ? 1 : 0) -
        (filters.districts?.length ? 1 : 0) -
        (filters.metroTimeMax ? 1 : 0)
    const priceChip = (
        <UIChip
            key="price"
            label={t('price')}
            value={formatPriceLabel()}
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
    )
    const roomsChip = (
        <UIChip
            key="rooms"
            label={t('rooms')}
            value={formatRoomsLabel()}
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
    )
    const areaChip = (
        <UIChip
            key="area"
            label={t('area')}
            value={formatAreaLabel()}
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
    )
    const districtChip = (
        <UIChip
            key="district"
            label={t('district')}
            count={filters.districts?.length}
            onClear={() => onChange(f => ({ ...f, districts: undefined }))}
        >
            <div className="w-80 grid grid-cols-2 gap-x-6 gap-y-3">
                {districtOptions.map(({ value, label }) => (
                    <UICheckbox
                        key={value}
                        label={label}
                        checked={filters.districts?.includes(value) ?? false}
                        onChange={e => onChange(f => {
                            const cur = f.districts ?? []
                            return {
                                ...f,
                                districts: e.target.checked
                                    ? [...cur, value]
                                    : cur.filter(x => x !== value),
                            }
                        })}
                    />
                ))}
            </div>
        </UIChip>
    )
    const metroChip = (
        <UIChip
            key="metro"
            label={t('metro')}
            value={filters.metroTimeMax ? t('metro_chip_value', { min: filters.metroTimeMax }) : undefined}
            onClear={() => onChange(f => ({ ...f, metroTimeMax: undefined }))}
        >
            <div className="w-48">
                <UISelect
                    placeholder={t('metro_any_time')}
                    options={metroTimeOptions}
                    value={filters.metroTimeMax ? String(filters.metroTimeMax) : undefined}
                    onChange={v => onChange(f => ({ ...f, metroTimeMax: v ? Number(v) : undefined }))}
                />
            </div>
        </UIChip>
    )
    const allFiltersButton = (
        <button
            key="all"
            type="button"
            onClick={onOpenDrawer}
            aria-expanded={drawerOpen}
            className={cn(
                'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm border px-3 text-sm font-medium whitespace-nowrap transition-colors',
                drawerOpen
                    ? 'bg-surface-page border-brand text-text-base ring-2 ring-brand/20'
                    : 'bg-surface-page border-border-strong text-text-base hover:bg-surface-subtle active:bg-surface-muted',
            )}
        >
            <SlidersHorizontal className="size-4" aria-hidden />
            {t('all_filters')}
            {extraCount > 0 && (
                <span className="rounded-xs bg-brand px-1 text-xs font-semibold text-white tabular-nums">
                    {extraCount}
                </span>
            )}
        </button>
    )
    return (
        <div className="rounded-lg border border-border bg-surface-page p-2 shadow-lg">
            {/* Mobile layout: collapsible search + minimal chip set + inline count/save. */}
            <div className="flex items-center gap-2 lg:hidden">
                {searchOpen ? (
                    <div ref={mobileSearchRef} className="min-w-0 flex-1">
                        <SearchSuggest
                            value={filters.q}
                            onChange={(next) => onChange(f => ({ ...f, q: next }))}
                        />
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        aria-label={t('search_open_aria')}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border-strong bg-surface-page text-text-muted active:bg-surface-muted"
                    >
                        <Search className="size-4" aria-hidden />
                    </button>
                )}
                {searchOpen ? (
                    <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        aria-label={t('search_close_aria')}
                        className="flex size-10 shrink-0 items-center justify-center rounded-md text-text-muted active:bg-surface-muted"
                    >
                        <X className="size-5" />
                    </button>
                ) : (
                    <>
                        <div className="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {priceChip}
                            {allFiltersButton}
                        </div>
                        <MobileTrailing
                            total={total}
                            resultsLabel={t('results_count', { count: total })}
                            authed={!!data?.user}
                            authLoading={isLoading}
                            saved={saved}
                            onSaveSearch={onSaveSearch}
                            saveLabel={t(saved ? 'search_saved' : 'save_search')}
                        />
                    </>
                )}
            </div>

            {/* Desktop layout: unchanged. */}
            <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-2">
                <SearchSuggest
                    value={filters.q}
                    onChange={(next) => onChange(f => ({ ...f, q: next }))}
                />
                <div className="flex flex-wrap gap-2">
                    {priceChip}
                    {roomsChip}
                    {areaChip}
                    {districtChip}
                    {metroChip}
                    {allFiltersButton}
                </div>
                <div className="flex items-center gap-2">
                    <span className="mx-1 h-6 w-px bg-border" />
                    <span className="px-1 text-sm font-medium text-text-base tabular-nums">
                        {t('results_count', { count: total })}
                    </span>
                    {isLoading ? (
                        <div
                            aria-label={t('auth_checking_aria')}
                            className="flex size-9 items-center justify-center rounded-xl text-text-muted"
                        >
                            <IconLoader size={18} />
                        </div>
                    ) : data?.user ? (
                        <UIButton
                            size="sm"
                            variant={saved ? 'secondary' : 'primary'}
                            iconLeft={<Bell className="size-4" />}
                            onClick={onSaveSearch}
                        >
                            {saved ? t('search_saved') : t('save_search')}
                        </UIButton>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
function MobileTrailing({
    total,
    resultsLabel,
    authed,
    authLoading,
    saved,
    onSaveSearch,
    saveLabel,
}: {
    total: number
    resultsLabel: string
    authed: boolean
    authLoading: boolean
    saved: boolean
    onSaveSearch: () => void
    saveLabel: string
}) {
    return (
        <div className="flex shrink-0 items-center gap-1.5">
            <span
                title={resultsLabel}
                className="rounded-sm bg-surface-subtle px-2 py-1 text-xs font-semibold text-text-base tabular-nums"
            >
                {total}
            </span>
            {authLoading ? (
                <div className="flex size-9 items-center justify-center text-text-muted">
                    <IconLoader size={16} />
                </div>
            ) : authed ? (
                <button
                    type="button"
                    onClick={onSaveSearch}
                    aria-label={saveLabel}
                    className={cn(
                        'flex size-9 items-center justify-center rounded-md border transition-colors',
                        saved
                            ? 'border-brand bg-brand text-white'
                            : 'border-border-strong text-text-muted active:bg-surface-muted',
                    )}
                >
                    <Bell className="size-4" />
                </button>
            ) : null}
        </div>
    )
}
