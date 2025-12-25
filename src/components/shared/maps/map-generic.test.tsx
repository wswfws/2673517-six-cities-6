import {cleanup, render} from '@testing-library/react';
import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import * as L from 'leaflet';
import {Icon, LatLngExpression, LayerGroup, Marker} from 'leaflet';
import useMap from '../../hooks/use-map/use-map.tsx';
import MapGeneric from './map-generic';

vi.mock('leaflet', () => {
  const markerLayerObj: Record<string, Mock> = {};
  markerLayerObj.addTo = vi.fn(() => markerLayerObj);
  const layerGroup = vi.fn(() => markerLayerObj);

  const MarkerMock = vi.fn((coords: LatLngExpression) => {
    const setIcon = vi.fn(function (this: { icon: Icon }, icon: Icon) {
      this.icon = icon;
      return this;
    });
    const addTo = vi.fn(function (this: { addedTo: LayerGroup }, layer: LayerGroup) {
      this.addedTo = layer;
      return this;
    });
    return {setIcon, addTo, coords};
  });

  const IconMock: Mock = vi.fn((args: object[]) => ({args}));

  return {layerGroup, Marker: MarkerMock, Icon: IconMock};
});

// Mock useMap hook
vi.mock('../../hooks/use-map/use-map.tsx', () => ({default: vi.fn()}));


describe('MapGeneric', () => {
  beforeEach(() => {
    // Clear call history but keep mock implementations returned by vi.mock above
    vi.clearAllMocks();
    cleanup();
  });

  it('renders section with provided className', () => {
    // useMap returns null — component still renders section
    (useMap as unknown as Mock)?.mockReturnValue(null);

    const city = {name: 'C', location: {latitude: 0, longitude: 0, zoom: 10}};
    const {container} = render(<MapGeneric city={city} points={[]} className="test-map"/>);

    const section = container.querySelector('section.test-map');
    expect(section).toBeTruthy();

    // layerGroup shouldn't be called when map is null
    expect(L.layerGroup).not.toHaveBeenCalled();
  });

  it('adds markers to map, uses activeIcon for activeId and removes layer on unmount', () => {
    // prepare fake map with removeLayer spy
    const fakeMap = {removeLayer: vi.fn()};
    (useMap as unknown as Mock).mockReturnValue(fakeMap);

    const city = {name: 'C', location: {latitude: 0, longitude: 0, zoom: 10}};
    const points = [
      {id: 'p1', latitude: 1, longitude: 2},
      {id: 'p2', latitude: 3, longitude: 4}
    ];

    const {unmount} = render(<MapGeneric city={city} points={points} activeId={'p2'} className="map-test"/>);

    const markerLayer = (L.layerGroup as unknown as Mock).mock.results[0].value as LayerGroup;
    expect(L.layerGroup).toHaveBeenCalled();
    expect(markerLayer.addTo).toHaveBeenCalledWith(fakeMap);

    // Two markers should be created
    expect(L.Marker).toHaveBeenCalledTimes(2);

    const marker1 = (L.Marker as unknown as Mock).mock.results[0].value as Marker;
    const marker2 = (L.Marker as unknown as Mock).mock.results[1].value as Marker;

    // marker1 corresponds to p1 (not active)
    expect(marker1.setIcon).toHaveBeenCalledTimes(1);
    expect(marker1.addTo).toHaveBeenCalledWith(markerLayer);

    // marker2 corresponds to p2 (active)
    expect(marker2.setIcon).toHaveBeenCalledTimes(1);
    expect(marker2.addTo).toHaveBeenCalledWith(markerLayer);

    // On unmount map.removeLayer should be called with the markerLayer
    unmount();
    expect(fakeMap.removeLayer).toHaveBeenCalledWith(markerLayer);
  });
});
