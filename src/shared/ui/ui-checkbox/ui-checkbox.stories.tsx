import type { Meta, StoryObj } from '@storybook/react';
import { UICheckbox } from '@/shared/ui/ui-checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: UICheckbox,
  tags: ['autodocs'],
  args: {
    label: 'Согласен с условиями',
    disabled: false,
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof UICheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true, label: 'Заблокировано' } };

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Уже выбрано' },
};

export const NoLabel: Story = { args: { label: undefined } };

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <UICheckbox label="Балкон" defaultChecked />
      <UICheckbox label="Лоджия" />
      <UICheckbox label="Парковка" defaultChecked />
      <UICheckbox label="Мебель" />
      <UICheckbox label="Wi-Fi" defaultChecked />
    </div>
  ),
};
