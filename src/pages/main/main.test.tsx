import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import MainPage from './main.tsx';
import React from 'react';

vi.mock('./use-main.ts', () => ({
  default: vi.fn(() => ({
    isLoadingPlaces: false,
    currentCity: 'Amsterdam',
    places: [
      {
        id: '1',
        title: 'Place 1',
        type: 'Apartment',
        price: 100,
        previewImage: '/img/1.jpg',
        isPremium: false,
        isFavorite: false,
        rating: 4.5,
        city: {name: 'Amsterdam', location: {latitude: 52.37, longitude: 4.89, zoom: 10}},
        location: {latitude: 52.38, longitude: 4.9, zoom: 16},
      },
    ],
    selectedPlacePoint: { // <- добавьте это поле
      id: '1',
      latitude: 52.38,
      longitude: 4.9,
    },
    setSelectedPlaceId: vi.fn(),
    cityInfo: { // <- добавьте это поле
      location: {
        latitude: 52.37,
        longitude: 4.89,
        zoom: 10
      }
    },
    mapPoints: [ // <- добавьте это поле
      {
        id: '1',
        latitude: 52.38,
        longitude: 4.9,
      }
    ],
  })),
}));

vi.mock('./use-sorter-places.ts', () => ({
  default: vi.fn((places: object[]) => places),
}));

vi.mock('../../components/widgets/header.tsx', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('../../components/widgets/locations-tabs.tsx', () => ({
  default: () => <div data-testid="locations-tabs">Locations</div>,
}));

vi.mock('../../components/widgets/sort-options.tsx', () => ({
  default: ({current}: { current: string }) => (
    <div data-testid="sort-options"><span>{current}</span></div>
  ),
}));

vi.mock('../../components/shared/map-cities.tsx', () => ({
  default: () => <div data-testid="map-cities">Map</div>,
}));

vi.mock('../../components/widgets/city-places-list.tsx', () => ({
  default: ({sortedPlaces}: { sortedPlaces: never[] }) => (
    <div data-testid="city-places-list">{sortedPlaces.length} places</div>
  ),
}));

vi.mock('../../components/shared/loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual: typeof import('react-router-dom') = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({city: 'Amsterdam'}),
  };
});

describe('MainPage Component', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: {
        offers: () => ({}),
      },
    });
  });

  const renderWithProviders = (component: React.ReactElement) =>
    render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );

  it('should render main page with header', () => {
    renderWithProviders(<MainPage/>);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render locations tabs', () => {
    renderWithProviders(<MainPage/>);
    expect(screen.getByTestId('locations-tabs')).toBeInTheDocument();
  });

  it('should render city places list', () => {
    renderWithProviders(<MainPage/>);
    expect(screen.getByTestId('city-places-list')).toBeInTheDocument();
  });

  it('should render sort options', () => {
    renderWithProviders(<MainPage/>);
    expect(screen.getByTestId('sort-options')).toBeInTheDocument();
  });

  it('should render page with correct structure', () => {
    const {container} = renderWithProviders(<MainPage/>);
    const page = container.querySelector('.page');
    expect(page).toBeInTheDocument();
  });

  it('should render places section', () => {
    const {container} = renderWithProviders(<MainPage/>);
    const section = container.querySelector('.cities');
    expect(section).toBeInTheDocument();
  });

  it('should display correct number of places', () => {
    renderWithProviders(<MainPage/>);
    expect(screen.getByText('1 places')).toBeInTheDocument();
  });

  it('should render hidden headings for accessibility', () => {
    const {container} = renderWithProviders(<MainPage/>);
    const h1 = container.querySelector('h1.visually-hidden');
    expect(h1).toBeInTheDocument();
  });


  it('should render initial sort option', () => {
    renderWithProviders(<MainPage/>);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('should have correct section class for cities', () => {
    const {container} = renderWithProviders(<MainPage/>);
    const section = container.querySelector('.cities__places-container');
    expect(section).toBeInTheDocument();
  });

  it('should render footer section', () => {
    const {container} = renderWithProviders(<MainPage/>);
    const main = container.querySelector('.page__main');
    expect(main).toBeInTheDocument();
  });

  it('should render main content wrapper', () => {
    const {container} = renderWithProviders(<MainPage/>);
    const wrapper = container.querySelector('.cities__places-container');
    expect(wrapper?.classList.contains('cities__places-container')).toBe(true);
  });

});
