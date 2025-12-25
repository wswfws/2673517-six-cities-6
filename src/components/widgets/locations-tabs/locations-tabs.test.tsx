import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';

vi.mock('../../app/use-app-routes.ts', () => ({
  default: vi.fn(() => ({
    getCityPath: (city: string = 'Paris') => `/city/${city}`,
  })),
}));

vi.mock('../cities-list/cities-list.tsx', () => ({
  default: ({cities, getCityPath}: CitiesListProps) => (
    <div data-testid="cities-list">Cities: {cities.length} - Path: {getCityPath(cities[0])}</div>
  ),
}));

import LocationsTabs from './locations-tabs.tsx';
import {CitiesListProps} from '../cities-list/cities-list';

describe('LocationsTabs', () => {
  it('renders CitiesList with STATIC_CITIES and provided getCityPath', () => {
    render(<LocationsTabs/>);
    expect(screen.getByTestId('cities-list')).toHaveTextContent('Cities: 6');
    expect(screen.getByTestId('cities-list')).toHaveTextContent('Path: /city/Paris');
  });
});
