'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconChevronDown, IconCheck } from '@/shared/ui/ui-icons';
import { cn } from '@/shared/helpers/cn';
import { COUNTRIES, getCountry, type CountryCode } from '@/shared/const/countries';

type CountrySelectProps = {
    value:    CountryCode;
    onChange: (code: CountryCode) => void;
};

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
    const t = useTranslations('common');
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const countryName = (short: string) => t(`country_${short.toLowerCase()}` as Parameters<typeof t>[0]);

    const selected = getCountry(value);
    const Flag = selected.flag;

    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div ref={containerRef} className="relative shrink-0">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    'flex h-11 items-center gap-2 rounded-md border bg-surface-page px-3 text-sm font-medium text-text-base transition-colors',
                    open
                        ? 'border-brand ring-2 ring-brand/20'
                        : 'border-border hover:border-border-strong',
                )}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <Flag />
                <span className="text-xs text-text-muted">{selected.short}</span>
                <span className="tabular-nums">{selected.code}</span>
                <IconChevronDown
                    size={14}
                    className={cn('text-text-faint transition-transform', open && 'rotate-180')}
                />
            </button>

            {open && (
                <ul
                    role="listbox"
                    className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-md border border-border bg-surface-raised py-1 shadow-lg"
                >
                    {COUNTRIES.map((c) => {
                        const isSelected = c.code === value;
                        const CFlag = c.flag;
                        return (
                            <li
                                key={c.code}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    onChange(c.code);
                                    setOpen(false);
                                }}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-surface-subtle',
                                    isSelected && 'bg-brand-bg',
                                )}
                            >
                                <CFlag />
                                <span className="text-xs text-text-muted">{c.short}</span>
                                <span className="tabular-nums text-text-base">{c.code}</span>
                                <span className="flex-1 text-right text-xs text-text-faint">{countryName(c.short)}</span>
                                {isSelected && <IconCheck size={14} className="text-brand" />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
