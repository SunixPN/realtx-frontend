import type { ReactNode } from 'react';
import { cn } from '@/shared/helpers/cn';
export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export interface BadgeProps {
  tone?:      BadgeTone;
  solid?:     boolean;
  icon?:      ReactNode;
  children:   ReactNode;
  className?: string;
}
const SUBTLE: Record<BadgeTone, string> = {
  neutral: 'bg-surface-subtle text-text-muted border-border',
  brand:   'bg-brand-bg text-brand border-brand/20',
  success: 'bg-success-bg text-success border-success/20',
  warning: 'bg-warning-bg text-warning border-warning/20',
  danger:  'bg-error-bg text-error border-error/20',
  info:    'bg-info-bg text-info border-info/20',
};
const SOLID: Record<BadgeTone, string> = {
  neutral: 'bg-text-base/85 text-white border-transparent',
  brand:   'bg-brand text-white border-transparent',
  success: 'bg-success text-white border-transparent',
  warning: 'bg-warning text-white border-transparent',
  danger:  'bg-error text-white border-transparent',
  info:    'bg-info text-white border-transparent',
};
export function UIBadge({
  tone = 'neutral',
  solid = false,
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-xs border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap',
        solid ? SOLID[tone] : SUBTLE[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
