import type { Meta, StoryObj } from '@storybook/react';
import { UIBadge } from '@/shared/ui/ui-badge';
const meta = {
  title: 'UI/Badge',
  component: UIBadge,
  tags: ['autodocs'],
  args: {
    children: 'Новое',
    tone: 'neutral',
    solid: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    solid: { control: 'boolean' },
    icon: { control: false },
  },
} satisfies Meta<typeof UIBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Brand: Story = { args: { tone: 'brand', children: 'Хит' } };
export const Success: Story = { args: { tone: 'success', children: 'Продано' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Торг' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Срочно' } };
export const Info: Story = { args: { tone: 'info', children: 'Новостройка' } };
export const Solid: Story = {
  args: { tone: 'brand', solid: true, children: 'На фото' },
};
export const AllTones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <UIBadge tone="neutral">Neutral</UIBadge>
        <UIBadge tone="brand">Brand</UIBadge>
        <UIBadge tone="success">Success</UIBadge>
        <UIBadge tone="warning">Warning</UIBadge>
        <UIBadge tone="danger">Danger</UIBadge>
        <UIBadge tone="info">Info</UIBadge>
      </div>
      <div className="flex flex-wrap gap-2">
        <UIBadge solid tone="neutral">Neutral</UIBadge>
        <UIBadge solid tone="brand">Brand</UIBadge>
        <UIBadge solid tone="success">Success</UIBadge>
        <UIBadge solid tone="warning">Warning</UIBadge>
        <UIBadge solid tone="danger">Danger</UIBadge>
        <UIBadge solid tone="info">Info</UIBadge>
      </div>
    </div>
  ),
};
