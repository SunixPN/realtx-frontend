import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/helpers/cn';
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  hint?:      string;
  error?:     string;
  icon?:      ReactNode;
  rightSlot?: ReactNode;
}
export const UIInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, rightSlot, id, className, disabled, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hasError = !!error;
    return (
      <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-base">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex h-11 w-full items-center gap-2 rounded-md border bg-surface-page px-3',
            'transition-colors',
            hasError
              ? 'border-error focus-within:ring-2 focus-within:ring-error/20'
              : 'border-border hover:border-border-strong focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
            disabled && 'bg-surface-subtle cursor-not-allowed opacity-60',
          )}
        >
          {icon && <span className="flex items-center text-text-faint shrink-0">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            className="min-w-0 flex-1 bg-transparent text-sm text-text-base placeholder:text-text-faint outline-none disabled:cursor-not-allowed"
            {...props}
          />
          {rightSlot && <span className="flex items-center shrink-0">{rightSlot}</span>}
        </div>
        {error ? (
          <span className="text-xs text-error">{error}</span>
        ) : hint ? (
          <span className="text-xs text-text-faint">{hint}</span>
        ) : null}
      </div>
    );
  },
);
UIInput.displayName = 'UIInput';
