import {useEffect, useRef} from 'react';
import {Icon, layerGroup, Marker} from 'leaflet';
import {URL_MARKER_CURRENT, URL_MARKER_DEFAULT} from '../../const';
import 'leaflet/dist/leaflet.css';
import {City, Point, Points} from './map-types.ts';
import useMap from '../hocs/use-map.tsx';

type MapProps = {
  city: City;
  mainPoint: Point;
  neighborPoint: Points;
};

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const mainCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function MapOffer(props: MapProps) {
  const {city, mainPoint, neighborPoint} = props;

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      neighborPoint.forEach((point) => {
        new Marker({
          lat: point.latitude,
          lng: point.longitude,
        }).setIcon(defaultCustomIcon).addTo(markerLayer);
      });

      new Marker({
        lat: mainPoint.latitude,
        lng: mainPoint.longitude,
      }).setIcon(mainCustomIcon).addTo(markerLayer);


      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, mainPoint, neighborPoint]);

  return <section className='offer__map map' ref={mapRef}></section>;
}

export default MapOffer;
