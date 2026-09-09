import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/helpers/cn';
import { IconCheck } from '@/shared/ui/ui-icons';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const UICheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-xs border transition-colors',
              'border-border-strong bg-surface-page',
              'peer-hover:border-text-faint',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 peer-focus-visible:ring-offset-2',
              'peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white',
              'peer-disabled:border-border peer-disabled:bg-surface-subtle',
              '[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100',
            )}
          >
            <IconCheck size={14} />
          </span>
        </span>
        {label}
      </label>
    );
  },
);

UICheckbox.displayName = 'UICheckbox';
