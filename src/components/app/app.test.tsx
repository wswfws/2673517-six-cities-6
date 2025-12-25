import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render} from '@testing-library/react';
import App from './app.tsx';
import store from '../../store';
import {checkAuthAction} from '../../store/api-actions.ts';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';

vi.mock('./use-app-routes.ts', () => ({
  default: vi.fn(() => ({
    getCityPath: () => '/city/Paris',
  })),
  ROUTE_CONFIG: {
    ROOT: '/',
    CITY: '/city/:city',
    FAVORITES: '/favorites',
    LOGIN: '/login',
    OFFER: '/offer/:id',
    WILDCARD: '*',
  }
}));

vi.mock('../../store/api-actions.ts', () => ({
  checkAuthAction: vi.fn(() => ({type: 'CHECK'})),
}));

vi.mock('../../store', () => ({
  default: {dispatch: vi.fn()},
}));

vi.mock('../../store/hooks.ts', async () => {
  const actual: typeof import('../../store/hooks.ts') = await vi.importActual('../../store/hooks.ts');
  return {
    ...actual,
    useAuthorizationStatus: vi.fn(() => 'NO_AUTH'),
  };
});

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches checkAuthAction on mount', () => {
    const providerStore = configureStore({
      reducer: {
        offers: () => ({places: [], city: 'Paris', isLoadingPlaces: false}),
        user: () => ({authorizationStatus: 'NO_AUTH', userData: null}),
      },
    });

    render(
      <Provider store={providerStore}>
        <App/>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith({type: 'CHECK'});
    expect(checkAuthAction).toHaveBeenCalled();
  });
});
