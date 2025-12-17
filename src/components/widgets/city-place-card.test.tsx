import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CityPlaceCard from './city-place-card.tsx';
import { CityPlaceInfo } from '../shared/city-place';

vi.mock('../hooks/use-handle-favorite-click.ts', () => ({
  default: vi.fn(() => vi.fn()),
}));

vi.mock('../app/use-app-routes.ts', () => ({
  default: vi.fn(() => ({
    getOfferPath: (id: string) => `/offer/${id}`,
  })),
}));

describe('CityPlaceCard Component', () => {
  const mockCityPlace: CityPlaceInfo = {
    id: '1',
    title: 'Beautiful apartment in city center',
    type: 'Apartment',
    price: 120,
    previewImage: '/img/apartment.jpg',
    isPremium: false,
    isFavorite: false,
    rating: 4.5,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37,
        longitude: 4.89,
        zoom: 10,
      },
    },
    location: {
      latitude: 52.38,
      longitude: 4.9,
      zoom: 16,
    },
  };

  const renderWithRouter = (component: React.ReactElement) =>
    render(<BrowserRouter>{component}</BrowserRouter>);

  it('should render place card with title', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('Beautiful apartment in city center')).toBeInTheDocument();
  });

  it('should render place card with price', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
  });

  it('should render place card with type', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('should render place card with image', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const image = screen.getByAltText('Place image') ;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('/img/apartment.jpg');
    expect(image).toHaveAttribute('width', '260');
    expect(image).toHaveAttribute('height', '200');
  });

  it('should render premium badge when place is premium', () => {
    const premiumPlace = { ...mockCityPlace, isPremium: true };
    renderWithRouter(<CityPlaceCard cityPlaceInfo={premiumPlace} />);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render premium badge when place is not premium', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render favorite button', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('place-card__bookmark-button');
  });

  it('should add active class to favorite button when place is favorite', () => {
    const favoritePlace = { ...mockCityPlace, isFavorite: true };
    renderWithRouter(<CityPlaceCard cityPlaceInfo={favoritePlace} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('place-card__bookmark-button--active');
  });

  it('should not add active class to favorite button when place is not favorite', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('place-card__bookmark-button--active');
  });

  it('should call favorite click handler when button is clicked', async () => {
    const user = userEvent.setup();
    const mockHandleFavoriteClick = vi.fn();

    const useHandleFavoriteClick = await import('../hooks/use-handle-favorite-click.ts');
    vi.mocked(useHandleFavoriteClick.default).mockReturnValue(mockHandleFavoriteClick);

    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockHandleFavoriteClick).toHaveBeenCalledOnce();
  });

  it('should render correct rating stars width', () => {
    const { container } = renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const ratingSpan = container.querySelector('.place-card__stars span') as HTMLElement;
    expect(ratingSpan).toHaveStyle({ width: '90%' }); // 4.5 * 20 = 90%
  });

  it('should render links to offer page', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2); // Image link and title link

    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/offer/1');
    });
  });

  it('should call onSelect when mouse enters card', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();

    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} onSelect={mockOnSelect} />);

    const article = screen.getByRole('article');
    await user.hover(article);

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('should not throw error when onSelect is not provided', async () => {
    const user = userEvent.setup();

    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const article = screen.getByRole('article');
    await user.hover(article);

    // Should not throw error
    expect(article).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const article = container.querySelector('article');
    expect(article).toHaveClass('cities__card');
    expect(article).toHaveClass('place-card');
  });

  it('should render rating section with correct classes', () => {
    const { container } = renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const rating = container.querySelector('.place-card__rating');
    expect(rating).toBeInTheDocument();
    expect(rating).toHaveClass('rating');
  });

  it('should handle zero rating', () => {
    const zeroRatingPlace = { ...mockCityPlace, rating: 0 };
    const { container } = renderWithRouter(<CityPlaceCard cityPlaceInfo={zeroRatingPlace} />);

    const ratingSpan = container.querySelector('.place-card__stars span') as HTMLElement;
    expect(ratingSpan).toHaveStyle({ width: '0%' });
  });

  it('should handle max rating', () => {
    const maxRatingPlace = { ...mockCityPlace, rating: 5 };
    const { container } = renderWithRouter(<CityPlaceCard cityPlaceInfo={maxRatingPlace} />);

    const ratingSpan = container.querySelector('.place-card__stars span') as HTMLElement;
    expect(ratingSpan).toHaveStyle({ width: '100%' });
  });

  it('should render bookmark icon', () => {
    const { container } = renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const icon = container.querySelector('.place-card__bookmark-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should have accessible button text', () => {
    renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('In bookmarks')).toBeInTheDocument();
  });

  it('should render price wrapper with correct structure', () => {
    const { container } = renderWithRouter(<CityPlaceCard cityPlaceInfo={mockCityPlace} />);

    const priceWrapper = container.querySelector('.place-card__price-wrapper');
    expect(priceWrapper).toBeInTheDocument();

    const price = container.querySelector('.place-card__price');
    expect(price).toBeInTheDocument();
  });

  it('should render different place types correctly', () => {
    const housePlace = { ...mockCityPlace, type: 'House' };
    const { rerender } = renderWithRouter(<CityPlaceCard cityPlaceInfo={housePlace} />);

    expect(screen.getByText('House')).toBeInTheDocument();

    const roomPlace = { ...mockCityPlace, type: 'Private Room' };
    rerender(
      <BrowserRouter>
        <CityPlaceCard cityPlaceInfo={roomPlace} />
      </BrowserRouter>
    );

    expect(screen.getByText('Private Room')).toBeInTheDocument();
  });

  it('should call onSelect with correct id on hover', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    const place = { ...mockCityPlace, id: 'test-id-123' };

    renderWithRouter(<CityPlaceCard cityPlaceInfo={place} onSelect={mockOnSelect} />);

    const article = screen.getByRole('article');
    await user.hover(article);

    expect(mockOnSelect).toHaveBeenCalledWith('test-id-123');
  });
});
