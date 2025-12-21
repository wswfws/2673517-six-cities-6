import MapGeneric from './map-generic.tsx';
import {City, Point, Points} from './map-types.ts';
import {Icon} from 'leaflet';
import {URL_MARKER_CURRENT, URL_MARKER_DEFAULT} from '../../../const.ts';

type MapProps = {
  city: City;
  mainPoint: Point;
  neighborPoint: Points;
};

const defaultIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const mainIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

export function MapOffer({city, mainPoint, neighborPoint}: MapProps) {
  return (
    <MapGeneric
      city={city}
      points={[...neighborPoint, mainPoint]}
      activeId={mainPoint.id}
      className='offer__map map'
      defaultIcon={defaultIcon}
      activeIcon={mainIcon}
    />
  );
}
