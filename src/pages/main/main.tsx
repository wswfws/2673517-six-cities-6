import {useState} from 'react';
import CityPlaceCard from '../../components/widgets/city-place-card.tsx';
import LocationsTabs from '../../components/widgets/locations-tabs.tsx';
import {useParams} from 'react-router-dom';
import EmptyMainPage from './empty-page.tsx';
import Header from '../../components/widgets/header.tsx';
import MapCities from '../../components/shared/map-cities.tsx';
import useMain from './use-main.ts';
import SortOptions from '../../components/widgets/sort-options.tsx';
import useSorterPlaces, {SortOption} from './use-sorter-places.ts';
import SimpleLoader from "../../components/shared/loader";

export default function MainPage() {
  const params = useParams();
  const {isLoadingPlaces, currentCity, places, selectedPlacePoint, setSelectedPlaceId, cityInfo} = useMain(params.city);

  const [sortType, setSortType] = useState<SortOption>('Popular');
  const sortedPlaces = useSorterPlaces(places, sortType);

  if (!params.city) {
    return <h1> Город не найден</h1>;
  }

  if (isLoadingPlaces) {
    return <SimpleLoader height={70} width={70}/>
  }

  if (!places || places.length === 0) {
    return <EmptyMainPage location={currentCity}/>;
  }

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
              <b className='places__found'>{sortedPlaces.length} places to stay in {currentCity}</b>

              <SortOptions current={sortType} onChange={(opt) => setSortType(opt)}/>

              <div className='cities__places-list places__list tabs__content'>
                {sortedPlaces.map((place) => (
                  <CityPlaceCard cityPlaceInfo={place} key={place.id} onSelect={setSelectedPlaceId}/>
                ))}
              </div>
            </section>
            {selectedPlacePoint && cityInfo &&
              <div className='cities__right-section'>
                <MapCities
                  key={currentCity}
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
