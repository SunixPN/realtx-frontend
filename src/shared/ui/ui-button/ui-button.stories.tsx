import type { Meta, StoryObj } from '@storybook/react';
import { UIButton } from '@/shared/ui/ui-button';

const meta = {
  title: 'UI/Button',
  component: UIButton,
  tags: ['autodocs'],
  args: {
    children: 'Кнопка',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Визуальный стиль',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Размер',
    },
    loading: { control: 'boolean', description: 'Состояние загрузки' },
    disabled: { control: 'boolean', description: 'Заблокирована' },
    fullWidth: { control: 'boolean', description: 'На всю ширину' },
    iconLeft: { control: false },
    iconRight: { control: false },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof UIButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Варианты ─────────────────────────────────────────────────────

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Удалить' },
};

// ─── Размеры ──────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: 'sm', children: 'Маленькая' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Большая' },
};

// ─── Состояния ────────────────────────────────────────────────────

export const Loading: Story = {
  args: { loading: true, children: 'Сохранение' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Недоступна' },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'На всю ширину' },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

// ─── С иконками ───────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

export const WithIconLeft: Story = {
  args: { iconLeft: <PlusIcon />, children: 'Добавить' },
};

export const WithIconRight: Story = {
  args: { iconRight: <ArrowIcon />, children: 'Далее' },
};

// ─── Витрина всех вариантов ───────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <UIButton variant="primary">Primary</UIButton>
        <UIButton variant="secondary">Secondary</UIButton>
        <UIButton variant="ghost">Ghost</UIButton>
        <UIButton variant="danger">Danger</UIButton>
      </div>
      <div className="flex items-center gap-3">
        <UIButton size="sm">Small</UIButton>
        <UIButton size="md">Medium</UIButton>
        <UIButton size="lg">Large</UIButton>
      </div>
      <div className="flex items-center gap-3">
        <UIButton loading>Loading</UIButton>
        <UIButton disabled>Disabled</UIButton>
        <UIButton iconLeft={<PlusIcon />}>С иконкой</UIButton>
        <UIButton iconRight={<ArrowIcon />} variant="secondary">Далее</UIButton>
      </div>
    </div>
  ),
};
