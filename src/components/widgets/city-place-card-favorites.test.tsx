import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CityPlaceCardFavorites from './city-place-card-favorites.tsx';
import { CityPlaceInfo } from '../shared/city-place';

vi.mock('../hooks/use-handle-favorite-click.ts', () => ({
  default: vi.fn(() => vi.fn()),
}));

vi.mock('../app/use-app-routes.ts', () => ({
  default: vi.fn(() => ({
    getOfferPath: (id: string) => `/offer/${id}`,
  })),
}));

describe('CityPlaceCardFavorites Component', () => {
  const mockCityPlace: CityPlaceInfo = {
    id: '2',
    title: 'Cozy studio in downtown',
    type: 'Studio',
    price: 85,
    previewImage: '/img/studio.jpg',
    isPremium: true,
    isFavorite: true,
    rating: 4.8,
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85,
        longitude: 2.35,
        zoom: 10,
      },
    },
    location: {
      latitude: 48.86,
      longitude: 2.36,
      zoom: 16,
    },
  };

  const renderWithRouter = (component: React.ReactElement) =>
    render(<BrowserRouter>{component}</BrowserRouter>);

  it('should render favorites card with title', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('Cozy studio in downtown')).toBeInTheDocument();
  });

  it('should render favorites card with price', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('€85')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
  });

  it('should render favorites card with type', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('Studio')).toBeInTheDocument();
  });

  it('should render favorites card with image', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const image = screen.getByAltText('Place image') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('/img/studio.jpg');
    expect(image).toHaveAttribute('width', '260');
    expect(image).toHaveAttribute('height', '200');
  });

  it('should render premium badge when place is premium', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render premium badge when place is not premium', () => {
    const nonPremiumPlace = { ...mockCityPlace, isPremium: false };
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={nonPremiumPlace} />);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render favorite button', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('place-card__bookmark-button');
  });

  it('should add active class to favorite button when place is favorite', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('place-card__bookmark-button--active');
  });

  it('should not add active class to favorite button when place is not favorite', () => {
    const nonFavoritePlace = { ...mockCityPlace, isFavorite: false };
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={nonFavoritePlace} />);

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('place-card__bookmark-button--active');
  });

  it('should call favorite click handler when button is clicked', async () => {
    const user = userEvent.setup();
    const mockHandleFavoriteClick = vi.fn();

    const useHandleFavoriteClick = await import('../hooks/use-handle-favorite-click.ts');
    vi.mocked(useHandleFavoriteClick.default).mockReturnValue(mockHandleFavoriteClick);

    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockHandleFavoriteClick).toHaveBeenCalledOnce();
  });

  it('should render correct rating stars width', () => {
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const ratingSpan = container.querySelector('.place-card__stars span') as HTMLElement;
    expect(ratingSpan).toHaveStyle({ width: '96%' }); // 4.8 * 20 = 96%
  });

  it('should render links to offer page', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2); // Image link and title link

    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/offer/2');
    });
  });

  it('should have correct CSS classes for favorites', () => {
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const article = container.querySelector('article');
    expect(article).toHaveClass('favorites__card');
    expect(article).toHaveClass('place-card');
  });

  it('should have favorites-specific image wrapper class', () => {
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const imageWrapper = container.querySelector('.favorites__image-wrapper');
    expect(imageWrapper).toBeInTheDocument();
    expect(imageWrapper).toHaveClass('place-card__image-wrapper');
  });

  it('should have favorites-specific card info class', () => {
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const cardInfo = container.querySelector('.favorites__card-info');
    expect(cardInfo).toBeInTheDocument();
    expect(cardInfo).toHaveClass('place-card__info');
  });

  it('should render rating section with correct classes', () => {
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const rating = container.querySelector('.place-card__rating');
    expect(rating).toBeInTheDocument();
    expect(rating).toHaveClass('rating');
  });

  it('should handle zero rating', () => {
    const zeroRatingPlace = { ...mockCityPlace, rating: 0 };
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={zeroRatingPlace} />);

    const ratingSpan = container.querySelector('.place-card__stars span') as HTMLElement;
    expect(ratingSpan).toHaveStyle({ width: '0%' });
  });

  it('should handle max rating', () => {
    const maxRatingPlace = { ...mockCityPlace, rating: 5 };
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={maxRatingPlace} />);

    const ratingSpan = container.querySelector('.place-card__stars span') as HTMLElement;
    expect(ratingSpan).toHaveStyle({ width: '100%' });
  });

  it('should render bookmark icon', () => {
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const icon = container.querySelector('.place-card__bookmark-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should have accessible button text', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    expect(screen.getByText('In bookmarks')).toBeInTheDocument();
  });

  it('should render price wrapper with correct structure', () => {
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const priceWrapper = container.querySelector('.place-card__price-wrapper');
    expect(priceWrapper).toBeInTheDocument();

    const price = container.querySelector('.place-card__price');
    expect(price).toBeInTheDocument();
  });

  it('should render different place types correctly', () => {
    const hotelPlace = { ...mockCityPlace, type: 'Hotel' };
    const { rerender } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={hotelPlace} />);

    expect(screen.getByText('Hotel')).toBeInTheDocument();

    const apartmentPlace = { ...mockCityPlace, type: 'Apartment' };
    rerender(
      <BrowserRouter>
        <CityPlaceCardFavorites cityPlaceInfo={apartmentPlace} />
      </BrowserRouter>
    );

    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('should use correct offer path from hook', () => {
    const place = { ...mockCityPlace, id: 'unique-id-456' };
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={place} />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/offer/unique-id-456');
    });
  });

  it('should render all essential card sections', () => {
    const { container } = renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    expect(container.querySelector('.place-card__image')).toBeInTheDocument();
    expect(container.querySelector('.place-card__price-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.place-card__rating')).toBeInTheDocument();
    expect(container.querySelector('.place-card__name')).toBeInTheDocument();
    expect(container.querySelector('.place-card__type')).toBeInTheDocument();
  });

  it('should render button with correct type attribute', () => {
    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should pass correct cityPlaceInfo to hook', async () => {
    const useHandleFavoriteClick = await import('../hooks/use-handle-favorite-click.ts');
    const mockHandler = vi.fn();
    vi.mocked(useHandleFavoriteClick.default).mockReturnValue(mockHandler);

    renderWithRouter(<CityPlaceCardFavorites cityPlaceInfo={mockCityPlace} />);

    expect(useHandleFavoriteClick.default).toHaveBeenCalledWith(mockCityPlace);
  });
});
