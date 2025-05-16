import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AiPredictor } from '@/components/ai/AiPredictor';
import { renderWithProviders } from '@/test/utils';

// Mock setTimeout to avoid waiting in tests
vi.useFakeTimers();

describe('AiPredictor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the AI predictor form correctly', () => {
    renderWithProviders(<AiPredictor />);
    
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/input text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get prediction/i })).toBeInTheDocument();
  });

  it('disables the submit button when no text is entered', () => {
    renderWithProviders(<AiPredictor />);
    
    const submitButton = screen.getByRole('button', { name: /get prediction/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables the submit button when text is entered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiPredictor />);
    
    const textInput = screen.getByLabelText(/input text/i);
    await user.type(textInput, 'Test query');
    
    const submitButton = screen.getByRole('button', { name: /get prediction/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('shows loading state when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiPredictor />);
    
    const textInput = screen.getByLabelText(/input text/i);
    await user.type(textInput, 'Test query');
    
    const submitButton = screen.getByRole('button', { name: /get prediction/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
  });

  it('shows prediction result after loading', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiPredictor />);
    
    const textInput = screen.getByLabelText(/input text/i);
    await user.type(textInput, 'Test query');
    
    const submitButton = screen.getByRole('button', { name: /get prediction/i });
    await user.click(submitButton);
    
    // Fast-forward timers to complete the "API call"
    vi.advanceTimersByTime(1500);
    
    await waitFor(() => {
      expect(screen.getByText(/prediction:/i)).toBeInTheDocument();
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    });
  });

  it('changes prediction based on selected category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AiPredictor />);
    
    // Select security category
    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'security');
    
    // Enter password-related query
    const textInput = screen.getByLabelText(/input text/i);
    await user.type(textInput, 'My password is 12345');
    
    const submitButton = screen.getByRole('button', { name: /get prediction/i });
    await user.click(submitButton);
    
    // Fast-forward timers to complete the "API call"
    vi.advanceTimersByTime(1500);
    
    await waitFor(() => {
      expect(screen.getByText(/security risk/i)).toBeInTheDocument();
    });
  });
});
