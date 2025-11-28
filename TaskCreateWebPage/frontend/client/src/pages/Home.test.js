import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';
import { API } from '../constants';

global.fetch = jest.fn();

describe('Home Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders all form fields', () => {
    render(<Home />);
    
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task status')).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByText('create task')).toBeInTheDocument();
  });

  test('submit button is disabled when required fields are empty', () => {
    render(<Home />);
    
    const submitButton = screen.getByText('create task');
    expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when all required fields are filled', async () => {
    render(<Home />);
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await user.type(screen.getByPlaceholderText('Enter task status'), 'pending');
    
    const dateInput = screen.getByLabelText(/due date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    const submitButton = screen.getByText('create task');
    expect(submitButton).not.toBeDisabled();
  });

  test('successfully creates task with all fields and shows success modal', async () => {
    const mockResponse = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      dueDate: '2024-12-31'
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Home />);
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await user.type(screen.getByPlaceholderText('Enter task description'), 'Test Description');
    await user.type(screen.getByPlaceholderText('Enter task status'), 'pending');
    
    const dateInput = screen.getByLabelText(/due date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    const submitButton = screen.getByText('create task');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Created task!')).toBeInTheDocument();
      expect(screen.getByText(/title: Test Task/)).toBeInTheDocument();
      expect(screen.getByText(/description: Test Description/)).toBeInTheDocument();
    });
    
    expect(fetch).toHaveBeenCalledWith(
      `${API}/api/tasks/create/`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          dueDate: '2024-12-31'
        })
      })
    );
  });

  test('successfully creates task without description', async () => {
    const mockResponse = {
      id: 2,
      title: 'Test Task',
      description: '',
      status: 'pending',
      dueDate: '2024-12-31'
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Home />);
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await user.type(screen.getByPlaceholderText('Enter task status'), 'pending');
    
    const dateInput = screen.getByLabelText(/due date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    const submitButton = screen.getByText('create task');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Created task!')).toBeInTheDocument();
    });
    
    expect(fetch).toHaveBeenCalledWith(
      `${API}/api/tasks/create/`,
      expect.objectContaining({
        body: JSON.stringify({
          title: 'Test Task',
          description: '',
          status: 'pending',
          dueDate: '2024-12-31'
        })
      })
    );
  });

  test('shows error modal when API request fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Server error' }),
    });

    render(<Home />);
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await user.type(screen.getByPlaceholderText('Enter task status'), 'pending');
    
    const dateInput = screen.getByLabelText(/due date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    const submitButton = screen.getByText('create task');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Unable To create task')).toBeInTheDocument();
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  test('resets form fields after successful submission', async () => {
    const mockResponse = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      dueDate: '2024-12-31'
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Home />);
    const user = userEvent.setup();
    
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    const statusInput = screen.getByPlaceholderText('Enter task status');
    const dateInput = screen.getByLabelText(/due date/i);
    
    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.type(statusInput, 'pending');
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    const submitButton = screen.getByText('create task');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
      expect(statusInput.value).toBe('');
      expect(dateInput.value).toBe('');
    });
  });

  test('closes modal and clears modal data when close button is clicked', async () => {
    const mockResponse = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      dueDate: '2024-12-31'
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Home />);
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await user.type(screen.getByPlaceholderText('Enter task status'), 'pending');
    
    const dateInput = screen.getByLabelText(/due date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    await user.click(screen.getByText('create task'));
    
    await waitFor(() => {
      expect(screen.getByText('Created task!')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);
    
    expect(screen.queryByText('Created task!')).not.toBeInTheDocument();
  });

  test('shows loading state during submission', async () => {
    const mockResponse = {
      id: 1,
      title: 'Test Task',
      description: '',
      status: 'pending',
      dueDate: '2024-12-31'
    };
    
    fetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => mockResponse,
        }), 100)
      )
    );

    render(<Home />);
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await user.type(screen.getByPlaceholderText('Enter task status'), 'pending');
    
    const dateInput = screen.getByLabelText(/due date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    const submitButton = screen.getByText('create task');
    await user.click(submitButton);
    
    expect(screen.getByText('loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('create task')).toBeInTheDocument();
    });
  });
});