import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AiCoach from './AiCoach';
import { supabase } from '@/lib/supabaseClient';

describe('AiCoach', () => {
  it('should not display the user message if the API call fails', async () => {
    // Mock the supabase functions invoke method to simulate a failed API call
    vi.spyOn(supabase.functions, 'invoke').mockRejectedValueOnce(new Error('API Error'));

    render(<AiCoach />);

    const input = screen.getByPlaceholderText('Ask me anything...');
    const sendButton = screen.getByText('Send');

    // Type a message and click send
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Wait for the error message to be displayed
    await screen.findByText("Sorry, I couldn't reach the AI service.");

    // Check that the user's message is not displayed
    expect(screen.queryByText('Test message')).toBeNull();
  });
});
