import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import OfferPage from './offer.tsx';
import {AuthorizationStatus} from '../../const.ts';
import {ROUTE_CONFIG} from '../../components/app/use-app-routes.ts';

const fetchOfferActionMock = vi.fn();
const postFavoriteActionMock = vi.fn();
const dispatchMock = vi.fn();
const useAppSelectorMock = vi.fn();
const useAppDispatchMock = vi.fn(() => dispatchMock);
const useAuthorizationStatusMock = vi.fn();
const useParamsMock = vi.fn();
const navigateMock = vi.fn();
const useNavigateMock = vi.fn(() => navigateMock);

vi.mock('../../store/api-actions.ts', () => ({
  fetchOfferAction: (...args: unknown[]) => fetchOfferActionMock(...args),
  postFavoriteAction: (...args: unknown[]) => postFavoriteActionMock(...args),
}));

vi.mock('../../store/hooks.ts', () => ({
  useAppDispatch: () => useAppDispatchMock(),
  useAppSelector: (selector: (state: typeof mockState) => unknown) => useAppSelectorMock(selector),
  useAuthorizationStatus: () => useAuthorizationStatusMock(),
}));

vi.mock('../../components/widgets/header.tsx', () => ({
  default: () => <div data-testid='header'>Header</div>,
}));

vi.mock('../../components/widgets/reviews/review-list.tsx', () => ({
  default: () => <div data-testid='review-list'>Reviews</div>,
}));

vi.mock('../../components/shared/map-offer.tsx', () => ({
  default: () => <div data-testid='map-offer'>Map</div>,
}));

vi.mock('../../components/widgets/city-place-card.tsx', () => ({
  default: ({cityPlaceInfo}: {cityPlaceInfo: {id: string}}) => (
    <div data-testid='neighbor-card'>{cityPlaceInfo.id}</div>
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual: typeof import('react-router-dom') = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => useParamsMock(),
    useNavigate: () => useNavigateMock(),
  };
});

vi.mock('../404.tsx', () => ({
  default: () => <div data-testid='error-404'>Not Found</div>,
}));

type OffersState = {
  offers: {
    offerDetail: {
      id: string;
      title: string;
      type: string;
      price: number;
      previewImage: string;
      images: string[];
      isPremium: boolean;
      isFavorite: boolean;
      rating: number;
      bedrooms: number;
      maxAdults: number;
      goods: string[];
      description: string;
      city: { name: string; location: { latitude: number; longitude: number; zoom: number } };
      location: { latitude: number; longitude: number; zoom: number };
      host?: { name: string; avatarUrl: string; isPro: boolean };
    } | null;
    neighbors: Array<{ id: string; location: { latitude: number; longitude: number } }>;
    comments: unknown[];
    isLoadingOffer: boolean;
    offerNotFound: boolean;
  };
};

let mockState: OffersState;

const renderPage = () =>
  render(
    <MemoryRouter>
      <OfferPage />
    </MemoryRouter>
  );

describe('OfferPage', () => {
  beforeEach(() => {
    mockState = {
      offers: {
        offerDetail: {
          id: 'offer-1',
          title: 'Beautiful Apartment',
          type: 'Apartment',
          price: 150,
          previewImage: '/img/offer.jpg',
          images: ['/img/1.jpg', '/img/2.jpg'],
          isPremium: true,
          isFavorite: false,
          rating: 4.8,
          bedrooms: 2,
          maxAdults: 4,
          goods: ['Wi-Fi', 'Washing machine'],
          description: 'Great apartment in city center',
          city: {name: 'Amsterdam', location: {latitude: 52.37, longitude: 4.89, zoom: 10}},
          location: {latitude: 52.38, longitude: 4.9, zoom: 16},
          host: {name: 'Host', avatarUrl: 'avatar', isPro: true},
        },
        neighbors: [
          {id: 'neighbor-1', location: {latitude: 52.39, longitude: 4.9}},
        ],
        comments: [],
        isLoadingOffer: false,
        offerNotFound: false,
      },
    };

    dispatchMock.mockReset();
    useAppDispatchMock.mockReturnValue(dispatchMock);
    useAppSelectorMock.mockImplementation((selector) => selector(mockState));
    useAuthorizationStatusMock.mockReturnValue(AuthorizationStatus.Auth);
    useParamsMock.mockReturnValue({id: 'offer-1'});
    navigateMock.mockReset();
    useNavigateMock.mockReturnValue(navigateMock);

    fetchOfferActionMock.mockImplementation((id: string) => ({type: 'FETCH_OFFER', meta: id}));
    postFavoriteActionMock.mockImplementation((payload: {offerId: string; status: number}) => ({
      type: 'POST_FAVORITE',
      meta: payload,
    }));
  });

  it('dispatches offer fetch on mount when id exists', () => {
    renderPage();

    expect(fetchOfferActionMock).toHaveBeenCalledWith('offer-1');
    expect(dispatchMock).toHaveBeenCalledWith({type: 'FETCH_OFFER', meta: 'offer-1'});
  });

  it('renders offer details when data is available', () => {
    renderPage();

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
    expect(screen.getByTestId('map-offer')).toBeInTheDocument();
    expect(screen.getByTestId('neighbor-card')).toHaveTextContent('neighbor-1');
    expect(screen.getByTestId('review-list')).toBeInTheDocument();
  });

  it('shows loader when offer is still loading', () => {
    mockState.offers.isLoadingOffer = true;

    renderPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders 404 page when id is missing', () => {
    useParamsMock.mockReturnValue({});

    renderPage();

    expect(screen.getByTestId('error-404')).toBeInTheDocument();
  });

  it('renders 404 page when offer is not found', () => {
    mockState.offers.offerNotFound = true;
    mockState.offers.offerDetail = null;

    renderPage();

    expect(screen.getByTestId('error-404')).toBeInTheDocument();
  });

  it('redirects to login when favorite clicked without auth', async () => {
    useAuthorizationStatusMock.mockReturnValue(AuthorizationStatus.NoAuth);

    renderPage();

    await userEvent.click(screen.getByRole('button', {name: /to bookmarks/i}));

    expect(navigateMock).toHaveBeenCalledWith(ROUTE_CONFIG.LOGIN);
    expect(postFavoriteActionMock).not.toHaveBeenCalled();
  });

  it('dispatches favorite toggle when authorized', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', {name: /to bookmarks/i}));

    expect(postFavoriteActionMock).toHaveBeenCalledWith({offerId: 'offer-1', status: 1});
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'POST_FAVORITE',
      meta: {offerId: 'offer-1', status: 1},
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
