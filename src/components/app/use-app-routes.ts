const ROUTE_CONFIG = {
  ROOT: '/',
  FAVORITES: '/favorites',
  LOGIN: '/login',
  OFFER: '/offer/:id',
  CITY: '/:city',
  WILDCARD: '/*',
} as const;

const APP_CONFIG = {
  DEFAULT_CITY: 'Paris',
} as const;

export default function useAppRoutes() {
  const getCityPath = (city: string = APP_CONFIG.DEFAULT_CITY) => `/${city}`;
  const getOfferPath = (id: string) => `/offer/${id}`;

  return {
    getCityPath,
    getOfferPath,
  };
}

export {ROUTE_CONFIG, APP_CONFIG};
