import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/helpers/cn';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const UISwitch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, id, className, checked, defaultChecked, disabled, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-2.5 text-sm',
          disabled ? 'cursor-not-allowed text-text-disabled' : 'cursor-pointer text-text-base',
          className,
        )}
      >
        <span className="relative inline-flex">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'relative flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-colors',
              'border-border-strong bg-surface-muted',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 peer-focus-visible:ring-offset-2',
              'peer-checked:border-brand peer-checked:bg-brand',
              'peer-disabled:opacity-50',
              'peer-checked:[&>span]:translate-x-4',
            )}
          >
            <span className="size-4 rounded-full bg-white shadow-sm transition-transform" />
          </span>
        </span>
        {label}
      </label>
    );
  },
);

UISwitch.displayName = 'UISwitch';
