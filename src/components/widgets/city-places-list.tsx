import { Dispatch, memo, NamedExoticComponent, SetStateAction } from 'react';
import {CityPlaceInfo} from '../shared/city-place';
import CityPlaceCard from './city-place-card.tsx';

type CityPlacesListProps = {
  sortedPlaces: CityPlaceInfo[];
  setSelectedPlaceId: Dispatch<SetStateAction<string | undefined>>;
};

const CityPlacesListComponent = ({sortedPlaces, setSelectedPlaceId}: CityPlacesListProps) => (
  <div className='cities__places-list places__list tabs__content'>
    {sortedPlaces.map((place) => (
      <CityPlaceCard cityPlaceInfo={place} key={place.id} onSelect={setSelectedPlaceId}/>
    ))}
  </div>
);

const CityPlacesList: NamedExoticComponent<CityPlacesListProps> = memo(CityPlacesListComponent);
CityPlacesList.displayName = 'CityPlacesList';

export default CityPlacesList;
