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
  title = 'Что-то пошло не так',
  description = 'Не удалось загрузить данные. Попробуйте ещё раз',
  onRetry,
  retryLabel = 'Повторить',
}: ErrorStateProps) {
  return (
    <UIEmptyState
      icon={<IconAlertTriangle size={24} />}
      title={title}
      description={description}
      action={
        onRetry && (
          <UIButton variant="secondary" onClick={onRetry}>
            {retryLabel}
          </UIButton>
        )
      }
    />
  );
}
