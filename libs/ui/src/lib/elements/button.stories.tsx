import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Elements/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['filled', 'outlined'],
    },
    intent: {
      control: 'select',
      options: ['primary', 'danger', 'success', 'warning', 'neutral'],
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
    type: {
      control: 'radio',
      options: ['button', 'submit', 'reset'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    wide: {
      control: 'boolean',
    },
    block: {
      control: 'boolean',
    },
    square: {
      control: 'boolean',
    },
    circle: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    text: 'Button',
  },
};

export const Primary: Story = {
  args: {
    text: 'Primary Button',
    intent: 'primary',
  },
};

export const Danger: Story = {
  args: {
    text: 'Danger Button',
    intent: 'danger',
  },
};

export const Success: Story = {
  args: {
    text: 'Success Button',
    intent: 'success',
  },
};

export const Warning: Story = {
  args: {
    text: 'Warning Button',
    intent: 'warning',
  },
};

export const Outlined: Story = {
  args: {
    text: 'Outlined Button',
    variant: 'outlined',
    intent: 'primary',
  },
};

export const Small: Story = {
  args: {
    text: 'Small Button',
    size: 'small',
    intent: 'primary',
  },
};

export const Medium: Story = {
  args: {
    text: 'Medium Button',
    size: 'medium',
    intent: 'primary',
  },
};

export const Large: Story = {
  args: {
    text: 'Large Button',
    size: 'large',
    intent: 'primary',
  },
};

export const Loading: Story = {
  args: {
    text: 'Loading Button',
    intent: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    text: 'Disabled Button',
    intent: 'primary',
    disabled: true,
  },
};

export const Wide: Story = {
  args: {
    text: 'Wide Button',
    intent: 'primary',
    wide: true,
  },
};

export const Block: Story = {
  args: {
    text: 'Block Button',
    intent: 'primary',
    block: true,
  },
};

export const Square: Story = {
  args: {
    text: '✓',
    intent: 'primary',
    square: true,
  },
};

export const Circle: Story = {
  args: {
    text: '✓',
    intent: 'primary',
    circle: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button text="Neutral" intent="neutral" />
        <Button text="Primary" intent="primary" />
        <Button text="Success" intent="success" />
        <Button text="Warning" intent="warning" />
        <Button text="Danger" intent="danger" />
      </div>
      <div className="flex gap-2">
        <Button text="Outlined Neutral" variant="outlined" intent="neutral" />
        <Button text="Outlined Primary" variant="outlined" intent="primary" />
        <Button text="Outlined Success" variant="outlined" intent="success" />
        <Button text="Outlined Warning" variant="outlined" intent="warning" />
        <Button text="Outlined Danger" variant="outlined" intent="danger" />
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button text="Small" size="small" intent="primary" />
      <Button text="Medium" size="medium" intent="primary" />
      <Button text="Large" size="large" intent="primary" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button text="Normal" intent="primary" />
      <Button text="Loading" intent="primary" loading />
      <Button text="Disabled" intent="primary" disabled />
    </div>
  ),
};

export const ShapeModifiers: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button text="Default" intent="primary" />
        <Button text="Wide" intent="primary" wide />
      </div>
      <div>
        <Button text="Block (full width)" intent="primary" block />
      </div>
      <div className="flex items-center gap-2">
        <Button text="✓" intent="primary" square />
        <Button text="✓" intent="primary" circle />
        <Button text="+" intent="success" circle />
        <Button text="×" intent="danger" circle />
      </div>
    </div>
  ),
};
