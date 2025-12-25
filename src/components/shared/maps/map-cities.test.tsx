import {describe, it, expect, vi} from 'vitest';
import {render} from '@testing-library/react';

vi.mock('./map-generic.tsx', () => ({
  default: vi.fn((props: MapGenericProps) => <div data-testid="map-generic-cities" {...props} />)
}));

import {MapCities} from './map-cities.tsx';
import {MapGenericProps} from './map-generic';

describe('MapCities', () => {
  it('forwards props to MapGeneric', () => {
    const city = { name: 'C', location: { latitude: 1, longitude: 2, zoom: 5 } };
    const points = [{ id: 'p1', latitude: 1, longitude: 2 }];

    const { getByTestId } = render(<MapCities city={city} points={points} selectedPoint={points[0]} />);

    const el = getByTestId('map-generic-cities');
    expect(el).toBeInTheDocument();
    expect(el.getAttribute('activeid')).toBe('p1');
  });
});
