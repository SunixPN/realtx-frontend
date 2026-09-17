'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/shared/helpers/cn';
import { IconCheck } from '@/shared/ui/ui-icons';
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, type Locale } from '@/shared/i18n/config';
import { setLocale } from '@/shared/i18n/actions';
import { beginTopLoader, endTopLoader } from '@/shared/ui/top-loader/top-loader';

const CLOSE_MS = 120;

export function LocaleSwitcher() {
    const current = useLocale() as Locale;
    const t = useTranslations('header');
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const containerRef = useRef<HTMLDivElement>(null);

    function startClose() {
        setClosing(true);
        setTimeout(() => {
            setOpen(false);
            setClosing(false);
        }, CLOSE_MS);
    }

    function toggle() {
        if (open) startClose();
        else setOpen(true);
    }

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) startClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    function pick(locale: Locale) {
        startClose();
        if (locale === current) return;
        // Смена локали через server action ре-рендерит layout — юзер видит
        // «залипание» без индикации. Стартуем top-loader сразу, закрываем
        // после завершения транзиции.
        beginTopLoader();
        startTransition(async () => {
            try {
                await setLocale(locale);
            } finally {
                endTopLoader();
            }
        });
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-label={t('locale_switch_aria')}
                aria-expanded={open}
                onClick={toggle}
                disabled={isPending}
                className={cn(
                    'flex h-9 cursor-pointer items-center rounded-md px-2.5 text-sm font-medium text-text-muted hover:bg-surface-subtle hover:text-text-base',
                    open && 'bg-surface-subtle text-text-base',
                    isPending && 'opacity-60',
                )}
            >
                {LOCALE_SHORT[current]}
            </button>

            {(open || closing) && (
                <div
                    role="menu"
                    style={{
                        animation: closing
                            ? `dropdown-out ${CLOSE_MS}ms ease-in forwards`
                            : 'dropdown-in 160ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
                        transformOrigin: 'top right',
                    }}
                    className="absolute top-full right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-lg"
                >
                    <div className="flex flex-col py-1">
                        {LOCALES.map((locale) => {
                            const active = locale === current;
                            return (
                                <button
                                    key={locale}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => pick(locale)}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-surface-subtle',
                                        active ? 'text-text-base' : 'text-text-muted',
                                    )}
                                >
                                    <span className="flex-1">{LOCALE_LABELS[locale]}</span>
                                    {active && (
                                        <span className="text-brand">
                                            <IconCheck size={16} />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
