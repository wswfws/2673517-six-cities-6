import Header from '../../components/widgets/header.tsx';
import Footer from '../../components/widgets/footer.tsx';
import getPlaces from '../../api/temp-get-places.tsx';
import useAppRoutes from '../../components/app/use-app-routes.ts';
import CityPlaceCardFavorites from '../../components/widgets/city-place-card-favorites.tsx';
import {Link} from 'react-router-dom';
import {useCities} from "../../store/hooks.ts";

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
              {cities.map((city) => {
                const places = getPlaces(city.name).filter((p) => p.isFavorite);
                if (places && places.length > 0) {
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
                        {places.map((place) => <CityPlaceCardFavorites key={place.id} cityPlaceInfo={place}/>)}
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
