import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import Login from '@/pages/Login';

// Mock the child components
vi.mock('@/components/auth/LoginForm', () => ({
  LoginForm: ({ onRequestPasswordReset }: { onRequestPasswordReset: () => void }) => (
    <div data-testid="login-form">
      <button onClick={onRequestPasswordReset}>Reset Password</button>
    </div>
  ),
}));

vi.mock('@/components/auth/PasswordResetDialog', () => ({
  PasswordResetDialog: ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
    <div data-testid="password-reset-dialog" data-open={open}>
      <button onClick={() => onOpenChange(false)}>Close</button>
    </div>
  ),
}));

describe('Login Page', () => {
  it('renders the login page correctly', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in to your ghost form account/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
  
  it('opens password reset dialog when requested', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    await user.click(resetButton);
    
    const dialog = screen.getByTestId('password-reset-dialog');
    expect(dialog).toHaveAttribute('data-open', 'true');
  });
});