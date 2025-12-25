import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../city-place-card/city-place-card.tsx', () => ({
  default: ({cityPlaceInfo, onSelect}: CityPlaceCardProps) => (
    <div data-testid={`card-${cityPlaceInfo.id}`} onMouseEnter={() => onSelect && onSelect(cityPlaceInfo.id)}>{cityPlaceInfo.title}</div>
  ),
}));

import CityPlacesList from './city-places-list.tsx';
import type {CityPlaceInfo} from '../../shared/city-place/city-place.ts';
import {CityPlaceCardProps} from '../city-place-card/city-place-card';

describe('CityPlacesList', () => {
  const places: CityPlaceInfo[] = [
    { id: '1', title: 'One', type: 'apartment', price: 100, previewImage: '', isPremium: false, isFavorite: false, rating: 4, city: {name: 'A', location: {latitude:0, longitude:0, zoom: 10}}, location: {latitude: 0, longitude:0, zoom: 16} },
    { id: '2', title: 'Two', type: 'room', price: 200, previewImage: '', isPremium: false, isFavorite: false, rating: 3, city: {name: 'B', location: {latitude:0, longitude:0, zoom: 10}}, location: {latitude: 0, longitude:0, zoom: 16} },
  ];

  it('renders a card for each place and forwards onSelect', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();

    render(<CityPlacesList sortedPlaces={places} onSelectPlaceId={mockOnSelect}/>);

    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();

    await user.hover(screen.getByTestId('card-1'));

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });
});
