import { cn } from '@/shared/helpers/cn';

export interface SkeletonProps {
  className?: string;
}

export function UISkeleton({ className }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Загрузка"
      className={cn('animate-shimmer rounded-sm', className)}
    />
  );
}
