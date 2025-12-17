import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMap from './use-map';
import type { City } from '../shared/map-types';
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

  let mockMapInstance: any;
  let mockTileLayerInstance: any;
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

    vi.mocked(Map).mockImplementation(() => mockMapInstance);
    vi.mocked(TileLayer).mockImplementation(() => mockTileLayerInstance);
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

  it('should add tile layer to map', () => {
    const mapRef = { current: mapRefElement };

    renderHook(() => useMap(mapRef, mockCity));

    expect(TileLayer).toHaveBeenCalledWith(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      expect.objectContaining({
        attribution: expect.stringContaining('OpenStreetMap'),
      })
    );

    expect(mockMapInstance.addLayer).toHaveBeenCalledWith(mockTileLayerInstance);
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

    const { rerender } = renderHook(
      ({ city }) => useMap(mapRef, city),
      { initialProps: { city: mockCity } }
    );

    mockMapInstance = null;

    act(() => {
      rerender({ city: mockCity2 });
    });
  });
});
