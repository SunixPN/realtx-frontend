import type { Meta, StoryObj } from '@storybook/react';
import { UIRangeField } from '@/shared/ui/ui-range-field';

const meta = {
  title: 'UI/RangeField',
  component: UIRangeField,
  tags: ['autodocs'],
  args: {
    label: 'Цена',
    unit: '₽',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UIRangeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { fromValue: 50000, toValue: 100000, label: 'Цена', unit: '₽' },
};

export const Area: Story = {
  args: { label: 'Площадь', unit: 'м²', fromValue: 40, toValue: 80 },
};

export const Floor: Story = {
  args: { label: 'Этаж', fromValue: 2, toValue: 20 },
};

export const WithHint: Story = {
  args: { label: 'Год постройки', hint: 'Оставьте пустым для любого года' },
};

export const WithError: Story = {
  args: {
    label: 'Цена',
    unit: '₽',
    fromValue: 100000,
    toValue: 50000,
    error: '«До» должно быть больше «от»',
  },
};

export const Disabled: Story = {
  args: { label: 'Цена', unit: '₽', fromValue: 50000, toValue: 100000, disabled: true },
};
