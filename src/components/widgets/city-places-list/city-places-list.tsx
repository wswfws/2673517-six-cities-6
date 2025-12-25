import { Dispatch, memo, NamedExoticComponent, SetStateAction } from 'react';
import {CityPlaceInfo} from '../../shared/city-place/city-place.ts';
import CityPlaceCard from '../city-place-card/city-place-card.tsx';

export type CityPlacesListProps = {
  sortedPlaces: CityPlaceInfo[];
  onSelectPlaceId: Dispatch<SetStateAction<string | undefined>>;
};

const CityPlacesListComponent = ({sortedPlaces, onSelectPlaceId}: CityPlacesListProps) => (
  <div className='cities__places-list places__list tabs__content'>
    {sortedPlaces.map((place) => (
      <CityPlaceCard cityPlaceInfo={place} key={place.id} onSelect={onSelectPlaceId}/>
    ))}
  </div>
);

const CityPlacesList: NamedExoticComponent<CityPlacesListProps> = memo(CityPlacesListComponent);
CityPlacesList.displayName = 'CityPlacesList';

export default CityPlacesList;
