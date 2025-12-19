import {useEffect, useMemo, useState} from 'react';
import Header from '../../components/widgets/header.tsx';
import Footer from '../../components/widgets/footer.tsx';
import useAppRoutes from '../../components/app/use-app-routes.ts';
import CityPlaceCardFavorites from '../../components/widgets/city-place-card-favorites.tsx';
import {Link} from 'react-router-dom';
import {useCities} from '../../store/hooks.ts';
import {CityPlaceInfo} from '../../components/shared/city-place';
import {api} from '../../store';
import {toast} from 'react-toastify';
import EmptyFavoritesPage from './empty-page.tsx';

export default function FavoritesPage() {
  const {getCityPath} = useAppRoutes();
  const cities = useCities();

  const [favorites, setFavorites] = useState<CityPlaceInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const response = await api.get<CityPlaceInfo[]>('/favorite');
        if (mounted) {
          setFavorites(response.data);
        }
      } catch (e) {
        toast.error('Failed to load favorite places.');
        if (mounted) {
          setFavorites([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    const onFavoritesChanged = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as CityPlaceInfo;
      setFavorites((prev) => {
        if (!prev) {
          return prev;
        }
        // if updated item isFavorite === false => remove from list
        if (!detail.isFavorite) {
          return prev.filter((p) => p.id !== detail.id);
        }
        // if isFavorite === true => add or replace
        const exists = prev.find((p) => p.id === detail.id);
        if (exists) {
          return prev.map((p) => p.id === detail.id ? detail : p);
        }
        return [...prev, detail];
      });
    };
    window.addEventListener('favoritesChanged', onFavoritesChanged as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('favoritesChanged', onFavoritesChanged as EventListener);
    };
  }, []);

  const favoritesByCity = useMemo(() => {
    if (!favorites) {
      return new Map<string, CityPlaceInfo[]>();
    }
    const map = new Map<string, CityPlaceInfo[]>();
    favorites.forEach((place) => {
      const cityName = place.city.name;
      const arr = map.get(cityName) ?? [];
      arr.push(place);
      map.set(cityName, arr);
    });
    return map;
  }, [favorites]);

  if (favorites && favorites.length === 0) {
    return <EmptyFavoritesPage />;
  }

  return (
    <div className='page'>
      <Header/>
      <main className='page__main page__main--favorites'>
        <div className='page__favorites-container container'>
          <section className='favorites'>
            <h1 className='favorites__title'>Saved listing</h1>
            <ul className='favorites__list'>
              {isLoading && <li>Loading favorites...</li>}
              {!isLoading && cities.map((city) => {
                const favoritePlaces = favoritesByCity.get(city.name) ?? [];
                if (favoritePlaces.length === 0) {
                  return null;
                }
                return (
                  <li className='favorites__locations-items' key={city.name}>
                    <div className='favorites__locations locations locations--current'>
                      <div className='locations__item'>
                        <Link className='locations__item-link' to={getCityPath(city.name)}>
                          <span>{city.name}</span>
                        </Link>
                      </div>
                    </div>
                    <div className='favorites__places'>
                      {favoritePlaces.map((place) => (
                        <CityPlaceCardFavorites key={place.id} cityPlaceInfo={place} />
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
