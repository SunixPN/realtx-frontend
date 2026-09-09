import type { Meta, StoryObj } from '@storybook/react';
import { UIChip } from '@/shared/ui/ui-chip';
import { UICheckbox } from '@/shared/ui/ui-checkbox';
import { UIRangeField } from '@/shared/ui/ui-range-field';
import { UIButton } from '@/shared/ui/ui-button';

const meta = {
  title: 'UI/Chip',
  component: UIChip,
  tags: ['autodocs'],
  args: {
    label: 'Комнаты',
  },
  argTypes: {
    children: { control: false },
    onClear: { action: 'cleared' },
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UIChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    label: 'Комнаты',
    children: (
      <div className="flex flex-col gap-2">
        <UICheckbox label="1 комната" />
        <UICheckbox label="2 комнаты" />
        <UICheckbox label="3 комнаты" />
        <UICheckbox label="4+" />
      </div>
    ),
  },
};

export const Filled: Story = {
  args: {
    label: 'Комнаты',
    value: '2, 3 комн.',
    count: 2,
    onClear: () => {},
    children: (
      <div className="flex flex-col gap-2">
        <UICheckbox label="1 комната" />
        <UICheckbox label="2 комнаты" defaultChecked />
        <UICheckbox label="3 комнаты" defaultChecked />
        <UICheckbox label="4+" />
      </div>
    ),
  },
};

export const PriceRange: Story = {
  args: {
    label: 'Цена',
    popoverClassName: 'w-80',
    children: (
      <div className="flex flex-col gap-3">
        <UIRangeField label="Цена, ₽" fromPlaceholder="от" toPlaceholder="до" />
        <div className="flex gap-2">
          <UIButton size="sm" variant="secondary" fullWidth>Сбросить</UIButton>
          <UIButton size="sm" fullWidth>Применить</UIButton>
        </div>
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: { label: 'Недоступно', disabled: true },
};

export const NoDropdown: Story = {
  args: { label: 'Просто чип' },
};

export const FilterRow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <UIChip
        label="Комнаты"
        value="2, 3 комн."
        count={2}
        onClear={() => {}}
      >
        <div className="flex flex-col gap-2">
          <UICheckbox label="1 комната" />
          <UICheckbox label="2 комнаты" defaultChecked />
          <UICheckbox label="3 комнаты" defaultChecked />
          <UICheckbox label="4+" />
        </div>
      </UIChip>

      <UIChip label="Цена" popoverClassName="w-80">
        <div className="flex flex-col gap-3">
          <UIRangeField label="Цена, ₽" />
          <div className="flex gap-2">
            <UIButton size="sm" variant="secondary" fullWidth>Сбросить</UIButton>
            <UIButton size="sm" fullWidth>Применить</UIButton>
          </div>
        </div>
      </UIChip>

      <UIChip label="Метро">
        <div className="flex flex-col gap-2">
          <UICheckbox label="Восток" />
          <UICheckbox label="Октябрьская" />
          <UICheckbox label="Каменная Горка" />
          <UICheckbox label="Малиновка" />
        </div>
      </UIChip>

      <UIChip label="Площадь" popoverClassName="w-80">
        <UIRangeField label="Площадь" unit="м²" />
      </UIChip>

      <UIChip label="Этаж">
        <UIRangeField label="Этаж" />
      </UIChip>
    </div>
  ),
};
