import type { Meta, StoryObj } from '@storybook/react';
import { UISwitch } from '@/shared/ui/ui-switch';

const meta = {
  title: 'UI/Switch',
  component: UISwitch,
  tags: ['autodocs'],
  args: {
    label: 'Тёмная тема',
    disabled: false,
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof UISwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const NoLabel: Story = { args: { label: undefined } };

export const Disabled: Story = { args: { disabled: true, label: 'Заблокировано' } };

export const DisabledOn: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Уже включено' },
};

export const SettingsList: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <UISwitch label="Уведомления о новых предложениях" defaultChecked />
      <UISwitch label="Email-рассылка" />
      <UISwitch label="SMS о важных изменениях" defaultChecked />
      <UISwitch label="Персональные рекомендации" defaultChecked />
    </div>
  ),
};
