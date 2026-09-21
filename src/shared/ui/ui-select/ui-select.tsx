'use client';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';
import { usePopoverPosition } from '@/shared/helpers/use-popover-position';
import { IconChevronDown, IconCheck, IconX } from '@/shared/ui/ui-icons';
export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}
export interface SelectProps {
  options:       SelectOption[];
  value?:        string;
  defaultValue?: string;
  onChange?:     (value: string) => void;
  placeholder?:  string;
  label?:        string;
  hint?:         string;
  error?:        string;
  disabled?:     boolean;
  className?:    string;
  name?:         string;
  clearable?:    boolean;
}
export function UISelect({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder,
  label,
  hint,
  error,
  disabled,
  className,
  name,
  clearable,
}: SelectProps) {
  const tCommon = useTranslations('common');
  const displayPlaceholder = placeholder ?? tCommon('select_placeholder');
  const autoId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const selected = options.find((o) => o.value === value);
  const hasError = !!error;
  const pos = usePopoverPosition(triggerRef, open);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(t) &&
        popoverRef.current && !popoverRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);
  const handleSelect = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
    setOpen(false);
  };
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternalValue(undefined);
    onChange?.('');
    setOpen(false);
  };
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={autoId} className="text-sm font-medium text-text-base">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={autoId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={hasError || undefined}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-sm border bg-surface-page px-3 text-sm transition-colors',
          hasError
            ? 'border-error focus:ring-2 focus:ring-error/20'
            : open
              ? 'border-brand ring-2 ring-brand/20'
              : 'border-border-strong hover:border-text-faint focus:border-brand focus:ring-2 focus:ring-brand/20',
          disabled && 'bg-surface-subtle cursor-not-allowed opacity-60',
        )}
      >
        <span className={cn('flex items-center gap-2 truncate', !selected && 'text-text-faint')}>
          {selected?.icon}
          {selected?.label ?? displayPlaceholder}
        </span>
        {clearable && selected ? (
          <span
            role="button"
            aria-label={tCommon('clear_aria')}
            onClick={handleClear}
            onMouseDown={(e) => e.stopPropagation()}
            className="shrink-0 rounded-full p-0.5 text-text-faint hover:bg-surface-subtle hover:text-text-base"
          >
            <IconX size={14} />
          </span>
        ) : (
          <IconChevronDown
            size={16}
            className={cn(
              'shrink-0 text-text-faint transition-transform',
              open && 'rotate-180',
            )}
          />
        )}
      </button>
      {open && !disabled && pos && typeof window !== 'undefined' &&
        createPortal(
          <ul
            ref={popoverRef}
            role="listbox"
            data-popover-portal="true"
            style={{
              position: 'fixed',
              top: pos.top + 4,
              left: pos.left,
              width: pos.width,
            }}
            className="z-[9999] max-h-64 overflow-y-auto rounded-sm border border-border bg-surface-raised py-1 shadow-lg"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors',
                    'hover:bg-surface-subtle',
                    isSelected && 'bg-brand-bg text-brand',
                  )}
                >
                  {opt.icon}
                  <span className="flex-1">{opt.label}</span>
                  {isSelected && <IconCheck size={16} />}
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      }
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      {error ? (
        <span className="text-xs text-error">{error}</span>
      ) : hint ? (
        <span className="text-xs text-text-faint">{hint}</span>
      ) : null}
    </div>
  );
}
