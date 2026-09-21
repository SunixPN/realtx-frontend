'use client';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';
export type PasswordStrength = 'weak' | 'medium' | 'strong';
interface UIPasswordStrengthProps {
    value: PasswordStrength;
    isEmpty?: boolean;
    className?: string;
}
const SEGMENTS = 3;
const CONFIG: Record<PasswordStrength, { filled: number; bar: string; text: string }> = {
    weak:   { filled: 1, bar: 'bg-error',   text: 'text-error'   },
    medium: { filled: 2, bar: 'bg-warning',  text: 'text-warning' },
    strong: { filled: 3, bar: 'bg-success',  text: 'text-success' },
};
export function UIPasswordStrength({ value, isEmpty = false, className }: UIPasswordStrengthProps) {
    const t = useTranslations('common');
    const { filled, bar, text } = CONFIG[value];
    const label = t(value === 'weak' ? 'strength_weak' : value === 'medium' ? 'strength_medium' : 'strength_strong');
    return (
        <div className={cn('mt-2 flex items-center gap-2', className)}>
            <div
                className="flex flex-1 gap-1"
                role="meter"
                aria-label={t('password_strength_aria')}
                aria-valuenow={isEmpty ? 0 : filled}
                aria-valuemin={0}
                aria-valuemax={SEGMENTS}
            >
                {Array.from({ length: SEGMENTS }).map((_, i) => {
                    const active = !isEmpty && i < filled;
                    return (
                        <span key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-border">
                            <span
                                className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-in-out', bar)}
                                style={{ width: active ? '100%' : '0%' }}
                            />
                        </span>
                    );
                })}
            </div>
            {}
            <span className="w-14 text-center text-xs font-medium">
                <span
                    className={cn(
                        'transition-all duration-300',
                        isEmpty ? 'invisible' : text,
                    )}
                >
                    {label}
                </span>
            </span>
        </div>
    );
}
