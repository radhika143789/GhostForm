import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
  it('shows "Very Weak" for short passwords', () => {
    render(<PasswordStrengthMeter password="abc" />);
    expect(screen.getByText(/very weak/i)).toBeInTheDocument();
  });

  it('shows "Weak" for medium-strength passwords', () => {
    render(<PasswordStrengthMeter password="abcdef12" />);
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
  });

  it('shows "Good" for stronger passwords', () => {
    render(<PasswordStrengthMeter password="Abcdef12!" />);
    expect(screen.getByText(/good/i)).toBeInTheDocument();
  });

  it('shows "Strong" for complex passwords', () => {
    render(<PasswordStrengthMeter password="Abcdef12!@#$" />);
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('renders progress bar with correct color', () => {
    const { rerender } = render(<PasswordStrengthMeter password="abc" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-destructive');

    rerender(<PasswordStrengthMeter password="Abcdef12!@#$" />);
    expect(progressBar).toHaveClass('bg-green-500');
  });
});
