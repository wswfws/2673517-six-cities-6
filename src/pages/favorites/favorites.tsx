import Header from '../../components/widgets/header.tsx';
import Footer from '../../components/widgets/footer.tsx';
import getPlaces, {getCities} from "../../api/temp-get-places.tsx";
import useAppRoutes from "../../components/app/use-app-routes.ts";
import CityPlaceCardFavorites from "../../components/widgets/city-place-card-favorites.tsx";

export default function FavoritesPage() {

  const {getCityPath} = useAppRoutes();

  return (
    <div className='page'>
      <Header tempLoginStatus={'login'}/>
      <main className='page__main page__main--favorites'>
        <div className='page__favorites-container container'>
          <section className='favorites'>
            <h1 className='favorites__title'>Saved listing</h1>
            <ul className='favorites__list'>
              {getCities().map((city) => {
                const places = getPlaces(city).filter(p => p.isFavorite);
                if (places && places.length > 0) {
                  return (
                    <li className='favorites__locations-items' key={city}>
                      <div className='favorites__locations locations locations--current'>
                        <div className='locations__item'>
                          <a className='locations__item-link' href={getCityPath(city)}>
                            <span>{city}</span>
                          </a>
                        </div>
                      </div>
                      <div className='favorites__places'>
                        {places.map((place) => <CityPlaceCardFavorites cityPlaceInfo={place}/>)}
                      </div>
                    </li>
                  )
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
