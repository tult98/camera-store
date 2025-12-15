import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('should render successfully', () => {
    render(<Button />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should display welcome text', () => {
    render(<Button />);
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome to Button!');
  });
});
