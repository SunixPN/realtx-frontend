import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon:             ReactNode;
  title:            string;
  description:      string;
  action?:          ReactNode;
  secondaryAction?: ReactNode;
}

export function UIEmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-surface-subtle text-text-faint">
        {icon}
      </div>
      <div className="max-w-sm">
        <h3 className="text-base font-semibold text-text-base">{title}</h3>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      </div>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
