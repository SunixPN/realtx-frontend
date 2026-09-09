import { useState, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/shared/helpers/cn';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content:    ReactNode;
  placement?: TooltipPlacement;
  children:   ReactElement;
  className?: string;
}

const PLACEMENT: Record<TooltipPlacement, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
  right:  'left-full top-1/2 -translate-y-1/2 ml-1.5',
};

export function UITooltip({
  content,
  placement = 'top',
  children,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-sm bg-text-base px-2 py-1 text-xs text-white shadow-lg',
            PLACEMENT[placement],
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
