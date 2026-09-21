import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/helpers/cn';
export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type IconButtonSize    = 'sm' | 'md' | 'lg';
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label:    string; 
  variant?: IconButtonVariant;
  size?:    IconButtonSize;
  children: ReactNode;
}
const base =
  'inline-flex items-center justify-center rounded-md ' +
  'transition-colors duration-150 cursor-pointer select-none ' +
  'disabled:opacity-50 disabled:pointer-events-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';
const variants: Record<IconButtonVariant, string> = {
  primary:   'bg-brand text-white hover:bg-brand-hover',
  secondary: 'bg-surface-subtle text-text-base border border-border hover:bg-surface-muted',
  ghost:     'bg-transparent text-text-muted hover:bg-surface-subtle hover:text-text-base',
  danger:    'bg-error text-white hover:opacity-90',
};
const sizes: Record<IconButtonSize, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
};
export const UIIconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, variant = 'secondary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
UIIconButton.displayName = 'UIIconButton';
