import {useState} from 'react';
import LocationsTabs from '../../components/widgets/locations-tabs/locations-tabs.tsx';
import {useNavigate, useParams} from 'react-router-dom';
import EmptyMainPage from './empty-page.tsx';
import Header from '../../components/widgets/header/header.tsx';
import SortOptions from '../../components/widgets/sort-options/sort-options.tsx';
import useSorterPlaces, {SortOption} from './use-sorter-places.ts';
import SimpleLoader from '../../components/shared/loader';
import CityPlacesList from '../../components/widgets/city-places-list/city-places-list.tsx';
import useMain from './use-main.ts';
import {STATIC_CITIES} from '../../const.ts';
import {ROUTE_CONFIG} from '../../components/app/use-app-routes.ts';
import {MapCities} from '../../components/shared/maps';

export default function MainPage() {
  const params = useParams();
  const navigate = useNavigate();
  const cityParam = params.city;
  const {
    isLoadingPlaces,
    currentCity,
    places,
    selectedPlacePoint,
    setSelectedPlaceId,
    cityInfo,
    mapPoints
  } = useMain(cityParam);
  const [sortType, setSortType] = useState<SortOption>('Popular');
  const sortedPlaces = useSorterPlaces(places, sortType);

  if (!cityParam || !STATIC_CITIES.includes(cityParam)) {
    navigate(ROUTE_CONFIG.WILDCARD);
  }

  if (isLoadingPlaces) {
    return <SimpleLoader height={70} width={70}/>;
  }

  if (!places || places.length === 0) {
    return <EmptyMainPage location={currentCity}/>;
  }

  return (
    <div className='page page--gray page--main'>
      <Header/>
      <main className='page__main page__main--index'>
        <h1 className='visually-hidden'>Cities</h1>
        <LocationsTabs/>
        <div className='cities'>
          <div className='cities__places-container container'>
            <section className='cities__places places'>
              <h2 className='visually-hidden'>Places</h2>
              <b className='places__found'>{sortedPlaces.length} places to stay in {currentCity}</b>

              <SortOptions current={sortType} onChange={(opt) => setSortType(opt)}/>
              <CityPlacesList sortedPlaces={sortedPlaces} onSelectPlaceId={setSelectedPlaceId}/>

            </section>
            {selectedPlacePoint && cityInfo &&
              <div className='cities__right-section'>
                <MapCities
                  key={currentCity}
                  city={cityInfo}
                  points={mapPoints}
                  selectedPoint={selectedPlacePoint}
                />
              </div>}
          </div>
        </div>
      </main>
    </div>
  );
}
