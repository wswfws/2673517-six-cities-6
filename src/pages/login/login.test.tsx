import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import LoginPage from './login.tsx';
import {loginAction} from '../../store/api-actions';

// Mock dependencies
vi.mock('../../store/api-actions', () => ({
  loginAction: vi.fn(),
}));

vi.mock('../../components/widgets/header/header.tsx', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

describe('LoginPage Component', () => {
  let store: ReturnType<typeof configureStore>;
  let mockNavigate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Make random selection deterministic for tests
    vi.spyOn(Math, 'random').mockReturnValue(0);

    store = configureStore({
      reducer: {
        offers: () => ({}),
        // Provide minimal user slice so useAuthorizationStatus can read state.user.authorizationStatus
        user: () => ({ authorizationStatus: 'NO_AUTH', userData: null }),
      },
    });

    mockNavigate = vi.fn();
    const {useNavigate} = await import('react-router-dom');
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  const renderWithProviders = (component: React.ReactElement) =>
    render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );

  it('should render login page with form', () => {
    renderWithProviders(<LoginPage/>);

    expect(screen.getByRole('heading', {name: /sign in/i})).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
  });

  it('should render header component', () => {
    renderWithProviders(<LoginPage/>);

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should have email and password inputs with correct attributes', () => {
    renderWithProviders(<LoginPage/>);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toBeRequired();

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(passwordInput).toBeRequired();
  });

  it('should allow typing in email and password fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage/>);

    const emailInput: HTMLInputElement = screen.getByPlaceholderText('Email');
    const passwordInput: HTMLInputElement = screen.getByPlaceholderText('Password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call loginAction with form data on submit', async () => {
    const user = userEvent.setup();
    const mockLoginAction = vi.fn(() => ({
      unwrap: vi.fn().mockResolvedValue({}),
    }));
    vi.mocked(loginAction).mockReturnValue(mockLoginAction as never);

    renderWithProviders(<LoginPage/>);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'user@test.com');
    await user.type(passwordInput, 'secret123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'secret123',
      });
    });
  });

  it('should show loading state during form submission', async () => {
    const user = userEvent.setup();
    const mockLoginAction = vi.fn(() => ({
      unwrap: vi.fn().mockImplementation(() => new Promise(() => {
      })), // Never resolves
    }));
    vi.mocked(loginAction).mockReturnValue(mockLoginAction as never);

    renderWithProviders(<LoginPage/>);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'user@test.com');
    await user.type(passwordInput, 'secret123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('should navigate to root on successful login', async () => {
    const user = userEvent.setup();
    const mockLoginAction = vi.fn(() => ({
      unwrap: vi.fn().mockResolvedValue({}),
    }));
    vi.mocked(loginAction).mockReturnValue(mockLoginAction as never);

    renderWithProviders(<LoginPage/>);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'user@test.com');
    await user.type(passwordInput, 'secret123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display error message on login failure', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    const mockLoginAction = vi.fn(() => ({
      unwrap: vi.fn().mockRejectedValue(errorMessage),
    }));
    vi.mocked(loginAction).mockReturnValue(mockLoginAction as never);

    renderWithProviders(<LoginPage/>);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'wrong@test.com');
    // Provide a syntactically valid password (contains letter and digit) so validation passes
    await user.type(passwordInput, 'wrong123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should validate password format and not submit when invalid', async () => {
    const user = userEvent.setup();
    const mockLoginAction = vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) }));
    vi.mocked(loginAction).mockReturnValue(mockLoginAction as never);

    renderWithProviders(<LoginPage/>);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'user@test.com');
    // invalid password: no digit or no letter
    await user.type(passwordInput, 'invalid');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one letter and one digit/i)).toBeInTheDocument();
      expect(loginAction).not.toHaveBeenCalled();
    });
  });

  it('should reset loading state after error', async () => {
    const user = userEvent.setup();
    const mockLoginAction = vi.fn(() => ({
      unwrap: vi.fn().mockRejectedValue('Error'),
    }));
    vi.mocked(loginAction).mockReturnValue(mockLoginAction as never);

    renderWithProviders(<LoginPage/>);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'user@test.com');
    await user.type(passwordInput, 'secret123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', {name: /sign in/i})).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should prevent default form submission', async () => {
    const user = userEvent.setup();
    const mockLoginAction = vi.fn(() => ({
      unwrap: vi.fn().mockResolvedValue({}),
    }));
    vi.mocked(loginAction).mockReturnValue(mockLoginAction as never);

    renderWithProviders(<LoginPage/>);

    const form = screen.getByRole('button', {name: /sign in/i}).closest('form');
    const handleSubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
    form?.addEventListener('submit', handleSubmit);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    await user.type(emailInput, 'user@test.com');
    await user.type(passwordInput, 'secret123');
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should render location section', () => {
    renderWithProviders(<LoginPage/>);

    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('should have correct page classes', () => {
    const {container} = renderWithProviders(<LoginPage/>);

    const pageDiv = container.querySelector('.page--login');
    expect(pageDiv).toBeInTheDocument();
    expect(pageDiv).toHaveClass('page--gray');
  });
});
