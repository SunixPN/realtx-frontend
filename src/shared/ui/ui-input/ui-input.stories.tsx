import type { Meta, StoryObj } from '@storybook/react';
import { UIInput } from '@/shared/ui/ui-input';

const meta = {
  title: 'UI/Input',
  component: UIInput,
  tags: ['autodocs'],
  args: {
    placeholder: 'Введите значение',
    disabled: false,
  },
  argTypes: {
    icon: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UIInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Email', placeholder: 'you@example.com' },
};

export const WithHint: Story = {
  args: { label: 'Пароль', type: 'password', hint: 'Минимум 8 символов' },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    value: 'invalid-email',
    error: 'Некорректный email',
  },
};

export const Filled: Story = {
  args: { label: 'Имя', defaultValue: 'Иван' },
};

export const Disabled: Story = {
  args: { label: 'Заблокировано', value: 'Нельзя редактировать', disabled: true },
};

export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <UIInput label="Email" type="email" placeholder="you@example.com" />
      <UIInput label="Пароль" type="password" hint="Минимум 8 символов" />
      <UIInput label="Телефон" type="tel" placeholder="+375 (29) 000-00-00" />
    </div>
  ),
};
