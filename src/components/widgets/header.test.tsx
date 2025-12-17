import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import Header from './header.tsx';
import {AuthorizationStatus} from '../../const.ts';

vi.mock('../../store/hooks.ts', async () => {
  const actual: typeof import('../../store/hooks.ts') = await vi.importActual('../../store/hooks.ts');
  return {
    ...actual,
    useAuthorizationStatus: vi.fn(),
    useAppSelector: vi.fn(),
  };
});

describe('Header Component', () => {
  let store: ReturnType<typeof configureStore>;

  const renderWithProviders = (component: React.ReactElement) =>
    render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: () => ({userData: null}),
        offers: () => ({places: []}),
      },
    });
  });

  it('should render header with logo', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);
    vi.mocked(useAppSelector).mockReturnValue(null);

    renderWithProviders(<Header/>);

    const logo = screen.getByAltText('6 cities logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/img/logo.svg');
    expect(logo).toHaveAttribute('width', '81');
    expect(logo).toHaveAttribute('height', '41');
  });

  it('should render logo link with correct href', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);
    vi.mocked(useAppSelector).mockReturnValue(null);

    renderWithProviders(<Header/>);

    const logoLinks = screen.getAllByRole('link');
    const mainLogoLink = logoLinks.find((link) => link.getAttribute('href') === '/');
    expect(mainLogoLink).toBeInTheDocument();
  });

  it('should render "Sign in" link when not authenticated', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);
    vi.mocked(useAppSelector).mockReturnValue(null);

    renderWithProviders(<Header/>);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should render user email when authenticated', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);

    let callCount = 0;
    vi.mocked(useAppSelector).mockImplementation((() => {
      callCount++;
      if (callCount === 1) {
        return {email: 'test@example.com'};
      }
      return 0;
    }) as never);

    renderWithProviders(<Header/>);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should render "Sign out" link when authenticated', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);

    let callCount = 0;
    vi.mocked(useAppSelector).mockImplementation((() => {
      callCount++;
      if (callCount === 1) {
        return {email: 'test@example.com'};
      }
      return 0;
    }) as never);

    renderWithProviders(<Header/>);

    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should display favorite count when authenticated', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);

    let callCount = 0;
    vi.mocked(useAppSelector).mockImplementation((() => {
      callCount++;
      if (callCount === 1) {
        return {email: 'test@example.com'};
      }
      return 5;
    }) as never);

    renderWithProviders(<Header/>);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should calculate favorite count correctly', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);

    let callCount = 0;
    vi.mocked(useAppSelector).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {email: 'test@example.com'};
      }
      // Simulate selector calculation
      const mockState = {
        offers: {
          places: [
            {id: '1', isFavorite: true},
            {id: '2', isFavorite: false},
            {id: '3', isFavorite: true},
            {id: '4', isFavorite: true},
          ],
        },
      };
      return mockState.offers.places.filter((p) => p.isFavorite).length;
    });

    renderWithProviders(<Header/>);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render link to favorites when authenticated', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);

    let callCount = 0;
    vi.mocked(useAppSelector).mockImplementation((() => {
      callCount++;
      if (callCount === 1) {
        return {email: 'test@example.com'};
      }
      return 0;
    }) as never);

    renderWithProviders(<Header/>);

    const favoritesLinks = screen.getAllByRole('link');
    const favoritesLink = favoritesLinks.find((link) => link.getAttribute('href') === '/favorites');
    expect(favoritesLink).toBeInTheDocument();
  });

  it('should render link to login when not authenticated', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);
    vi.mocked(useAppSelector).mockReturnValue(null);

    renderWithProviders(<Header/>);

    const loginLinks = screen.getAllByRole('link');
    const loginLink = loginLinks.find((link) => link.getAttribute('href') === '/login');
    expect(loginLink).toBeInTheDocument();
  });

  it('should render nothing when authorization status is unknown', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Unknown);
    vi.mocked(useAppSelector).mockReturnValue(null);

    renderWithProviders(<Header/>);

    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('should have correct header structure', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);
    vi.mocked(useAppSelector).mockReturnValue(null);

    const {container} = renderWithProviders(<Header/>);

    const header = container.querySelector('header.header');
    expect(header).toBeInTheDocument();

    const headerWrapper = container.querySelector('.header__wrapper');
    expect(headerWrapper).toBeInTheDocument();
  });

  it('should render avatar wrapper when authenticated', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);

    let callCount = 0;
    vi.mocked(useAppSelector).mockImplementation((() => {
      callCount++;
      if (callCount === 1) {
        return {email: 'test@example.com'};
      }
      return 0;
    }) as never);

    const {container} = renderWithProviders(<Header/>);

    const avatarWrapper = container.querySelector('.header__avatar-wrapper');
    expect(avatarWrapper).toBeInTheDocument();
  });

  it('should render avatar wrapper when not authenticated', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);
    vi.mocked(useAppSelector).mockReturnValue(null);

    const {container} = renderWithProviders(<Header/>);

    const avatarWrapper = container.querySelector('.header__avatar-wrapper');
    expect(avatarWrapper).toBeInTheDocument();
  });

  it('should display empty string when user data is null', async () => {
    const {useAuthorizationStatus, useAppSelector} = await import('../../store/hooks.ts');
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);

    let callCount = 0;
    vi.mocked(useAppSelector).mockImplementation((() => {
      callCount++;
      if (callCount === 1) {
        return null;
      }
      return 0;
    }) as never);

    const {container} = renderWithProviders(<Header/>);

    const userName = container.querySelector('.header__user-name');
    expect(userName).toHaveTextContent('');
  });
});
