'use client';

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/helpers/cn';
import { usePopoverPosition } from '@/shared/helpers/use-popover-position';
import { IconChevronDown, IconX } from '@/shared/ui/ui-icons';

export interface ChipProps {
  /** Название фильтра, показывается когда значение не выбрано. */
  label:      string;
  /** Отображаемое значение фильтра. Если задано — chip рендерится в filled-виде.
   * Может быть строкой или React-нодом (например, чтобы вставить глиф валюты). */
  value?:     ReactNode;
  /** Количество выбранных элементов (например, 2 комнаты). */
  count?:     number;
  /** Контент выпадающей панели: чекбоксы, диапазоны, что угодно. */
  children?:  ReactNode;
  /** Ширина попапа (переопределяет автоматическую min-w-60). */
  popoverClassName?: string;
  /** Показывает крестик очистки в filled-состоянии. */
  onClear?:   () => void;
  disabled?:  boolean;
  className?: string;
}

export function UIChip({
  label,
  value,
  count,
  children,
  popoverClassName,
  onClear,
  disabled,
  className,
}: ChipProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const hasValue = value !== undefined && value !== null && value !== '';
  const variant = open ? 'open' : hasValue ? 'filled' : 'empty';

  const pos = usePopoverPosition(triggerRef, open);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      // Клик по вложенному портальному попапу (например, дропдаун UISelect,
      // рендерящийся через createPortal в body) — не outside-click. Иначе
      // клик по опции закрыл бы chip раньше, чем сработал onClick опции.
      const inNestedPopover =
        t instanceof Element && !!t.closest('[data-popover-portal="true"]');
      if (
        !inNestedPopover &&
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

  const VARIANT_CLS: Record<'empty' | 'filled' | 'open', string> = {
    empty:  'bg-surface-page border-border-strong text-text-base hover:bg-surface-subtle',
    filled: 'bg-brand-bg border-brand text-brand hover:opacity-90',
    open:   'bg-surface-page border-brand text-text-base ring-2 ring-brand/20',
  };

  return (
    <div className={cn('inline-flex', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup={children ? 'dialog' : undefined}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-sm border px-3 text-sm font-medium whitespace-nowrap transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-50',
          VARIANT_CLS[variant],
        )}
      >
        <span>{hasValue ? value : label}</span>

        {count !== undefined && count > 0 && (
          <span
            className={cn(
              'rounded-xs px-1 text-xs font-semibold tabular-nums',
              hasValue ? 'bg-brand text-white' : 'bg-surface-muted text-text-muted',
            )}
          >
            {count}
          </span>
        )}

        {hasValue && onClear ? (
          <span
            role="button"
            aria-label="Очистить"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-0.5 rounded-full p-0.5 hover:bg-brand/10"
          >
            <IconX size={14} />
          </span>
        ) : (
          children && (
            <IconChevronDown
              size={16}
              className={cn('opacity-60 transition-transform', open && 'rotate-180')}
            />
          )
        )}
      </button>

      {open && children && !disabled && pos && typeof window !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            data-popover-portal="true"
            style={{
              position: 'fixed',
              top: pos.top + 4,
              left: pos.left,
            }}
            className={cn(
              'z-[9999] min-w-60 rounded-md border border-border bg-surface-raised p-3 shadow-lg',
              popoverClassName,
            )}
          >
            {children}
          </div>,
          document.body,
        )
      }
    </div>
  );
}
