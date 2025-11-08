import CityPlaceCard from '../../components/widgets/city-place-card.tsx';
import LocationsTabs from '../../components/widgets/locations-tabs.tsx';
import {cities} from '../../api/temp-get-places.tsx';
import {useParams} from 'react-router-dom';
import EmptyMainPage from './empty-page.tsx';
import Header from '../../components/widgets/header.tsx';
import {useEffect, useState} from 'react';
import MapCities from '../../components/shared/map-cities.tsx';
import type {Point} from '../../components/shared/map-types.ts';

import {useAppDispatch, useAppSelector} from '../../store/hooks.ts';
import {setCity} from '../../store/action.ts';

export default function MainPage() {

  const params = useParams();
  const dispatch = useAppDispatch();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();

  const currentCity = useAppSelector((state) => state.offers.city);
  const places = useAppSelector((state) => state.offers.places);

  const city = params.city;

  useEffect(() => {
    if (!city) {
      return;
    }
    dispatch(setCity(city));

  }, [city, dispatch]);

  useEffect(() => {
    if (places && places.length > 0) {
      setSelectedPlaceId(places[0].id);
    } else {
      setSelectedPlaceId(undefined);
    }
  }, [places]);

  if (!city) {
    return <h1> Город не найден</h1>;
  }

  if (!places || places.length === 0) {
    return <EmptyMainPage location={city}/>;
  }

  const selectedPlace = places.find((t) => t.id === selectedPlaceId);
  const selectedPlacePoint: Point | undefined = selectedPlace && {
    id: selectedPlace.id,
    latitude: selectedPlace.location.latitude,
    longitude: selectedPlace.location.longitude,
  };

  const cityInfo = cities.find((c) => c.name === currentCity);

  return (
    <div className='page page--gray page--main'>
      <Header tempLoginStatus={'login'}/>
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
                  <CityPlaceCard cityPlaceInfo={place} key={place.id} onSelect={setSelectedPlaceId}/>
                ))}

              </div>
            </section>
            {selectedPlacePoint && cityInfo &&
              <div className='cities__right-section'>
                <MapCities
                  key={city} // Добавляем ключ для принудительного пересоздания
                  city={cityInfo}
                  points={places.map((t) => ({
                    id: t.id,
                    latitude: t.location.latitude,
                    longitude: t.location.longitude,
                  }))}
                  selectedPoint={selectedPlacePoint}
                />
              </div>}
          </div>
        </div>
      </main>
    </div>
  );
}
