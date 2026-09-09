import type { Meta, StoryObj } from '@storybook/react';
import { UIToast } from '@/shared/ui/ui-toast';

const meta = {
  title: 'UI/Toast',
  component: UIToast,
  tags: ['autodocs'],
  args: {
    tone: 'info',
    title: 'Настройки сохранены',
  },
  argTypes: {
    tone: { control: 'select', options: ['success', 'danger', 'warning', 'info'] },
    onAction: { action: 'action' },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof UIToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: { tone: 'success', title: 'Объявление добавлено в избранное' },
};

export const Warning: Story = {
  args: { tone: 'warning', title: 'Скоро закончится подписка' },
};

export const Danger: Story = {
  args: { tone: 'danger', title: 'Не удалось сохранить изменения' },
};

export const WithAction: Story = {
  args: {
    tone: 'success',
    title: 'Объявление удалено',
    actionLabel: 'Отменить',
  },
};

export const WithClose: Story = {
  args: {
    tone: 'info',
    title: 'Новое сообщение от продавца',
    onClose: () => {},
  },
};

export const Full: Story = {
  args: {
    tone: 'success',
    title: 'Готово!',
    actionLabel: 'Открыть',
    onClose: () => {},
  },
};
