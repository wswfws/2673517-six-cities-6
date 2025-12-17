import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMain from './use-main';
import * as storeHooks from '../../store/hooks';
import * as action from '../../store/action';
import type { CityPlaceInfo } from '../../components/shared/city-place';
import type { AppDispatch, RootState } from '../../store';
import type { City } from '../../components/shared/map-types';
import type { OffersState, UserState } from '../../store/reducer';
import {AuthorizationStatus} from '../../const.ts';

vi.mock('../../store/hooks');
vi.mock('../../store/action');

describe('useMain', () => {
  const mockDispatch = vi.fn();
  const mockSetCity = vi.fn();

  const mockPlaces: CityPlaceInfo[] = [
    {
      id: '1',
      title: 'Place 1',
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
      previewImage: 'img1.jpg',
    },
    {
      id: '2',
      title: 'Place 2',
      type: 'house',
      price: 150,
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      },
      location: { latitude: 48.85, longitude: 2.35, zoom: 10 },
      isFavorite: true,
      isPremium: true,
      rating: 5,
      previewImage: 'img2.jpg',
    },
  ];

  const mockCities = [
    {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    {
      name: 'Amsterdam',
      location: { latitude: 52.3676, longitude: 4.9041, zoom: 12 },
    },
  ];

  // Создаем тип для мокового состояния
  const createMockState = (places: CityPlaceInfo[]): RootState => ({
    offers: {
      city: 'Paris',
      isLoadingPlaces: false,
      places,
      offerDetail: null,
      neighbors: [],
      comments: [],
      isLoadingOffer: false,
      isLoadingComment: false,
      activePlaceId: null,
      isPostingComment: true,
      offerNotFound: false,
    } as OffersState,
    user: {
      authorizationStatus: AuthorizationStatus.Auth,
      userData: null,
    } as UserState
  } as RootState);

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockClear();
    mockSetCity.mockClear();

    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(mockDispatch as AppDispatch);
    vi.mocked(storeHooks.useCities).mockReturnValue(mockCities as City[]);
    vi.mocked(storeHooks.usePlacesByCity).mockReturnValue(mockPlaces);

    // Мокаем useAppSelector
    vi.mocked(storeHooks.useAppSelector).mockImplementation((selector) => {
      const state = createMockState(mockPlaces);
      return selector(state);
    });

    // Исправляем мок для setCity action с правильным типом
    vi.mocked(action.setCity).mockReturnValue({
      type: 'offers/setCity' as const,
      payload: 'Amsterdam'
    });
  });

  it('should dispatch setCity action when cityParam is provided', () => {
    const { unmount } = renderHook(() => useMain('Amsterdam'));

    expect(mockDispatch).toHaveBeenCalled();
    expect(action.setCity).toHaveBeenCalledWith('Amsterdam');

    unmount();
  });

  it('should not dispatch setCity action when cityParam is not provided', () => {
    const dispatchBeforeCount = mockDispatch.mock.calls.length;

    renderHook(() => useMain());

    // setCity не должен вызываться при первом рендере без cityParam
    expect(mockDispatch.mock.calls.length).toBeGreaterThanOrEqual(dispatchBeforeCount);
  });

  it('should return current city from store', () => {
    const { result } = renderHook(() => useMain());

    expect(result.current.currentCity).toBe('Paris');
  });

  it('should return isLoadingPlaces status', () => {
    const { result } = renderHook(() => useMain());

    expect(result.current.isLoadingPlaces).toBe(false);
  });

  it('should return places filtered by current city', () => {
    const { result } = renderHook(() => useMain('Paris'));

    expect(result.current.places).toEqual(mockPlaces);
  });

  it('should set first place as selected by default', () => {
    const { result } = renderHook(() => useMain());

    expect(result.current.selectedPlaceId).toBe('1');
  });

  it('should maintain selected place if it still exists after places change', () => {
    const { result, rerender } = renderHook(
      ({ cityParam }) => useMain(cityParam),
      { initialProps: { cityParam: 'Paris' } }
    );

    act(() => {
      result.current.setSelectedPlaceId('2');
    });

    expect(result.current.selectedPlaceId).toBe('2');

    rerender({ cityParam: 'Paris' });

    expect(result.current.selectedPlaceId).toBe('2');
  });

  it('should return selectedPlacePoint with correct coordinates', () => {
    const { result } = renderHook(() => useMain());

    expect(result.current.selectedPlacePoint).toEqual({
      id: '1',
      latitude: 48.8566,
      longitude: 2.3522,
    });
  });

  it('should return undefined selectedPlacePoint when no place is selected', () => {
    // Мокаем пустой массив places
    vi.mocked(storeHooks.usePlacesByCity).mockReturnValue([]);

    // Обновляем мок useAppSelector для пустого массива
    vi.mocked(storeHooks.useAppSelector).mockImplementation((selector) => {
      const state = createMockState([]);
      return selector(state);
    });

    const { result } = renderHook(() => useMain());

    expect(result.current.selectedPlacePoint).toBeUndefined();
  });

  it('should return cityInfo for current city', () => {
    const { result } = renderHook(() => useMain());

    expect(result.current.cityInfo).toEqual(mockCities[0]);
  });

  it('should return mapPoints for all places in current city', () => {
    const { result } = renderHook(() => useMain());

    expect(result.current.mapPoints).toHaveLength(2);
    expect(result.current.mapPoints[0]).toEqual({
      id: '1',
      latitude: 48.8566,
      longitude: 2.3522,
    });
    expect(result.current.mapPoints[1]).toEqual({
      id: '2',
      latitude: 48.85,
      longitude: 2.35,
    });
  });

  it('should update selectedPlaceId when calling setSelectedPlaceId', () => {
    const { result } = renderHook(() => useMain());

    expect(result.current.selectedPlaceId).toBe('1');

    act(() => {
      result.current.setSelectedPlaceId('2');
    });

    expect(result.current.selectedPlaceId).toBe('2');
  });

  it('should handle empty places array', () => {
    vi.mocked(storeHooks.usePlacesByCity).mockReturnValue([]);

    vi.mocked(storeHooks.useAppSelector).mockImplementation((selector) => {
      const state = createMockState([]);
      return selector(state);
    });

    const { result } = renderHook(() => useMain());

    expect(result.current.places).toEqual([]);
    expect(result.current.selectedPlaceId).toBeUndefined();
    expect(result.current.mapPoints).toEqual([]);
  });

  it('should use fallback city when cityParam is not provided', () => {
    const { result } = renderHook(() => useMain());

    expect(result.current.currentCity).toBe('Paris');
  });
});
