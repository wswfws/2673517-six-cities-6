import MainPage from '../../pages/main/main.tsx';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import FavoritesPage from '../../pages/favorites/favorites.tsx';
import LoginPage from '../../pages/login/login.tsx';
import OfferPage from '../../pages/offer/offer.tsx';
import Error404Page from '../../pages/404.tsx';
import PrivateRoute from './private-route.tsx';
import useAppRoutes, {ROUTE_CONFIG} from './use-app-routes.ts';


const AppRoutes = () => {
  const { getCityPath } = useAppRoutes();

  return (
    <Routes>
      <Route path={ROUTE_CONFIG.ROOT}>
        <Route
          index
          element={
            <Navigate
              to={getCityPath()}
              replace
            />
          }
        />
        <Route
          path={ROUTE_CONFIG.CITY}
          element={<MainPage />}
        />
        <Route
          path={ROUTE_CONFIG.FAVORITES}
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTE_CONFIG.LOGIN}
          element={<LoginPage />}
        />
        <Route
          path={ROUTE_CONFIG.OFFER}
          element={<OfferPage />}
        />
      </Route>
      <Route
        path={ROUTE_CONFIG.WILDCARD}
        element={<Error404Page />}
      />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
