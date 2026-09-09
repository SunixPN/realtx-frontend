import type { Meta, StoryObj } from '@storybook/react';
import { UITooltip } from '@/shared/ui/ui-tooltip';
import { UIButton } from '@/shared/ui/ui-button';
import { UIIconButton } from '@/shared/ui/ui-icon-button';
import { IconInfo } from '@/shared/ui/ui-icons';

const meta = {
  title: 'UI/Tooltip',
  component: UITooltip,
  tags: ['autodocs'],
  args: {
    content: 'Подсказка',
    placement: 'top',
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-16">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UITooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    placement: 'top',
    children: <UIButton>Наведи на меня</UIButton>,
  },
};

export const Bottom: Story = {
  args: {
    placement: 'bottom',
    children: <UIButton>Внизу</UIButton>,
  },
};

export const Left: Story = {
  args: {
    placement: 'left',
    children: <UIButton>Слева</UIButton>,
  },
};

export const Right: Story = {
  args: {
    placement: 'right',
    children: <UIButton>Справа</UIButton>,
  },
};

export const OnIconButton: Story = {
  args: {
    content: 'Сохранить в избранное',
    children: (
      <UIIconButton label="Избранное" variant="ghost">
        <IconInfo />
      </UIIconButton>
    ),
  },
};
