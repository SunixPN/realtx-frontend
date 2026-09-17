'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';
import {
  IconCheckCircle,
  IconAlertTriangle,
  IconInfo,
  IconX,
} from '@/shared/ui/ui-icons';

export type ToastTone = 'success' | 'danger' | 'info' | 'warning';

export interface ToastProps {
  tone?:     ToastTone;
  title:     string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?:  () => void;
  className?: string;
}

const TONE_ICON: Record<ToastTone, ReactNode> = {
  success: <IconCheckCircle    className="text-success" />,
  danger:  <IconAlertTriangle  className="text-error" />,
  warning: <IconAlertTriangle  className="text-warning" />,
  info:    <IconInfo           className="text-info" />,
};

export function UIToast({
  tone = 'info',
  title,
  actionLabel,
  onAction,
  onClose,
  className,
}: ToastProps) {
  const t = useTranslations('common');
  return (
    <div
      role="status"
      className={cn(
        'flex w-full max-w-sm items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3 shadow-lg',
        className,
      )}
    >
      <span className="shrink-0">{TONE_ICON[tone]}</span>
      <span className="flex-1 text-sm text-text-base">{title}</span>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-medium text-brand hover:opacity-80"
        >
          {actionLabel}
        </button>
      )}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close_aria')}
          className="text-text-faint hover:text-text-base"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
