'use client';

import { useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';

type CodeBoxesInputProps = {
    value:     string;
    onChange:  (value: string) => void;
    length?:   number;
    hasError?: boolean;
    disabled?: boolean;
};

export default function CodeBoxesInput({
    value,
    onChange,
    length = 6,
    hasError = false,
    disabled = false,
}: CodeBoxesInputProps) {
    const t = useTranslations('auth.phone');
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const digits = Array.from({ length }, (_, i) => value[i] ?? '');

    const focusIndex = (i: number) => {
        inputsRef.current[i]?.focus();
        inputsRef.current[i]?.select();
    };

    const setDigit = (i: number, digit: string) => {
        const next = digits.slice();
        next[i] = digit;
        onChange(next.join(''));
    };

    const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (!raw) {
            setDigit(i, '');
            return;
        }
        if (raw.length === 1) {
            setDigit(i, raw);
            if (i < length - 1) focusIndex(i + 1);
            return;
        }
        // Пользователь вставил / быстро набрал несколько цифр — раскидываем по боксам
        const next = digits.slice();
        for (let k = 0; k < raw.length && i + k < length; k++) {
            next[i + k] = raw[k]!;
        }
        onChange(next.join(''));
        const nextFocus = Math.min(i + raw.length, length - 1);
        focusIndex(nextFocus);
    };

    const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            e.preventDefault();
            setDigit(i - 1, '');
            focusIndex(i - 1);
        } else if (e.key === 'ArrowLeft' && i > 0) {
            e.preventDefault();
            focusIndex(i - 1);
        } else if (e.key === 'ArrowRight' && i < length - 1) {
            e.preventDefault();
            focusIndex(i + 1);
        }
    };

    const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
        if (!pasted) return;
        e.preventDefault();
        const next = digits.slice();
        for (let k = 0; k < pasted.length && i + k < length; k++) {
            next[i + k] = pasted[k]!;
        }
        onChange(next.join(''));
        focusIndex(Math.min(i + pasted.length, length - 1));
    };

    return (
        <div className="flex justify-center gap-2">
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el; }}
                    value={d}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={(e) => handlePaste(i, e)}
                    onFocus={(e) => e.target.select()}
                    disabled={disabled}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={t('digit_aria', { index: i + 1 })}
                    className={cn(
                        'flex size-12 items-center justify-center rounded-md border bg-surface-page text-center text-2xl font-semibold tabular-nums text-text-base outline-none transition-colors',
                        hasError
                            ? 'border-error ring-2 ring-error/20'
                            : d
                                ? 'border-border-strong'
                                : 'border-border focus:border-brand focus:ring-2 focus:ring-brand/20',
                        disabled && 'cursor-not-allowed opacity-60',
                    )}
                />
            ))}
        </div>
    );
}
