import type { Meta, StoryObj } from '@storybook/react';
import { UISkeleton } from '@/shared/ui/ui-skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: UISkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof UISkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  args: { className: 'h-4 w-64' },
};

export const Circle: Story = {
  args: { className: 'size-12 rounded-full' },
};

export const Card: Story = {
  args: { className: 'h-48 w-80 rounded-lg' },
};

export const PropertyCard: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-3">
      <UISkeleton className="h-48 w-full rounded-lg" />
      <UISkeleton className="h-5 w-3/4" />
      <UISkeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <UISkeleton className="h-6 w-16 rounded-xs" />
        <UISkeleton className="h-6 w-16 rounded-xs" />
      </div>
    </div>
  ),
};
