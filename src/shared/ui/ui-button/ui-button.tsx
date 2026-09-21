import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:  ButtonVariant;
    size?:     ButtonSize;
    loading?:  boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    fullWidth?: boolean;
}
const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-sm ' +
    'transition-all duration-150 cursor-pointer select-none ' +
    'disabled:opacity-50 disabled:pointer-events-none ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';
const variants: Record<ButtonVariant, string> = {
    primary:
        'bg-brand text-white hover:bg-brand-hover active:scale-[0.98]',
    secondary:
        'bg-surface-subtle text-text-base border border-border ' +
        'hover:bg-surface-muted active:scale-[0.98]',
    ghost:
        'bg-transparent text-text-muted hover:bg-surface-subtle hover:text-text-base ' +
        'active:scale-[0.98]',
    danger:
        'bg-error text-white hover:opacity-90 active:scale-[0.98]',
};
const sizes: Record<ButtonSize, string> = {
    sm: 'h-8  px-3 text-sm   gap-1.5',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base gap-2.5',
};
export const UIButton = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant  = 'primary',
            size     = 'md',
            loading  = false,
            iconLeft,
            iconRight,
            fullWidth = false,
            disabled,
            className = '',
            children,
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || loading;
        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={[
                    base,
                    variants[variant],
                    sizes[size],
                    fullWidth ? 'w-full' : '',
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...props}
            >
                {loading ? (
                    <Spinner size={size} />
                ) : (
                    iconLeft && <span className="shrink-0">{iconLeft}</span>
                )}
                {children && <span>{children}</span>}
                {!loading && iconRight && (
                    <span className="shrink-0">{iconRight}</span>
                )}
            </button>
        );
    },
);
UIButton.displayName = 'Button';
function Spinner({ size }: { size: ButtonSize }) {
    const sz = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
    return (
        <svg
            width={sz}
            height={sz}
            viewBox="0 0 24 24"
            fill="none"
            className="animate-spin shrink-0"
            aria-hidden="true"
        >
            <circle
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="12"
            />
        </svg>
    );
}
