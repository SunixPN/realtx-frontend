'use client'

import { useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { X } from 'lucide-react'
import { UIRangeField } from '@/shared/ui/ui-range-field'
import { UICheckbox } from '@/shared/ui/ui-checkbox'
import { UISwitch } from '@/shared/ui/ui-switch'
import { UISelect } from '@/shared/ui/ui-select'
import { UIButton } from '@/shared/ui/ui-button'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { cn } from '@/shared/helpers/cn'
import {
    MINSK_DISTRICTS,
    METRO_TIME_OPTIONS,
    WALL_MATERIAL_LABELS,
    REPAIR_STATE_LABELS,
    type MapFiltersType,
} from '@/entities/estate'
import type { DisplayCurrency } from '../_hooks/use-display-currency'

const ROOM_OPTIONS = [1, 2, 3, 4, 5] as const
const WALL_MATERIAL_OPTIONS = Object.entries(WALL_MATERIAL_LABELS).map(([v, l]) => ({ value: v, label: l }))
const REPAIR_STATE_OPTIONS = Object.entries(REPAIR_STATE_LABELS).map(([v, l]) => ({ value: v, label: l }))
const DURATION = 320

function plural(n: number): string {
    const last = n % 10
    const two = n % 100
    if (two >= 11 && two <= 14) return 'объектов'
    if (last === 1) return 'объект'
    if (last >= 2 && last <= 4) return 'объекта'
    return 'объектов'
}

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
}

const CURRENCY_ORDER: DisplayCurrency[] = ['USD', 'BYN', 'EUR']

function currencySymbol(c: DisplayCurrency) {
    if (c === 'USD') return '$'
    if (c === 'EUR') return '€'
    return <BynSign />
}

export function FiltersDrawer({ isOpen, filters, onChange, onClear, onClose, total, currency, onCurrencyChange }: FiltersDrawerProps) {
    const backdropRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLElement>(null)

    // ESC → закрыть
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, onClose])

    // Блокируем скролл body пока открыт
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    return (
        <>
            {/* ── Backdrop ────────────────────────────────────────────── */}
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
                    className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                />
            </CSSTransition>

            {/* ── Panel ───────────────────────────────────────────────── */}
            <CSSTransition
                nodeRef={panelRef}
                in={isOpen}
                timeout={DURATION}
                classNames="drawer-panel"
                unmountOnExit
            >
                <aside
                    ref={panelRef}
                    aria-label="Все фильтры"
                    className={cn(
                        'absolute inset-y-0 right-0 z-50 flex w-[420px] flex-col',
                        'border-l border-border bg-surface-page',
                        'shadow-[0_12px_32px_-8px_rgb(15_23_42/0.16)]',
                    )}
                >
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
                        <h2 className="text-[0.9375rem] font-semibold text-text-base">Все фильтры</h2>
                        <button
                            type="button"
                            aria-label="Закрыть"
                            onClick={onClose}
                            className="flex size-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-subtle"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto">
                        <Section title="Цена">
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
                                label={<>Цена, {currencySymbol(currency)}</>}
                                unit={currencySymbol(currency)}
                                fromValue={filters.priceMin ?? ''}
                                toValue={filters.priceMax ?? ''}
                                onFromChange={v => onChange(f => ({ ...f, priceMin: v ? Number(v) : undefined }))}
                                onToChange={v => onChange(f => ({ ...f, priceMax: v ? Number(v) : undefined }))}
                                debounceMs={400}
                            />
                        </Section>

                        <Section title="Комнат">
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

                        <Section title="Площадь и этаж">
                            <UIRangeField
                                label="Общая площадь, м²"
                                fromValue={filters.areaMin ?? ''}
                                toValue={filters.areaMax ?? ''}
                                onFromChange={v => onChange(f => ({ ...f, areaMin: v ? Number(v) : undefined }))}
                                onToChange={v => onChange(f => ({ ...f, areaMax: v ? Number(v) : undefined }))}
                                debounceMs={400}
                            />
                            <UIRangeField
                                label="Этаж"
                                fromValue={filters.storeyMin ?? ''}
                                toValue={filters.storeyMax ?? ''}
                                onFromChange={v => onChange(f => ({ ...f, storeyMin: v ? Number(v) : undefined }))}
                                onToChange={v => onChange(f => ({ ...f, storeyMax: v ? Number(v) : undefined }))}
                                debounceMs={400}
                            />
                            <UICheckbox
                                label="Не первый и не последний"
                                checked={filters.notFirstOrLast ?? false}
                                onChange={e => onChange(f => ({ ...f, notFirstOrLast: e.target.checked || undefined }))}
                            />
                        </Section>

                        <Section title="Дом">
                            <UIRangeField
                                label="Год постройки"
                                fromValue={filters.buildingYearMin ?? ''}
                                toValue={filters.buildingYearMax ?? ''}
                                fromPlaceholder="от"
                                toPlaceholder="до"
                                onFromChange={v => onChange(f => ({ ...f, buildingYearMin: v ? Number(v) : undefined }))}
                                onToChange={v => onChange(f => ({ ...f, buildingYearMax: v ? Number(v) : undefined }))}
                                debounceMs={400}
                            />
                            <UISelect
                                label="Тип дома"
                                placeholder="Любой"
                                options={WALL_MATERIAL_OPTIONS}
                                value={filters.wallMaterial?.[0] ? String(filters.wallMaterial[0]) : undefined}
                                onChange={v => onChange(f => ({ ...f, wallMaterial: v ? [Number(v)] : undefined }))}
                                clearable
                            />
                            <UISelect
                                label="Ремонт"
                                placeholder="Любой"
                                options={REPAIR_STATE_OPTIONS}
                                value={filters.repairState?.[0] ? String(filters.repairState[0]) : undefined}
                                onChange={v => onChange(f => ({ ...f, repairState: v ? [Number(v)] : undefined }))}
                                clearable
                            />
                        </Section>

                        <Section title="Продавец и метро">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-base text-text-base">Только собственники</div>
                                    <div className="text-xs text-text-muted">Без агентских объявлений</div>
                                </div>
                                <UISwitch
                                    checked={filters.ownerOnly ?? false}
                                    onChange={e => onChange(f => ({ ...f, ownerOnly: e.target.checked || undefined }))}
                                />
                            </div>
                            <UISelect
                                label="Время до метро пешком"
                                placeholder="Любое"
                                options={METRO_TIME_OPTIONS}
                                value={filters.metroTimeMax ? String(filters.metroTimeMax) : undefined}
                                onChange={v => onChange(f => ({ ...f, metroTimeMax: v ? Number(v) : undefined }))}
                                clearable
                            />
                        </Section>

                        <Section title="Район">
                            <div className="grid grid-cols-2 gap-2">
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
                        </Section>
                    </div>

                    {/* Sticky footer */}
                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface-page px-5 py-4">
                        <button
                            type="button"
                            onClick={onClear}
                            className="text-sm font-medium text-text-muted transition-colors hover:text-text-base"
                        >
                            Сбросить всё
                        </button>
                        <UIButton variant="primary" size="lg" onClick={onClose}>
                            Показать {total.toLocaleString('ru-RU')} {plural(total)}
                        </UIButton>
                    </div>
                </aside>
            </CSSTransition>
        </>
    )
}
