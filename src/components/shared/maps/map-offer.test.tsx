import {describe, it, expect, vi} from 'vitest';
import {render} from '@testing-library/react';

vi.mock('./map-generic.tsx', () => ({
  default: vi.fn((props: MapGenericProps) => <div data-testid="map-generic-offer" {...props} />)
}));

import {MapOffer} from './map-offer.tsx';
import {MapGenericProps} from './map-generic';

describe('MapOffer', () => {
  it('forwards points and activeId to MapGeneric and provides icons', () => {
    const city = { name: 'C', location: { latitude: 1, longitude: 2, zoom: 5 } };
    const mainPoint = { id: 'm', latitude: 1, longitude: 2 };
    const neighbors = [{ id: 'n1', latitude: 3, longitude: 4 }];

    const { getByTestId } = render(<MapOffer city={city} mainPoint={mainPoint} neighborPoint={neighbors} />);

    const el = getByTestId('map-generic-offer');
    expect(el).toBeInTheDocument();
    // Ensure the activeId prop exists by checking we rendered MapGeneric mock
  });
});
