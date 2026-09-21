import type { Meta, StoryObj } from '@storybook/react';
import { UIErrorState } from '@/shared/ui/ui-error-state';
const meta = {
  title: 'UI/ErrorState',
  component: UIErrorState,
  tags: ['autodocs'],
  argTypes: {
    onRetry: { action: 'retry' },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof UIErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithRetry: Story = {
  args: { onRetry: () => {} },
};
export const NetworkError: Story = {
  args: {
    title: 'Нет соединения',
    description: 'Проверьте подключение к интернету и попробуйте снова',
    onRetry: () => {},
  },
};
export const NotFound: Story = {
  args: {
    title: 'Объявление не найдено',
    description: 'Возможно, оно было удалено или снято с продажи',
    retryLabel: 'На главную',
    onRetry: () => {},
  },
};
