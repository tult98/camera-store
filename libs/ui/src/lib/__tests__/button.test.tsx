import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button text="Click me" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('should apply filled variant class by default', () => {
    render(<Button text="Test" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn');
    expect(button).not.toHaveClass('btn-outline');
  });

  it('should apply outlined variant class', () => {
    render(<Button text="Test" variant="outlined" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-outline');
  });

  it('should apply primary intent class', () => {
    render(<Button text="Test" intent="primary" />);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-primary');
  });

  it('should apply danger intent class', () => {
    render(<Button text="Test" intent="danger" />);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-error');
  });

  it('should apply success intent class', () => {
    render(<Button text="Test" intent="success" />);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-success');
  });

  it('should apply warning intent class', () => {
    render(<Button text="Test" intent="warning" />);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-warning');
  });

  it('should apply small size class', () => {
    render(<Button text="Test" size="small" />);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-sm');
  });

  it('should apply medium size class by default', () => {
    render(<Button text="Test" />);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-md');
  });

  it('should apply large size class', () => {
    render(<Button text="Test" size="large" />);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-lg');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button text="Test" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading spinner when loading', () => {
    render(<Button text="Test" loading />);
    const button = screen.getByRole('button');
    const spinner = button.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should combine multiple props correctly', () => {
    render(
      <Button
        text="Save"
        variant="outlined"
        intent="primary"
        size="large"
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-outline', 'btn-primary', 'btn-lg');
    expect(button).toHaveTextContent('Save');
  });
});
