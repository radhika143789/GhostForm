
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordResetDialog } from '@/components/auth/PasswordResetDialog';
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

describe('PasswordResetDialog', () => {
  const mockOnOpenChange = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dialog correctly when open', () => {
    renderWithProviders(<PasswordResetDialog open={true} onOpenChange={mockOnOpenChange} />);
    
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('does not render the dialog when not open', () => {
    renderWithProviders(<PasswordResetDialog open={false} onOpenChange={mockOnOpenChange} />);
    
    expect(screen.queryByText(/reset your password/i)).not.toBeInTheDocument();
  });

  it('calls resetPasswordForEmail when form is submitted', async () => {
    const user = userEvent.setup();
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValueOnce({ 
      data: {}, 
      error: null 
    });
    
    renderWithProviders(<PasswordResetDialog open={true} onOpenChange={mockOnOpenChange} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({
          redirectTo: expect.any(String),
        })
      );
    });
  });

  it('displays success message after successful password reset request', async () => {
    const user = userEvent.setup();
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValueOnce({
      data: {}, 
      error: null
    });
    
    renderWithProviders(<PasswordResetDialog open={true} onOpenChange={mockOnOpenChange} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/check your email for a reset link/i)).toBeInTheDocument();
    });
  });

  it('handles errors when the reset password request fails', async () => {
    const user = userEvent.setup();
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValueOnce({
      data: null,
      error: { message: 'Email not found' },
    });
    
    renderWithProviders(<PasswordResetDialog open={true} onOpenChange={mockOnOpenChange} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'nonexistent@example.com');
    
    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    await user.click(submitButton);
  });
});
