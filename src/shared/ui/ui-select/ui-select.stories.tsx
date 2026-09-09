import type { Meta, StoryObj } from '@storybook/react';
import { UISelect } from '@/shared/ui/ui-select';

const cityOptions = [
  { value: 'minsk',    label: 'Минск' },
  { value: 'brest',    label: 'Брест' },
  { value: 'gomel',    label: 'Гомель' },
  { value: 'grodno',   label: 'Гродно' },
  { value: 'vitebsk',  label: 'Витебск' },
  { value: 'mogilev',  label: 'Могилёв' },
];

const meta = {
  title: 'UI/Select',
  component: UISelect,
  tags: ['autodocs'],
  args: {
    options: cityOptions,
    placeholder: 'Выберите город',
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
  decorators: [
    (Story) => (
      <div className="w-80 py-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UISelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Город' },
};

export const Filled: Story = {
  args: { label: 'Город', defaultValue: 'minsk' },
};

export const WithHint: Story = {
  args: {
    label: 'Тип недвижимости',
    hint: 'Можно изменить позже',
    options: [
      { value: 'flat',     label: 'Квартира' },
      { value: 'house',    label: 'Дом' },
      { value: 'commerce', label: 'Коммерческая' },
    ],
    placeholder: 'Выберите тип',
  },
};

export const WithError: Story = {
  args: {
    label: 'Город',
    error: 'Выберите город',
  },
};

export const Disabled: Story = {
  args: { label: 'Город', defaultValue: 'minsk', disabled: true },
};

export const LongList: Story = {
  args: {
    label: 'Район',
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `district-${i + 1}`,
      label: `Район №${i + 1}`,
    })),
    placeholder: 'Выберите район',
  },
};
