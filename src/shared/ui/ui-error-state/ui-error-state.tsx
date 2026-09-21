'use client';
import { useTranslations } from 'next-intl';
import { UIEmptyState } from '@/shared/ui/ui-empty-state';
import { UIButton } from '@/shared/ui/ui-button';
import { IconAlertTriangle } from '@/shared/ui/ui-icons';
export interface ErrorStateProps {
  title?:       string;
  description?: string;
  onRetry?:     () => void;
  retryLabel?:  string;
}
export function UIErrorState({
  title,
  description,
  onRetry,
  retryLabel,
}: ErrorStateProps) {
  const t = useTranslations('common');
  return (
    <UIEmptyState
      icon={<IconAlertTriangle size={24} />}
      title={title ?? t('error_title')}
      description={description ?? t('error_description')}
      action={
        onRetry && (
          <UIButton variant="secondary" onClick={onRetry}>
            {retryLabel ?? t('retry')}
          </UIButton>
        )
      }
    />
  );
}
