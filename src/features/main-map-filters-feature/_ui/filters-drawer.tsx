'use client'

import { useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UIRangeField } from '@/shared/ui/ui-range-field'
import { UICheckbox } from '@/shared/ui/ui-checkbox'
import { UISwitch } from '@/shared/ui/ui-switch'
import { UISelect } from '@/shared/ui/ui-select'
import { UIButton } from '@/shared/ui/ui-button'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { cn } from '@/shared/helpers/cn'
import {
    useWallMaterialLabels,
    useRepairStateLabels,
    useMetroTimeOptions,
    useMinskDistrictOptions,
    type MapFiltersType,
} from '@/entities/estate'
import type { DisplayCurrency } from '../_hooks/use-display-currency'

const ROOM_OPTIONS = [1, 2, 3, 4, 5] as const
const DURATION = 320

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-4 border-b border-border px-5 py-5">
            <h3 className="text-base font-semibold text-text-base">{title}</h3>
            {children}
        </section>
    )
}

type FiltersDrawerProps = {
    isOpen: boolean
    filters: MapFiltersType
    onChange: (updater: (prev: MapFiltersType) => MapFiltersType) => void
    onClear: () => void
    onClose: () => void
    total: number
    currency: DisplayCurrency
    onCurrencyChange: (c: DisplayCurrency) => void
    applyLabel?: React.ReactNode
    zIndexOffset?: number
}

const CURRENCY_ORDER: DisplayCurrency[] = ['USD', 'BYN', 'EUR']

function currencySymbol(c: DisplayCurrency) {
    if (c === 'USD') return '$'
    if (c === 'EUR') return '€'
    return <BynSign />
}

