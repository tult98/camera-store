import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button text="Click me" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  describe('variants', () => {
    it('should apply filled variant by default (no outline class)', () => {
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
  });

  describe('intents', () => {
    it('should apply neutral intent by default (no intent class)', () => {
      render(<Button text="Test" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).not.toHaveClass('btn-primary');
      expect(button).not.toHaveClass('btn-error');
      expect(button).not.toHaveClass('btn-success');
      expect(button).not.toHaveClass('btn-warning');
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
  });

  describe('sizes', () => {
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
  });

  describe('states', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button text="Test" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show loading spinner when loading', () => {
      render(<Button text="Test" loading />);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('loading', 'loading-spinner', 'loading-xs');
    });

    it('should be disabled when loading', () => {
      render(<Button text="Test" loading />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('shape modifiers', () => {
    it('should apply wide class', () => {
      render(<Button text="Test" wide />);
      expect(screen.getByRole('button')).toHaveClass('btn', 'btn-wide');
    });

    it('should apply block class', () => {
      render(<Button text="Test" block />);
      expect(screen.getByRole('button')).toHaveClass('btn', 'btn-block');
    });

    it('should apply square class', () => {
      render(<Button text="Test" square />);
      expect(screen.getByRole('button')).toHaveClass('btn', 'btn-square');
    });

    it('should apply circle class', () => {
      render(<Button text="Test" circle />);
      expect(screen.getByRole('button')).toHaveClass('btn', 'btn-circle');
    });
  });

  describe('button type', () => {
    it('should have type button by default', () => {
      render(<Button text="Test" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('should accept submit type', () => {
      render(<Button text="Test" type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should accept reset type', () => {
      render(<Button text="Test" type="reset" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  describe('onClick handler', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button text="Test" onClick={handleClick} />);
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(<Button text="Test" onClick={handleClick} disabled />);
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = jest.fn();
      render(<Button text="Test" onClick={handleClick} loading />);
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  it('should combine multiple props correctly', () => {
    render(<Button text="Save" variant="outlined" intent="primary" size="large" wide />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-outline', 'btn-primary', 'btn-lg', 'btn-wide');
    expect(button).toHaveTextContent('Save');
  });
});
