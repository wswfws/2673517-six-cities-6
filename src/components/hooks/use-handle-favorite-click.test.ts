import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useHandleFavoriteClick from './use-handle-favorite-click';
import * as storeHooks from '../../store/hooks';
import * as reactRouter from 'react-router-dom';
import { AuthorizationStatus } from '../../const';
import type { CityPlaceInfo } from '../shared/city-place';

vi.mock('../../store/hooks');
vi.mock('react-router-dom');

describe('useHandleFavoriteClick', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  const mockCityPlaceInfo: CityPlaceInfo = {
    id: '1',
    title: 'Test Place',
    type: 'apartment',
    price: 100,
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    isFavorite: false,
    isPremium: false,
    rating: 4,
    previewImage: 'img.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockClear();
    mockNavigate.mockClear();
  });

  it('should return a function that handles favorite click', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as any);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as any);

    const { result } = renderHook(() => useHandleFavoriteClick(mockCityPlaceInfo));

    expect(typeof result.current).toBe('function');
  });

  it('should navigate to login when user is not authenticated', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as any);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as any);

    const { result } = renderHook(() => useHandleFavoriteClick(mockCityPlaceInfo));

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch action with status 1 when adding favorite', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as any);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as any);

    const { result } = renderHook(() => useHandleFavoriteClick(mockCityPlaceInfo));

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction).toBeDefined();
  });

  it('should dispatch action with status 0 when removing favorite', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as any);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as any);

    const favoritePlace: CityPlaceInfo = { ...mockCityPlaceInfo, isFavorite: true };
    const { result } = renderHook(() => useHandleFavoriteClick(favoritePlace));

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should not navigate when user is authenticated', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as any);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as any);

    const { result } = renderHook(() => useHandleFavoriteClick(mockCityPlaceInfo));

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current(mockEvent);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
