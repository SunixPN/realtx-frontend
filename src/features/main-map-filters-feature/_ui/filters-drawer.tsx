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
import { UIBottomSheet, useBottomSheetDrag } from '@/shared/ui/ui-bottom-sheet'
import { UIFiltersSheet } from '@/shared/ui/ui-filters-sheet'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { cn } from '@/shared/helpers/cn'
import { useIsMobile } from '@/shared/hooks/use-is-mobile'
import { useIsIOSChrome } from '@/shared/hooks/use-is-ios-chrome'
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
        <section className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:px-5 sm:py-5">
            <h3 className="text-[15px] font-semibold text-text-base sm:text-base">{title}</h3>
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
function FiltersDrawerHeader({ title, closeLabel, onClose }: { title: string; closeLabel: string; onClose: () => void }) {
    const drag = useBottomSheetDrag()
    return (
        <div
            {...(drag?.handlers ?? {})}
            style={drag?.style}
            className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3"
        >
            <h2 className="text-[15px] font-semibold text-text-base">{title}</h2>
            <button
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-md text-text-muted transition-colors active:bg-surface-muted"
            >
                <X className="size-5" />
            </button>
        </div>
    )
}
function currencySymbol(c: DisplayCurrency) {
    if (c === 'USD') return '$'
    if (c === 'EUR') return '€'
    return <BynSign />
}
function FiltersBody({
    filters, onChange, currency, onCurrencyChange,
}: Pick<FiltersDrawerProps, 'filters' | 'onChange' | 'currency' | 'onCurrencyChange'>) {
    const t = useTranslations('filters')
    const wallLabels = useWallMaterialLabels()
    const repairLabels = useRepairStateLabels()
    const metroTimeOptions = useMetroTimeOptions()
    const districtOptions = useMinskDistrictOptions()
    const wallMaterialOptions = Object.entries(wallLabels).map(([v, l]) => ({ value: v, label: l }))
    const repairStateOptions = Object.entries(repairLabels).map(([v, l]) => ({ value: v, label: l }))

    console.log(filters, "FILTERS!!!")

    return (
        <>
            <Section title={t('section_price')}>
                <div className="flex gap-2">
                    {CURRENCY_ORDER.map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onCurrencyChange(c)}
                            className={cn(
                                'flex h-10 flex-1 items-center justify-center rounded-sm border text-sm font-medium transition-colors',
                                currency === c
                                    ? 'bg-brand text-white border-brand'
                                    : 'border-border-strong text-text-base hover:bg-surface-subtle active:bg-surface-muted',
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
                                    'flex h-11 flex-1 items-center justify-center rounded-sm border text-base font-medium transition-colors',
                                    active
                                        ? 'border-brand bg-brand/10 text-brand'
                                        : 'border-border-strong bg-surface-page text-text-muted hover:border-text-faint active:bg-surface-muted',
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
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-[15px] text-text-base sm:text-base">{t('owners_only')}</div>
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
        </>
    )
}
export function FiltersDrawer({ isOpen, filters, onChange, onClear, onClose, total, currency, onCurrencyChange, applyLabel, zIndexOffset = 0 }: FiltersDrawerProps) {
    const t = useTranslations('filters')
    const tCommon = useTranslations('common')
    const isMobile = useIsMobile()
    const isIOSChrome = useIsIOSChrome()
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
        if (nested || isMobile) return
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen, nested, isMobile])

    if (isMobile) {
        // По умолчанию — UIBottomSheet: корректно отрабатывает Safari и
        // Android Chrome. Только iOS Chrome (CriOS) получает UIFiltersSheet,
        // где проблема с прыгающим bottom-sheet при появлении виртуальной
        // клавиатуры решается через visualViewport-трекинг.
        const body = (
            <>
                <FiltersDrawerHeader title={t('all_filters')} closeLabel={tCommon('close')} onClose={onClose} />
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    <FiltersBody
                        filters={filters}
                        onChange={onChange}
                        currency={currency}
                        onCurrencyChange={onCurrencyChange}
                    />
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface-page px-4 py-3">
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-sm font-medium text-text-muted transition-colors active:text-text-base"
                    >
                        {t('reset_all')}
                    </button>
                    <UIButton variant="primary" size="lg" onClick={onClose}>
                        {applyLabel ?? t('show_results', { count: total })}
                    </UIButton>
                </div>
            </>
        )
        if (isIOSChrome) {
            return (
                <UIFiltersSheet
                    open={isOpen}
                    onClose={onClose}
                    ariaLabel={t('all_filters_aria')}
                    bottomInset={72}
                >
                    {body}
                </UIFiltersSheet>
            )
        }
        return (
            <UIBottomSheet
                open={isOpen}
                onClose={onClose}
                snapPoints={[0.95]}
                ariaLabel={t('all_filters_aria')}
            >
                {body}
            </UIBottomSheet>
        )
    }
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
                        <FiltersBody
                            filters={filters}
                            onChange={onChange}
                            currency={currency}
                            onCurrencyChange={onCurrencyChange}
                        />
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
