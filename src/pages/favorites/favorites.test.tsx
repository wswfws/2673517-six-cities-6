import {render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import FavoritesPage from './favorites';
import {api} from '../../store';
import {vi} from 'vitest';

vi.mock('../../components/widgets/header/header.tsx', () => ({
  default: () => <header data-testid="header">Header</header>
}));
vi.mock('../../components/widgets/footer/footer.tsx', () => ({
  default: () => <footer data-testid="footer">Footer</footer>
}));
vi.mock('../../components/widgets/city-place-card-favorites/city-place-card-favorites.tsx', () => ({
  default: () => <div data-testid="card">Card</div>
}));

describe('FavoritesPage', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        offers: () => ({places: [{city: {name: 'Paris'}}]}),
        user: () => ({authorizationStatus: 'AUTH', userData: {}}),
      },
    });
  });

  it('renders empty favorites page when API returns empty list', async () => {
    const mockGet = vi.spyOn(api, 'get').mockResolvedValue({data: []});

    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage/>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/nothing yet saved/i)).toBeInTheDocument();
    });

    mockGet.mockRestore();
  });

  it('renders favorites grouped by city when API returns items and updates on favoritesChanged event', async () => {
    const mockPlace = {
      id: '1',
      title: 'Place 1',
      type: 'apartment',
      price: 100,
      city: {name: 'Paris'},
      location: {latitude: 0, longitude: 0, zoom: 10},
      isFavorite: true,
      isPremium: false,
      rating: 4,
      previewImage: 'img.jpg',
    };

    const mockGet = vi.spyOn(api, 'get').mockResolvedValue({data: [mockPlace]});

    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage/>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/saved listing/i)).toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    // dispatch event to remove favorite
    const detail = {...mockPlace, isFavorite: false};
    window.dispatchEvent(new CustomEvent('favoritesChanged', {detail}));

    await waitFor(() => {
      // after removal card should disappear
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    mockGet.mockRestore();
  });
});

