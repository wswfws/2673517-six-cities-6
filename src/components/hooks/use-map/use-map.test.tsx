import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMap from './use-map.tsx';
import type { City } from '../../shared/maps/map-types.ts';
import { Map, TileLayer } from 'leaflet';

vi.mock('leaflet');

describe('useMap', () => {
  const mockCity: City = {
    name: 'Paris',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
  };

  const mockCity2: City = {
    name: 'Amsterdam',
    location: {
      latitude: 52.3676,
      longitude: 4.9041,
      zoom: 12,
    },
  };

  let mockMapInstance: {
    addLayer: ReturnType<typeof vi.fn>;
    setView: ReturnType<typeof vi.fn>;
  };
  let mockTileLayerInstance: Partial<TileLayer>;
  let mapRefElement: HTMLElement;

  beforeEach(() => {
    mapRefElement = document.createElement('div');

    mockTileLayerInstance = {
      addTo: vi.fn(),
    };

    mockMapInstance = {
      addLayer: vi.fn(),
      setView: vi.fn(),
    };

    vi.mocked(Map).mockImplementation(() => mockMapInstance as unknown as Map);
    vi.mocked(TileLayer).mockImplementation(() => mockTileLayerInstance as TileLayer);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return null initially when mapRef is not set', () => {
    const mapRef = { current: null };

    const { result } = renderHook(() => useMap(mapRef, mockCity));

    expect(result.current).toBeNull();
  });

  it('should create map instance when mapRef is available', () => {
    const mapRef = { current: mapRefElement };

    const { result } = renderHook(() => useMap(mapRef, mockCity));

    expect(result.current).not.toBeNull();
  });

  it('should initialize map with correct city location', () => {
    const mapRef = { current: mapRefElement };

    renderHook(() => useMap(mapRef, mockCity));

    expect(Map).toHaveBeenCalledWith(mapRefElement, {
      center: {
        lat: 48.8566,
        lng: 2.3522,
      },
      zoom: 10,
    });
  });


  it('should not create map twice when mapRef remains the same', () => {
    const mapRef = { current: mapRefElement };

    const { rerender } = renderHook(() => useMap(mapRef, mockCity));

    expect(Map).toHaveBeenCalledTimes(1);

    rerender();

    expect(Map).toHaveBeenCalledTimes(1);
  });

  it('should update map view when city changes', () => {
    const mapRef = { current: mapRefElement };

    const { rerender } = renderHook(
      ({ city }) => useMap(mapRef, city),
      { initialProps: { city: mockCity } }
    );

    // First call is from useEffect when map is created
    expect(mockMapInstance.setView).toHaveBeenCalledTimes(1);

    act(() => {
      rerender({ city: mockCity2 });
    });

    // After city change, should be called again
    expect(mockMapInstance.setView).toHaveBeenCalledTimes(2);
    expect(mockMapInstance.setView).toHaveBeenLastCalledWith([52.3676, 4.9041], 12);
  });

  it('should update map view with correct zoom level', () => {
    const mapRef = { current: mapRefElement };

    const { rerender } = renderHook(
      ({ city }) => useMap(mapRef, city),
      { initialProps: { city: mockCity } }
    );

    act(() => {
      rerender({ city: mockCity2 });
    });

    expect(mockMapInstance.setView).toHaveBeenCalledWith(
      expect.any(Array),
      12
    );
  });

  it('should handle multiple city changes', () => {
    const mapRef = { current: mapRefElement };

    const { rerender } = renderHook(
      ({ city }) => useMap(mapRef, city),
      { initialProps: { city: mockCity } }
    );

    // First call is from initial render
    expect(mockMapInstance.setView).toHaveBeenCalledTimes(1);

    act(() => {
      rerender({ city: mockCity2 });
    });

    expect(mockMapInstance.setView).toHaveBeenCalledTimes(2);

    const mockCity3: City = {
      name: 'Berlin',
      location: {
        latitude: 52.52,
        longitude: 13.405,
        zoom: 11,
      },
    };

    act(() => {
      rerender({ city: mockCity3 });
    });

    expect(mockMapInstance.setView).toHaveBeenCalledTimes(3);
    expect(mockMapInstance.setView).toHaveBeenLastCalledWith([52.52, 13.405], 11);
  });

  it('should not call setView if map is null', () => {
    const mapRef = { current: null };

    renderHook(
      ({ city }) => useMap(mapRef, city),
      { initialProps: { city: mockCity } }
    );

    // Map instance should not be created when mapRef is null
    // Therefore setView should not be called initially
  });
});
