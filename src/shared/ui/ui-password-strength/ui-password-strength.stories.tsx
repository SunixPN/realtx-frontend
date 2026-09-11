import type { Meta, StoryObj } from '@storybook/react';
import { UIPasswordStrength } from '@/shared/ui/ui-password-strength';

const meta = {
    title: 'UI/PasswordStrength',
    component: UIPasswordStrength,
    tags: ['autodocs'],
    args: {
        value: 'medium',
    },
    argTypes: {
        value: {
            control: 'radio',
            options: ['weak', 'medium', 'strong'],
        },
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof UIPasswordStrength>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { value: 'weak', isEmpty: true } };

export const Weak: Story = { args: { value: 'weak' } };

export const Medium: Story = { args: { value: 'medium' } };

export const Strong: Story = { args: { value: 'strong' } };

export const AllStates: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-80">
            <UIPasswordStrength value="weak" />
            <UIPasswordStrength value="medium" />
            <UIPasswordStrength value="strong" />
        </div>
    ),
};
