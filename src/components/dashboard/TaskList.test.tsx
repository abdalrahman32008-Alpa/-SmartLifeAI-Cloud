import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from './TaskList';
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

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as any).mockResolvedValue({ data: { user: { id: '123' } } });
    // Mock the initial fetch for all tests
    (supabase.from('tasks').select().eq().order as any).mockResolvedValue({
      data: [],
      error: null,
    });
  });

  it('should render empty state', async () => {
    render(<TaskList />);
    expect(await screen.findByText('No tasks yet. Create one to get started!')).toBeInTheDocument();
  });

  it('should render tasks correctly', async () => {
    const mockTasks = [
      { id: '1', title: 'Test Task 1', completed: false, user_id: '123', created_at: new Date().toISOString() },
      { id: '2', title: 'Test Task 2', completed: true, user_id: '123', created_at: new Date().toISOString() },
    ];
    (supabase.from('tasks').select().eq().order as any).mockResolvedValueOnce({
      data: mockTasks,
      error: null,
    });
    render(<TaskList />);
    expect(await screen.findByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('should add a new task', async () => {
    (supabase.from('tasks').insert as any).mockResolvedValue({ error: null });
    // The mock for the refetch
    (supabase.from('tasks').select().eq().order as any)
      .mockResolvedValueOnce({ data: [], error: null }) // Initial
      .mockResolvedValueOnce({ data: [{ id: '3', title: 'New Task', completed: false, user_id: '123', created_at: new Date().toISOString() }], error: null }); // After insert

    render(<TaskList />);
    const addTaskButton = await screen.findByRole('button', { name: /add task/i });

    fireEvent.change(screen.getByPlaceholderText('Add a new task...'), {
      target: { value: 'New Task' },
    });

    fireEvent.click(addTaskButton);

    await waitFor(() => {
      expect(supabase.from('tasks').insert).toHaveBeenCalledWith([
        { title: 'New Task', user_id: '123', completed: false },
      ]);
    });

    // Check that the new task appears in the list
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('should show an error message if adding a task fails', async () => {
    (supabase.from('tasks').insert as any).mockResolvedValueOnce({
      error: { message: 'Failed to add task' },
    });

    render(<TaskList />);
    const addTaskButton = await screen.findByRole('button', { name: /add task/i });

    fireEvent.change(screen.getByPlaceholderText('Add a new task...'), {
      target: { value: 'New Task' },
    });

    fireEvent.click(addTaskButton);

    expect(await screen.findByText('Failed to add task')).toBeInTheDocument();
  });
});
