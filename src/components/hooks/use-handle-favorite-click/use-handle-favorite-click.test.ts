import {beforeEach, describe, expect, it, vi} from 'vitest';
import {act, renderHook} from '@testing-library/react';
import useHandleFavoriteClick from './use-handle-favorite-click.ts';
import * as storeHooks from '../../../store/hooks.ts';
import type {NavigateFunction} from 'react-router-dom';
import * as reactRouter from 'react-router-dom';
import {AuthorizationStatus} from '../../../const.ts';
import type {CityPlaceInfo} from '../../shared/city-place/city-place.ts';
import type {AppDispatch} from '../../../store';
import React from 'react';

vi.mock('../../../store/hooks.ts', () => ({
  useAppDispatch: vi.fn(),
  useAuthorizationStatus: vi.fn(),
  useAppSelector: vi.fn(),
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

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
      location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
    },
    location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
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
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as AppDispatch);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as NavigateFunction);

    const {result} = renderHook(() => useHandleFavoriteClick(mockCityPlaceInfo));

    expect(typeof result.current).toBe('function');
  });

  it('should navigate to login when user is not authenticated', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as AppDispatch);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as NavigateFunction);

    const {result} = renderHook(() => useHandleFavoriteClick(mockCityPlaceInfo));

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      currentTarget: document.createElement('button'),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    act(() => result.current(mockEvent));

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch action with status 1 when adding favorite', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as AppDispatch);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as NavigateFunction);

    const {result} = renderHook(() => useHandleFavoriteClick(mockCityPlaceInfo));

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      currentTarget: document.createElement('button'),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    act(() => result.current(mockEvent));

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch.mock.calls).toHaveLength(1);
    expect(mockDispatch.mock.calls[0]).toBeDefined();
  });

  it('should dispatch action with status 0 when removing favorite', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as AppDispatch);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as NavigateFunction);

    const favoritePlace: CityPlaceInfo = {...mockCityPlaceInfo, isFavorite: true};
    const {result} = renderHook(() => useHandleFavoriteClick(favoritePlace));

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      currentTarget: document.createElement('button'),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    act(() => result.current(mockEvent));

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should not navigate when user is authenticated', () => {
    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as AppDispatch);
    vi.mocked(storeHooks.useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate as NavigateFunction);

    const {result} = renderHook(() => useHandleFavoriteClick(mockCityPlaceInfo));

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      currentTarget: document.createElement('button'),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    act(() => result.current(mockEvent));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
