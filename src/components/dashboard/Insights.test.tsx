import { render, screen, waitFor } from '@testing-library/react';
import Insights from './Insights';
import { supabase } from '@/lib/supabaseClient';

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  },
}));

describe('Insights', () => {
  it('should render loading state initially', () => {
    render(<Insights />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error state', async () => {
    (supabase.from('mood_logs').select().order().limit as any).mockResolvedValueOnce({
      error: { message: 'Failed to fetch' },
      data: null,
    });
    render(<Insights />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('should render empty state', async () => {
    (supabase.from('mood_logs').select().order().limit as any).mockResolvedValueOnce({
      error: null,
      data: [],
    });
    render(<Insights />);
    await waitFor(() => {
      expect(screen.getByText('No recent moods yet.')).toBeInTheDocument();
    });
  });

  it('should render insights correctly', async () => {
    const mockData = [
      { mood_score: 5, created_at: '2023-01-01', tasks: [] },
      { mood_score: 4, created_at: '2023-01-02', tasks: [{ title: 'Test Task' }] },
    ];
    (supabase.from('mood_logs').select().order().limit as any).mockResolvedValueOnce({
      error: null,
      data: mockData,
    });
    render(<Insights />);
    await waitFor(() => {
      expect(screen.getByText(/You felt '5' \(Great\)/)).toBeInTheDocument();
      expect(screen.getByText(/You felt '4' \(Good\) after completing 'Test Task'/)).toBeInTheDocument();
    });
  });
});