export function FiltersDrawer({ isOpen, filters, onChange, onClear, onClose, total, currency, onCurrencyChange, applyLabel, zIndexOffset = 0 }: FiltersDrawerProps) {
    const t = useTranslations('filters')
    const tCommon = useTranslations('common')
    const wallLabels = useWallMaterialLabels()
    const repairLabels = useRepairStateLabels()
    const metroTimeOptions = useMetroTimeOptions()
    const districtOptions = useMinskDistrictOptions()

    const wallMaterialOptions = Object.entries(wallLabels).map(([v, l]) => ({ value: v, label: l }))
    const repairStateOptions = Object.entries(repairLabels).map(([v, l]) => ({ value: v, label: l }))

    const backdropZ = 40 + zIndexOffset
    const panelZ = 50 + zIndexOffset
    const nested = zIndexOffset > 0
    const positionClass = nested ? 'fixed' : 'absolute'
    const backdropRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, onClose])

    useEffect(() => {
        if (nested) return
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen, nested])

    return (
        <>
            <CSSTransition
                nodeRef={backdropRef}
                in={isOpen}
                timeout={DURATION}
                classNames="drawer-backdrop"
                unmountOnExit
            >
                <div
                    ref={backdropRef}
                    onClick={onClose}
                    style={{ zIndex: backdropZ }}
                    className={cn(positionClass, 'inset-0 bg-black/40 backdrop-blur-[2px]')}
                />
            </CSSTransition>

            <CSSTransition
                nodeRef={panelRef}
                in={isOpen}
                timeout={DURATION}
                classNames="drawer-panel"
                unmountOnExit
            >
                <aside
                    ref={panelRef}
                    aria-label={t('all_filters_aria')}
                    style={{ zIndex: panelZ }}
                    className={cn(
                        positionClass,
                        'inset-y-0 right-0 flex w-[420px] flex-col',
                        'border-l border-border bg-surface-page',
                        'shadow-[0_12px_32px_-8px_rgb(15_23_42/0.16)]',
                    )}
                >
                    <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
                        <h2 className="text-[0.9375rem] font-semibold text-text-base">{t('all_filters')}</h2>
                        <button
                            type="button"
                            aria-label={tCommon('close')}
                            onClick={onClose}
                            className="flex size-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-subtle"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <Section title={t('section_price')}>
                            <div className="flex gap-2">
                                {CURRENCY_ORDER.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => onCurrencyChange(c)}
                                        className={cn(
                                            'flex h-9 flex-1 items-center justify-center rounded-sm border text-sm font-medium transition-colors',
                                            currency === c
                                                ? 'bg-brand text-white border-brand'
                                                : 'border-border-strong text-text-base hover:bg-surface-subtle',
                                        )}
                                    >
                                        {currencySymbol(c)}
                                    </button>
                                ))}
                            </div>
                            <UIRangeField
                                label={<>{t('price_label_unit', { currency: '' })} {currencySymbol(currency)}</>}
                                unit={currencySymbol(currency)}
                                fromValue={filters.priceMin ?? ''}
                                toValue={filters.priceMax ?? ''}
                                onFromChange={v => onChange(f => ({ ...f, priceMin: v ? Number(v) : undefined }))}
                                onToChange={v => onChange(f => ({ ...f, priceMax: v ? Number(v) : undefined }))}
                                debounceMs={400}
                            />
                        </Section>

                        <Section title={t('section_rooms')}>
                            <div className="flex gap-2">
                                {ROOM_OPTIONS.map(r => {
                                    const active = filters.rooms?.includes(r)
                                    return (
                                        <button
                                            key={r}
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => onChange(f => {
                                                const cur = f.rooms ?? []
                                                return { ...f, rooms: active ? cur.filter(x => x !== r) : [...cur, r] }
                                            })}
                                            className={cn(
                                                'flex h-10 flex-1 items-center justify-center rounded-sm border text-base font-medium transition-colors',
                                                active
                                                    ? 'border-brand bg-brand/10 text-brand'
                                                    : 'border-border-strong bg-surface-page text-text-muted hover:border-text-faint',
                                            )}
                                        >
                                            {r >= 5 ? '5+' : r}
                                        </button>
                                    )
                                })}
                            </div>
                        </Section>

                        <Section title={t('section_area_storey')}>
                            <UIRangeField
                                label={t('area_total_label')}
                                fromValue={filters.areaMin ?? ''}
                                toValue={filters.areaMax ?? ''}
                                onFromChange={v => onChange(f => ({ ...f, areaMin: v ? Number(v) : undefined }))}
                                onToChange={v => onChange(f => ({ ...f, areaMax: v ? Number(v) : undefined }))}
                                debounceMs={400}
                            />
                            <UIRangeField
                                label={t('storey_label')}
                                fromValue={filters.storeyMin ?? ''}
                                toValue={filters.storeyMax ?? ''}
                                onFromChange={v => onChange(f => ({ ...f, storeyMin: v ? Number(v) : undefined }))}
                                onToChange={v => onChange(f => ({ ...f, storeyMax: v ? Number(v) : undefined }))}
                                debounceMs={400}
                            />
                            <UICheckbox
                                label={t('storey_not_first_last')}
                                checked={filters.notFirstOrLast ?? false}
                                onChange={e => onChange(f => ({ ...f, notFirstOrLast: e.target.checked || undefined }))}
                            />
                        </Section>

                        <Section title={t('section_building')}>
                            <UIRangeField
                                label={t('year_label')}
                                fromValue={filters.buildingYearMin ?? ''}
                                toValue={filters.buildingYearMax ?? ''}
                                fromPlaceholder={t('year_from')}
                                toPlaceholder={t('year_to')}
                                onFromChange={v => onChange(f => ({ ...f, buildingYearMin: v ? Number(v) : undefined }))}
                                onToChange={v => onChange(f => ({ ...f, buildingYearMax: v ? Number(v) : undefined }))}
                                debounceMs={400}
                            />
                            <UISelect
                                label={t('wall_label')}
                                placeholder={t('any')}
                                options={wallMaterialOptions}
                                value={filters.wallMaterial?.[0] ? String(filters.wallMaterial[0]) : undefined}
                                onChange={v => onChange(f => ({ ...f, wallMaterial: v ? [Number(v)] : undefined }))}
                                clearable
                            />
                            <UISelect
                                label={t('repair_label')}
                                placeholder={t('any')}
                                options={repairStateOptions}
                                value={filters.repairState?.[0] ? String(filters.repairState[0]) : undefined}
                                onChange={v => onChange(f => ({ ...f, repairState: v ? [Number(v)] : undefined }))}
                                clearable
                            />
                        </Section>

                        <Section title={t('section_seller_metro')}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-base text-text-base">{t('owners_only')}</div>
                                    <div className="text-xs text-text-muted">{t('owners_only_sub')}</div>
                                </div>
                                <UISwitch
                                    checked={filters.ownerOnly ?? false}
                                    onChange={e => onChange(f => ({ ...f, ownerOnly: e.target.checked || undefined }))}
                                />
                            </div>
                            <UISelect
                                label={t('metro_walk_label')}
                                placeholder={t('metro_any')}
                                options={metroTimeOptions}
                                value={filters.metroTimeMax ? String(filters.metroTimeMax) : undefined}
                                onChange={v => onChange(f => ({ ...f, metroTimeMax: v ? Number(v) : undefined }))}
                                clearable
                            />
                        </Section>

                        <Section title={t('section_district')}>
                            <div className="grid grid-cols-2 gap-2">
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
                        </Section>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface-page px-5 py-4">
                        <button
                            type="button"
                            onClick={onClear}
                            className="text-sm font-medium text-text-muted transition-colors hover:text-text-base"
                        >
                            {t('reset_all')}
                        </button>
                        <UIButton variant="primary" size="lg" onClick={onClose}>
                            {applyLabel ?? t('show_results', { count: total })}
                        </UIButton>
                    </div>
                </aside>
            </CSSTransition>
        </>
    )
}
