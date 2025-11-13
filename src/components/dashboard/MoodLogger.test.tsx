import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MoodLogger from './MoodLogger';
import { supabase } from '@/lib/supabaseClient';

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
  },
}));

describe('MoodLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as any).mockResolvedValue({ data: { user: { id: '123' } } });
    (supabase.from('tasks').select().eq().eq().order as any).mockResolvedValue({
      data: [{ id: '1', title: 'Test Task' }],
      error: null,
    });
  });

  it('should render mood options and task dropdown', async () => {
    render(<MoodLogger />);
    expect(await screen.findByText('Great')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should handle mood selection and log mood', async () => {
    render(<MoodLogger />);
    const greatButton = await screen.findByText('Great');
    fireEvent.click(greatButton);
    await waitFor(() => {
      expect(supabase.from('mood_logs').insert).toHaveBeenCalledWith([
        expect.objectContaining({ mood_score: 5, user_id: '123' }),
      ]);
    });
    expect(await screen.findByText('✅ Mood logged successfully!')).toBeInTheDocument();
  });

  it('should handle mood selection with a task and log mood', async () => {
    render(<MoodLogger />);
    const taskSelect = await screen.findByLabelText('Link to a recently completed task? (Optional)');
    fireEvent.change(taskSelect, { target: { value: '1' } });

    const greatButton = await screen.findByText('Great');
    fireEvent.click(greatButton);

    await waitFor(() => {
      expect(supabase.from('mood_logs').insert).toHaveBeenCalledWith([
        expect.objectContaining({ mood_score: 5, user_id: '123', related_task_id: '1' }),
      ]);
    });
    expect(await screen.findByText('✅ Mood logged successfully!')).toBeInTheDocument();
  });

  it('should show an error message if mood logging fails', async () => {
    (supabase.from('mood_logs').insert as any).mockResolvedValueOnce({
      error: { message: 'Failed to log mood' },
    });
    render(<MoodLogger />);
    const greatButton = await screen.findByText('Great');
    fireEvent.click(greatButton);
    expect(await screen.findByText('Failed to log mood')).toBeInTheDocument();
  });
});
