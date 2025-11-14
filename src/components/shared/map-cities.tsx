import MapGeneric from './map-generic';
import {City, Points, Point} from './map-types.ts';

type MapProps = {
  city: City;
  points: Points;
  selectedPoint?: Point;
};

export default function MapCities({city, points, selectedPoint}: MapProps) {
  return (
    <MapGeneric
      city={city}
      points={points}
      activeId={selectedPoint?.id}
      className='cities__map map'
    />
  );
}
