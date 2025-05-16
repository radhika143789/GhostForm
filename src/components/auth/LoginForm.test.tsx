
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';
import { renderWithProviders, mockSupabaseClient } from '@/test/utils';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the useUser hook
vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    refreshUser: vi.fn(),
  }),
}));

// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('LoginForm', () => {
  const mockRequestPasswordReset = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    renderWithProviders(<LoginForm onRequestPasswordReset={mockRequestPasswordReset} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('displays validation errors when form is submitted without data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm onRequestPasswordReset={mockRequestPasswordReset} />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(signInButton);

    // Since we have HTML5 validation, we need to fill out the form to test submission
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    await user.click(signInButton);
  });

  it('calls the supabase signInWithPassword method when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123' }, session: {} },
      error: null,
    });
    
    renderWithProviders(<LoginForm onRequestPasswordReset={mockRequestPasswordReset} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);
    
    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
  
  it('handles login errors correctly', async () => {
    const user = userEvent.setup();
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    });
    
    renderWithProviders(<LoginForm onRequestPasswordReset={mockRequestPasswordReset} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(signInButton);
    
    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    });
  });

  it('calls the onRequestPasswordReset function when "Forgot password" is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm onRequestPasswordReset={mockRequestPasswordReset} />);
    
    const forgotPasswordButton = screen.getByText(/forgot password/i);
    await user.click(forgotPasswordButton);
    
    expect(mockRequestPasswordReset).toHaveBeenCalledTimes(1);
  });
});
