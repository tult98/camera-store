import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Form } from './index';
import { TextInput } from './TextInput';

interface FormData {
  email: string;
  password: string;
  username?: string;
}

const meta: Meta<typeof Form<FormData>> = {
  component: Form,
  title: 'Form/Form',
  tags: ['autodocs'],
  args: {
    onSubmit: action('onSubmit'),
  },
};

export default meta;
type Story = StoryObj<typeof Form<FormData>>;

export const Default: Story = {
  render: (args) => (
    <Form<FormData> {...args} className="flex flex-col gap-4 max-w-sm">
      <TextInput<FormData> name="email" label="Email" placeholder="you@example.com" />
      <TextInput<FormData> name="password" label="Password" type="password" placeholder="Enter password" />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  ),
};

export const WithDefaultValues: Story = {
  render: (args) => (
    <Form<FormData>
      {...args}
      defaultValues={{ email: 'user@example.com', username: 'johndoe' }}
      className="flex flex-col gap-4 max-w-sm"
    >
      <TextInput<FormData> name="username" label="Username" />
      <TextInput<FormData> name="email" label="Email" type="email" />
      <TextInput<FormData> name="password" label="Password" type="password" placeholder="Enter password" />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  ),
};

export const WithRequiredFields: Story = {
  render: (args) => (
    <Form<FormData> {...args} className="flex flex-col gap-4 max-w-sm">
      <TextInput<FormData> name="email" label="Email" type="email" placeholder="you@example.com" required />
      <TextInput<FormData> name="password" label="Password" type="password" placeholder="Enter password" required />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  ),
};

export const LoginForm: Story = {
  render: (args) => (
    <div className="card bg-base-200 max-w-sm">
      <div className="card-body">
        <h2 className="card-title">Login</h2>
        <Form<FormData> {...args} className="flex flex-col gap-4">
          <TextInput<FormData> name="email" label="Email" type="email" placeholder="you@example.com" required />
          <TextInput<FormData> name="password" label="Password" type="password" placeholder="Enter password" required />
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </Form>
      </div>
    </div>
  ),
};

export const RegistrationForm: Story = {
  render: (args) => (
    <div className="card bg-base-200 max-w-md">
      <div className="card-body">
        <h2 className="card-title">Create Account</h2>
        <Form<FormData> {...args} className="flex flex-col gap-4">
          <TextInput<FormData> name="username" label="Username" placeholder="johndoe" required />
          <TextInput<FormData> name="email" label="Email" type="email" placeholder="you@example.com" required />
          <TextInput<FormData>
            name="password"
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            required
          />
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </Form>
      </div>
    </div>
  ),
};
