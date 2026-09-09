import type { Meta, StoryObj } from '@storybook/react';
import { UIIconButton } from '@/shared/ui/ui-icon-button';
import { IconX, IconCheck, IconChevronDown } from '@/shared/ui/ui-icons';

const meta = {
  title: 'UI/IconButton',
  component: UIIconButton,
  tags: ['autodocs'],
  args: {
    label: 'Закрыть',
    variant: 'secondary',
    size: 'md',
    children: <IconX />,
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    children: { control: false },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof UIIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary', children: <IconCheck /> } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger' } };

export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };

export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <UIIconButton label="OK" variant="primary"><IconCheck /></UIIconButton>
      <UIIconButton label="Закрыть" variant="secondary"><IconX /></UIIconButton>
      <UIIconButton label="Развернуть" variant="ghost"><IconChevronDown /></UIIconButton>
      <UIIconButton label="Удалить" variant="danger"><IconX /></UIIconButton>
    </div>
  ),
};
