import type { Meta, StoryObj } from '@storybook/react';
import { UIEmptyState } from '@/shared/ui/ui-empty-state';
import { UIButton } from '@/shared/ui/ui-button';
import { IconInfo, IconAlertTriangle } from '@/shared/ui/ui-icons';

const meta = {
  title: 'UI/EmptyState',
  component: UIEmptyState,
  tags: ['autodocs'],
  args: {
    icon: <IconInfo size={24} />,
    title: 'Ничего не найдено',
    description: 'Попробуйте изменить фильтры или расширить поиск',
  },
  argTypes: {
    icon: { control: false },
    action: { control: false },
    secondaryAction: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof UIEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <UIButton>Сбросить фильтры</UIButton>,
  },
};

export const WithTwoActions: Story = {
  args: {
    action: <UIButton>Сбросить фильтры</UIButton>,
    secondaryAction: <UIButton variant="ghost">На главную</UIButton>,
  },
};

export const NoFavorites: Story = {
  args: {
    icon: <IconInfo size={24} />,
    title: 'В избранном пока пусто',
    description: 'Добавляйте объявления, чтобы вернуться к ним позже',
    action: <UIButton>Найти квартиру</UIButton>,
  },
};

export const Error: Story = {
  args: {
    icon: <IconAlertTriangle size={24} />,
    title: 'Что-то пошло не так',
    description: 'Не удалось загрузить данные. Попробуйте ещё раз',
    action: <UIButton variant="secondary">Повторить</UIButton>,
  },
};
