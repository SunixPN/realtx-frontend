import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/shared/helpers/cn';

export interface RangeFieldProps {
  label?:        ReactNode;
  unit?:         ReactNode;
  hint?:         string;
  error?:        string;
  fromValue?:    string | number;
  toValue?:      string | number;
  fromPlaceholder?: string;
  toPlaceholder?:   string;
  onFromChange?: (value: string) => void;
  onToChange?:   (value: string) => void;
  disabled?:     boolean;
  className?:    string;
  // Когда задан — вызовы onFromChange/onToChange откладываются на debounceMs мс
  // после последнего keystroke. Внешнее значение принимается сразу, только если
  // пользователь не печатает прямо сейчас (dirty=false).
  debounceMs?:  number;
}

function useDebouncedInput(
  externalValue: string | number | undefined,
  onChange: ((v: string) => void) | undefined,
  debounceMs: number | undefined,
) {
  const [local, setLocal] = useState(String(externalValue ?? ''))
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirtyRef = useRef(false)

  // Синхронизируем внешнее значение → локальное, пока пользователь не печатает.
  useEffect(() => {
    if (!isDirtyRef.current) {
      setLocal(String(externalValue ?? ''))
    }
  }, [externalValue])

  const handleChange = (v: string) => {
    setLocal(v)
    if (!debounceMs) {
      onChange?.(v)
      return
    }
    isDirtyRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      isDirtyRef.current = false
      timerRef.current = null
      onChange?.(v)
    }, debounceMs)
  }

  // Чистим таймер при размонтировании.
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { local, handleChange }
}

export function UIRangeField({
  label,
  unit,
  hint,
  error,
  fromValue,
  toValue,
  fromPlaceholder = 'от',
  toPlaceholder = 'до',
  onFromChange,
  onToChange,
  disabled,
  className,
  debounceMs,
}: RangeFieldProps) {
  const fromId = useId();
  const toId = useId();
  const hasError = !!error;

  const { local: localFrom, handleChange: handleFromChange } = useDebouncedInput(fromValue, onFromChange, debounceMs)
  const { local: localTo,   handleChange: handleToChange   } = useDebouncedInput(toValue,   onToChange,   debounceMs)

  const inputCls = cn(
    'flex h-10 flex-1 items-center rounded-sm border bg-surface-page px-3 transition-colors',
    hasError
      ? 'border-error focus-within:ring-2 focus-within:ring-error/20'
      : 'border-border-strong hover:border-text-faint focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
    disabled && 'bg-surface-subtle cursor-not-allowed opacity-60',
  );

  return (
    <fieldset className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <legend className="mb-1.5 text-sm font-medium text-text-base">{label}</legend>
      )}

      <div className="flex items-center gap-2">
        <label htmlFor={fromId} className={inputCls}>
          <span className="mr-2 text-text-faint text-sm">от</span>
          <input
            id={fromId}
            type="number"
            inputMode="numeric"
            value={localFrom}
            onChange={(e) => handleFromChange(e.target.value)}
            placeholder={fromPlaceholder}
            disabled={disabled}
            className="w-full bg-transparent text-sm tabular-nums text-text-base placeholder:text-text-faint outline-none"
          />
        </label>

        <label htmlFor={toId} className={inputCls}>
          <span className="mr-2 text-text-faint text-sm">до</span>
          <input
            id={toId}
            type="number"
            inputMode="numeric"
            value={localTo}
            onChange={(e) => handleToChange(e.target.value)}
            placeholder={toPlaceholder}
            disabled={disabled}
            className="w-full bg-transparent text-sm tabular-nums text-text-base placeholder:text-text-faint outline-none"
          />
        </label>

        {unit && <span className="shrink-0 text-sm text-text-faint">{unit}</span>}
      </div>

      {error ? (
        <span className="text-xs text-error">{error}</span>
      ) : hint ? (
        <span className="text-xs text-text-faint">{hint}</span>
      ) : null}
    </fieldset>
  );
}
