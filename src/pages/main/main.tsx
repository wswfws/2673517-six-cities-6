import CityPlaceCard from '../../components/widgets/city-place-card.tsx';
import LocationsTabs from '../../components/widgets/locations-tabs.tsx';
import getPlaces from "../../api/temp-get-places.tsx";
import {useParams} from "react-router-dom";
import EmptyMainPage from "./empty-page.tsx";
import Header from "../../components/widgets/header.tsx";

export default function MainPage() {

  const params = useParams();
  if (!params.city) {
    return <h1> Город не найден</h1>;
  }

  const city = params.city;
  const places = getPlaces(city);

  if (!places || places.length === 0) {
    return <EmptyMainPage location={city}/>
  }

  return (
    <div className='page page--gray page--main'>
      <Header tempLoginStatus={"login"}/>
      <main className='page__main page__main--index'>
        <h1 className='visually-hidden'>Cities</h1>
        <LocationsTabs/>
        <div className='cities'>
          <div className='cities__places-container container'>
            <section className='cities__places places'>
              <h2 className='visually-hidden'>Places</h2>
              <b className='places__found'>{places.length} places to stay in {city}</b>
              <form className='places__sorting' action='#' method='get'>
                <span className='places__sorting-caption'>Sort by</span>
                <span className='places__sorting-type' tabIndex={0}>
                  Popular
                  <svg className='places__sorting-arrow' width='7' height='4'>
                    <use xlinkHref='#icon-arrow-select'></use>
                  </svg>
                </span>
                <ul className='places__options places__options--custom places__options--opened'>
                  <li className='places__option places__option--active' tabIndex={0}>Popular</li>
                  <li className='places__option' tabIndex={0}>Price: low to high</li>
                  <li className='places__option' tabIndex={0}>Price: high to low</li>
                  <li className='places__option' tabIndex={0}>Top rated first</li>
                </ul>
              </form>
              <div className='cities__places-list places__list tabs__content'>

                {places.map((place) => (
                  <CityPlaceCard {...place} key={place.id}/>
                ))}

              </div>
            </section>
            <div className='cities__right-section'>
              <section className='cities__map map'></section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
