import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'Form/TextInput',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    name: 'default',
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    name: 'withLabel',
    label: 'Username',
    placeholder: 'Enter username',
  },
};

export const Required: Story = {
  args: {
    name: 'required',
    label: 'Email',
    placeholder: 'Enter email',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    name: 'withError',
    label: 'Email',
    placeholder: 'Enter email',
    error: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    label: 'Disabled Field',
    placeholder: 'Cannot edit this',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    required: true,
  },
};

export const Email: Story = {
  args: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
  },
};

export const Number: Story = {
  args: {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    placeholder: '0',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <TextInput name="default" placeholder="Default input" />
      <TextInput name="label" label="With Label" placeholder="Enter value" />
      <TextInput name="required" label="Required Field" placeholder="Required" required />
      <TextInput name="error" label="With Error" placeholder="Invalid input" error="This field has an error" />
      <TextInput name="disabled" label="Disabled" placeholder="Cannot edit" disabled />
    </div>
  ),
};

export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <TextInput name="text" label="Text" type="text" placeholder="Text input" />
      <TextInput name="email" label="Email" type="email" placeholder="email@example.com" />
      <TextInput name="password" label="Password" type="password" placeholder="Password" />
      <TextInput name="number" label="Number" type="number" placeholder="0" />
      <TextInput name="tel" label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
      <TextInput name="url" label="URL" type="url" placeholder="https://example.com" />
    </div>
  ),
};
