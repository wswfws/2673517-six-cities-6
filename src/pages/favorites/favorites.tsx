import Header from '../../components/widgets/header.tsx';
import Footer from '../../components/widgets/footer.tsx';
import useAppRoutes from '../../components/app/use-app-routes.ts';
import CityPlaceCardFavorites from '../../components/widgets/city-place-card-favorites.tsx';
import {Link} from 'react-router-dom';
import {useCities, usePlacesByCity} from '../../store/hooks.ts';
import {City} from '../../components/shared/map-types.ts';
import {CityPlaceInfo} from '../../components/shared/city-place';

function CityFavoritesBlock({city, getCityPath}: {city: City; getCityPath: (name: string) => string}) {
  const places = usePlacesByCity(city.name);
  const favoritePlaces = places.filter((place: CityPlaceInfo) => place.isFavorite);
  if (favoritePlaces.length === 0) {
    return null;
  }

  return (
    <li className='favorites__locations-items'>
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
}

export default function FavoritesPage() {

  const {getCityPath} = useAppRoutes();
  const cities = useCities();

  return (
    <div className='page'>
      <Header tempLoginStatus={'login'}/>
      <main className='page__main page__main--favorites'>
        <div className='page__favorites-container container'>
          <section className='favorites'>
            <h1 className='favorites__title'>Saved listing</h1>
            <ul className='favorites__list'>
              {cities.map((city) => (
                <CityFavoritesBlock key={city.name} city={city} getCityPath={getCityPath} />
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
