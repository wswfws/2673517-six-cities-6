import {Dispatch, memo, SetStateAction} from "react";
import {CityPlaceInfo} from "../shared/city-place";
import CityPlaceCard from "./city-place-card.tsx";

const CityPlacesList = memo(({sortedPlaces, setSelectedPlaceId}: {
  sortedPlaces: CityPlaceInfo[],
  setSelectedPlaceId: Dispatch<SetStateAction<string | undefined>>
}) => {
  return (
    <div className='cities__places-list places__list tabs__content'>
      {sortedPlaces.map((place) => (
        <CityPlaceCard cityPlaceInfo={place} key={place.id} onSelect={setSelectedPlaceId}/>
      ))}
    </div>
  );
})

export default CityPlacesList;
